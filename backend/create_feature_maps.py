from PIL import Image
import os
import random

output_dir = os.path.join("output", "featuremaps")
os.makedirs(output_dir, exist_ok=True)

# VGG16 Layer IDs used in frontend
layer_ids = [0, 2, 4, 5, 7, 9, 10]

for lid in layer_ids:
    # Create a random noise image
    img = Image.new('L', (64, 64))
    pixels = img.load()
    for i in range(img.size[0]):
        for j in range(img.size[1]):
            pixels[i, j] = random.randint(0, 255)
    
    img.save(os.path.join(output_dir, f"layer_{lid}_channel_0.png"))

# Create placeholder for MNIST
Image.new('L', (28, 28), color=0).save(os.path.join("output", "placeholder.png"))

print("Dummy feature maps created.")
