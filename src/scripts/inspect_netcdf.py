import xarray as xr


FILE_PATH = "/Users/****/Desktop/SchoolWork/msc_advanced_computer_science/msc_project/aquavates/src/rainfall/2022/01/sm2022_01_01.v2.3.1.nc"

if __name__ == "__main__":
    if not FILE_PATH:
        raise ValueError("FILE_PATH was not provided")

    ds = xr.open_dataset(FILE_PATH)
    print(ds)
    print("=" * 10)
    print(ds["sm_c4grass"].attrs)        # units, long_name, etc.
    print("=" * 10)
    print(ds["sm_c4grass"].dims)         # dimensions, e.g. ('time','soil','lat','lon')

"""
Viewing the attrs and dims of both `smc_avail_top` and `smcl` gave the following values:

smc_avail_top
- ds["smc_avail_top"].attrs: {'units': 'kg m-2', 'long_name': 'Gridbox available moisture in top 1.000000m of soil', 'short_name': 'smc_avail_top'}
- ds["smc_avail_top"].dims: ('time', 'lat', 'lon')

smcl
- ds["smcl"].attrs: {'units': 'kg m-2', 'long_name': 'Gridbox moisture content of each soil layer', 'short_name': 'smcl'}
- ds["smcl"].dims: ('time', 'soil', 'lat', 'lon')

Which is more suitable for my goal?
"""