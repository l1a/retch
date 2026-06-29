# retch

> A fast, feature-rich system information fetcher.
> More information: <https://github.com/l1a/retch>.

- Display system information with default settings:

`retch`

- Display system information in short format:

`retch --short`

- Display system information in long format:

`retch --long`

- Display system information with a specific distribution logo:

`retch --logo {{distribution_name}}`

- Display system information using a specific theme:

`retch --theme {{theme_name}}`

- Display weather for a specific location (use `--weather-unit celsius` for Celsius):

`retch --long --weather-location {{city_name|zip_code|lat,lon}}`

- Print the default configuration to `stdout`:

`retch --generate-config`

- Write the default configuration to a file:

`retch --write-config {{path/to/config.toml}}`
