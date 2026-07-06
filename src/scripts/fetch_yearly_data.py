from typing import List

import os
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://gws-access.jasmin.ac.uk/public/tamsat/soil_moisture/data/v2.3.1/daily/2022/"
OUT_DIR = "rainfall/2022"

# Create output directory
os.makedirs(OUT_DIR, exist_ok=True)

# Fetch directory listing
print("Fetching file list...")

yearly_downloads: dict[str, List[str]]  = {}

for i in range(1, 13):
    ni = "0"+ str(i) if i < 10 else str(i)
    html = requests.get(BASE_URL + ni).text
    soup = BeautifulSoup(html, "html.parser")

    # Extract all .nc files
    files = [a["href"] for a in soup.find_all("a") if a["href"].endswith(".nc")]
    print(f"Found {len(files)} files for month {i}")
    yearly_downloads[ni] = files


# Download each file
for key in yearly_downloads:
    for f in yearly_downloads[key]:
        out_dir = os.path.join(OUT_DIR, key)
        os.makedirs(out_dir, exist_ok=True)

        out_path: str = os.path.join(out_dir, f)

        # Skip if already downloaded
        if os.path.exists(out_path):
            print(f"Skipping {f} (already exists)")
            continue

        url = BASE_URL + key + "/" + f
        print(f"Downloading {f}...")

        with requests.get(url, stream=True) as r:
            r.raise_for_status()
            with open(out_path, "wb") as fp:
                for chunk in r.iter_content(chunk_size=8192):
                    fp.write(chunk)

print("Download complete.")
