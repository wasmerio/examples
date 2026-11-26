## 环境变量说明

<p align="right">[<a href="EnvVariables.md">中文</a> | <a href="EnvVariables-en.md">English</a>]</p>

在项目的`.env.example`中，列举了如下环境变量

| 变量名                    | 内容                       |
| ------------------------- | -------------------------- |
| `PUBLIC_REMARK42_HOST`    | 托管`Remark42`的服务器域名 |
| `PUBLIC_REMARK42_SITE_ID` | 你的自定义`Remark42`站点ID |

### 1. `PUBLIC_REMARK42_HOST`

例如你在`192.168.1.1`这台服务器上部署了`Remark42`的docker容器，并将DNS解析指向他。将解析的域名（如`https://comments.example.com`）填写在这个字段

注意URL末尾不要添加反斜杠`/`。

### 2. `PUBLIC_REMARK42_SITE_ID`

你自定义的一个站点ID, 例如在你的`Remark42`的`docker-compose.yaml`中定义了`SITE=sanyecao-blog`，那请在这个字段中也填写`sanyecao-blog`
