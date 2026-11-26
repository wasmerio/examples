## Environment Variables

<p align="right">[<a href="EnvVariables.md">中文</a> | <a href="EnvVariables-en.md">English</a>]</p>

The following environment variables are listed in the project's `.env.example` file:

| Variable Name             | Description                              |
| ------------------------- | ---------------------------------------- |
| `PUBLIC_REMARK42_HOST`    | The domain of the server hosting `Remark42` |
| `PUBLIC_REMARK42_SITE_ID` | Your custom `Remark42` site ID           |

### 1. `PUBLIC_REMARK42_HOST`

For example, if you deployed the `Remark42` Docker container on a server at `192.168.1.1` and pointed your DNS record to it, then fill in the resolved domain name (such as `https://comments.example.com`) in this field.

Do not add a trailing slash `/` at the end of the URL.

### 2. `PUBLIC_REMARK42_SITE_ID`

This is your custom site ID. For example, if you defined `SITE=sanyecao-blog` in your `Remark42` `docker-compose.yaml`, then you should also fill in `sanyecao-blog` in this field.