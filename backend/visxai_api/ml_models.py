import torch
import torch.nn as nn

class SmallMNISTCNN(nn.Module):
    def __init__(self):
        super().__init__()

        self.block1 = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1),  # conv1
            nn.ReLU()
        )
        self.pool1 = nn.MaxPool2d(2)

        self.block2 = nn.Sequential(
            nn.Conv2d(16, 32, 3, padding=1),  # conv2
            nn.ReLU()
        )
        self.pool2 = nn.MaxPool2d(2)

        self.fc = nn.Linear(32 * 7 * 7, 10)

    def forward(self, x):
        x = self.pool1(self.block1(x))
        x = self.pool2(self.block2(x))
        x = x.view(x.size(0), -1)
        return self.fc(x)
