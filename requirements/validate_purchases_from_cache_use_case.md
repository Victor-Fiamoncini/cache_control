# Validate Purchases From Cache

## Success Case

- Software runs a command "Validate Purchases"
- Software load the cache data
- Software ensure if cached data is younger than 3 days

## Exception - Expired Cache

- Software cleans the cache

## Exception - Error to load cache data

- Software cleans the cache
