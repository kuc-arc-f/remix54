# remix54

 Version: 0.9.1

 Author  :

 date    : 2024/11/29 

 update  : 

***
### Summary

d1 + pages , Remix example

***
### Setup
* wrangler.toml

```
#:schema node_modules/wrangler/config-schema.json
name = "remix54"
compatibility_date = "2024-11-12"
pages_build_output_dir = "./build/client"
compatibility_flags = [ "nodejs_compat" ]

# Variable bindings. These are arbitrary, plaintext strings (similar to environment variables)
# Docs:
# - https://developers.cloudflare.com/pages/functions/bindings/#environment-variables
# Note: Use secrets to store sensitive data.
# - https://developers.cloudflare.com/pages/functions/bindings/#secrets
[vars]
MY_VARIABLE = "production_value"


# Bind a D1 database. D1 is Cloudflare’s native serverless SQL database.
# Docs: https://developers.cloudflare.com/pages/functions/bindings/#d1-databases
[[d1_databases]]
binding = "DB"
database_name = ""
database_id = ""

```
***
