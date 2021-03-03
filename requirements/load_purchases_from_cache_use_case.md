# Load Purchases From Cache

## Success Case

- Software runs a command "Load Purchases"
- Software load the cache data
- Software ensure if cached data is younger than 3 days
- Software create's an purchase list with cached data
- Software returns the purchases list

## Exception - Expired Cache

- Software cleans the cache
- Software returns an empty list

## Exception - Empty Cache

- Software returns an error
