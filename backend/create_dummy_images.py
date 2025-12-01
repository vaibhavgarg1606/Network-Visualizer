from PIL import Image
import os

output_dir = "output"
os.makedirs(output_dir, exist_ok=True)

# Create red, green, blue dummy images
size = (256, 256)

Image.new('L', size, color=100).save(os.path.join(output_dir, "rgb_R.png"))
Image.new('L', size, color=150).save(os.path.join(output_dir, "rgb_G.png"))
Image.new('L', size, color=200).save(os.path.join(output_dir, "rgb_B.png"))

print("Dummy images created.")
