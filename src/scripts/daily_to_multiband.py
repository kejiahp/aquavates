import dask
import xarray as xr
import glob


YEAR = "2022"

files: list[str] = sorted(glob.glob(pathname=f"rainfall/{YEAR}/*/*.nc"))
ds = xr.open_mfdataset(files, combine='nested', concat_dim='time')
ds.to_netcdf(f"soil_moisture_{YEAR}_multiband.nc")

print("Download complete.")