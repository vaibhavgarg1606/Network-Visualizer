import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import cv2
import os

# -----------------------------------------------------
# Make output folders
# -----------------------------------------------------
os.makedirs("output", exist_ok=True)
os.makedirs("output/featuremaps", exist_ok=True)
os.makedirs("output/kernels", exist_ok=True)

# -----------------------------------------------------
# 1. LOAD MODEL
# -----------------------------------------------------
model = models.vgg16(pretrained=True)
model.eval()

# Get all conv layers for kernel extraction
conv_layers = [layer for layer in model.features if isinstance(layer, nn.Conv2d)]

# -----------------------------------------------------
# 2. LOAD + PREPROCESS IMAGE
# -----------------------------------------------------
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

img_path = "C:\\Users\\vaibh\\Downloads\\panda.jpg"
img = Image.open(img_path).convert("RGB")
input_tensor = preprocess(img).unsqueeze(0)
input_tensor.requires_grad = True

# Save raw RGB channels
raw_img = np.array(img)
cv2.imwrite("output/rgb_R.png", raw_img[:,:,0])
cv2.imwrite("output/rgb_G.png", raw_img[:,:,1])
cv2.imwrite("output/rgb_B.png", raw_img[:,:,2])

print("Saved RGB channels!")

# -----------------------------------------------------
# 3. EXTRACT FEATURE MAPS USING HOOKS
# -----------------------------------------------------
feature_maps = {}
layer_names = []

def hook_fn(module, input, output):
    layer_names.append(str(module))
    feature_maps[len(feature_maps)] = output.detach().cpu().numpy()

hooks = []
for layer in model.features:
    if isinstance(layer, (nn.Conv2d, nn.ReLU, nn.MaxPool2d)):
        hooks.append(layer.register_forward_hook(hook_fn))

output = model(input_tensor)

for h in hooks:
    h.remove()

print("Extracted feature maps!")

# SAVE FEATURE MAPS
print("Saving feature maps...")
for layer_id, fmap in feature_maps.items():
    fmap = fmap[0]  # remove batch dimension
    for ch in range(min(8, fmap.shape[0])):  # save first 8 channels to avoid spam
        fm = fmap[ch]
        fm = (fm - fm.min()) / (fm.max() - fm.min() + 1e-9)
        fm = (fm * 255).astype(np.uint8)
        cv2.imwrite(f"output/featuremaps/layer_{layer_id}_channel_{ch}.png", fm)

print("Feature maps saved!")

# -----------------------------------------------------
# 4. SAVE KERNELS (FIRST FEW)
# -----------------------------------------------------
print("Saving kernels...")
for i, conv in enumerate(conv_layers):
    W = conv.weight.detach().cpu().numpy()  # shape: (out_ch, in_ch, kH, kW)
    # Save only first 8 filters for readability
    for f in range(min(8, W.shape[0])):
        kernel = W[f][0]  # take first input channel
        kernel = (kernel - kernel.min()) / (kernel.max() - kernel.min() + 1e-9)
        kernel = (kernel * 255).astype(np.uint8)
        cv2.imwrite(f"output/kernels/conv{i}_filter{f}_channel0.png", kernel)

print("Kernels saved!")

# -----------------------------------------------------
# 5. PREDICTION
# -----------------------------------------------------
prob = torch.nn.functional.softmax(output, dim=1)
top_prob, top_catid = torch.topk(prob, 1)

print("Prediction:", top_catid.item(), "| Conf:", top_prob.item())

# Load ImageNet class labels
import json
labels_path = "https://s3.amazonaws.com/deep-learning-models/image-models/imagenet_class_index.json"
import urllib.request
class_idx = json.load(urllib.request.urlopen(labels_path))
idx2label = [class_idx[str(k)][1] for k in range(len(class_idx))]

print("Predicted Class:", idx2label[top_catid.item()])
print("Confidence:", float(top_prob))


# -----------------------------------------------------
# 6. GRAD-CAM IMPLEMENTATION
# -----------------------------------------------------
target_layer = model.features[-2]

gradients = []
activations = []

def backward_hook(module, grad_input, grad_output):
    gradients.append(grad_output[0])

def forward_hook(module, input, output):
    activations.append(output)

target_layer.register_forward_hook(forward_hook)
target_layer.register_backward_hook(backward_hook)

pred = model(input_tensor)
class_idx = pred.argmax().item()
loss = pred[:, class_idx]
loss.backward()

grad = gradients[0]
act = activations[0]

weights = grad.mean(dim=(2, 3), keepdim=True)
cam = (weights * act).sum(dim=1).squeeze().relu()

cam = cam.detach().cpu().numpy()
cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-9)

cv2.imwrite("output/gradcam.png", (cam * 255).astype(np.uint8))

print("Grad-CAM saved!")

# -----------------------------------------------------
# 7. ADVERSARIAL EXAMPLE
# -----------------------------------------------------
epsilon = 0.03
input_tensor.requires_grad = True
pred = model(input_tensor)
loss = pred[:, class_idx]
loss.backward()

sign_grad = input_tensor.grad.sign()
adv = torch.clamp(input_tensor + epsilon * sign_grad, 0, 1)

# convert tensor → image
adv_np = adv.squeeze().detach().permute(1,2,0).numpy()
adv_np = (adv_np * 255).astype(np.uint8)
cv2.imwrite("output/adversarial.png", adv_np)

print("Adversarial image saved!")
