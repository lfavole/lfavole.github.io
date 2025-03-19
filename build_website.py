import io
import json
import os
import platform
import shutil
import subprocess as sp
import sys
import tarfile
import tempfile
from pathlib import Path
from urllib.request import urlopen

# Download the latest release of zola
url = "https://api.github.com/repos/getzola/zola/releases/latest"
data = json.load(urlopen(url))
tag_name = data["tag_name"]
print(f"Latest zola version is {tag_name}")

# Download the zola binary
url = (
    f"https://github.com/getzola/zola/releases/download/{tag_name}/zola-{tag_name}-{platform.processor()}-"
    + (
        "pc-windows-msvc" if sys.platform == "win32"
        else "apple-darwin" if sys.platform == "darwin"
        else "unknown-linux-gnu"
    )
    + ".tar.gz"
)

output_file_name = "zola.exe" if sys.platform == "win32" else "zola"

with tempfile.TemporaryDirectory() as dir:
    output_file = Path(dir) / output_file_name
    print(f"Downloading {url} to {output_file}...")

    # Decompress the tarball and extract the zola binary
    with open(output_file, "wb") as f:
        with urlopen(url) as response:
            buffer = io.BytesIO()
            shutil.copyfileobj(response, buffer)
            buffer.seek(0)
            with tarfile.open(fileobj=buffer, mode="r:gz") as tar:
                shutil.copyfileobj(tar.extractfile(output_file_name), f)

    # Make the zola binary executable
    os.chmod(output_file, 0o755)
    print(f"Changed file attributes of {output_file_name}")

    # Build the website
    print("Running build command...")
    sp.run([output_file, "build"], check=True)

# Add the Keybase proof
KEYBASE_PROOF = os.getenv("KEYBASE_PROOF", "")
if KEYBASE_PROOF:
    with open("public/keybase.txt", "w") as f:
        f.write(KEYBASE_PROOF)
    print("Keybase proof added")
else:
    print("Keybase proof not found")

# Add the Google proof
GOOGLE_PROOF = os.getenv("GOOGLE_PROOF", "")
if GOOGLE_PROOF:
    with open(f"public/google{GOOGLE_PROOF}.html", "w") as f:
        f.write(f"google-site-verification: google{GOOGLE_PROOF}.html")
    print("Google proof added")
else:
    print("Google proof not found")
