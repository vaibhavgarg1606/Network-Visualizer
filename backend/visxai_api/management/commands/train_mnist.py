import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import matplotlib.pyplot as plt
from django.core.management.base import BaseCommand
from django.conf import settings
from visxai_api.ml_models import SmallMNISTCNN

class Command(BaseCommand):
    help = 'Trains the SmallMNISTCNN model'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Training Started...'))
        
        # Ensure directories exist
        model_dir = os.path.join(settings.BASE_DIR, 'saved_models')
        kernel_dir = os.path.join(settings.MEDIA_ROOT, 'kernels')
        os.makedirs(model_dir, exist_ok=True)
        os.makedirs(kernel_dir, exist_ok=True)

        device = "cuda" if torch.cuda.is_available() else "cpu"
        model = SmallMNISTCNN().to(device)

        # Training settings
        epochs = 5
        model_path = os.path.join(model_dir, "mnist_cnn.pth")

        transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize((0.5,), (0.5,))
        ])

        # Download data to a temp dir or project dir
        data_dir = os.path.join(settings.BASE_DIR, 'data')
        train_data = datasets.MNIST(root=data_dir, train=True, download=True, transform=transform)
        train_loader = DataLoader(train_data, batch_size=64, shuffle=True)

        loss_fn = nn.CrossEntropyLoss()
        optim_ = optim.Adam(model.parameters(), lr=0.001)

        for epoch in range(1, epochs + 1):
            total_loss = 0
            model.train()

            for images, labels in train_loader:
                images, labels = images.to(device), labels.to(device)

                optim_.zero_grad()
                out = model(images)
                loss = loss_fn(out, labels)
                loss.backward()
                optim_.step()

                total_loss += loss.item()

            avg_loss = total_loss / len(train_loader)
            self.stdout.write(f"Epoch {epoch}/{epochs} | Loss = {avg_loss:.4f}")

            # Save Kernels
            self.save_kernels(model, epoch, kernel_dir)

        torch.save(model.state_dict(), model_path)
        self.stdout.write(self.style.SUCCESS(f'\n✅ Training Done! Model saved to {model_path}'))

    def save_kernels(self, model, epoch, base_dir):
        conv_layers = [model.block1[0], model.block2[0]]
        conv_names = ["conv1", "conv2"]

        for layer, name in zip(conv_layers, conv_names):
            weight = layer.weight.data.cpu().numpy()
            out_c = weight.shape[0]

            epoch_dir = os.path.join(base_dir, f"{name}_epoch{epoch}")
            os.makedirs(epoch_dir, exist_ok=True)

            for i in range(out_c):
                kernel_img = weight[i, 0]
                k = kernel_img - kernel_img.min()
                k = k / (k.max() + 1e-5)

                plt.imshow(k, cmap="gray")
                plt.axis("off")
                plt.savefig(os.path.join(epoch_dir, f"kernel_{i}.png"), bbox_inches="tight", pad_inches=0)
                plt.close()
