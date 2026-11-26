## Github Actions自动部署

<p align="right">[<a href="GithubActions.md">中文</a> | <a href="GithubActions-en.md">English</a>]</p>

> [!NOTE]
>
> 此项目的Github Actions监听`main`分支中的`git push`操作，分支有更新则触发构建流水线。

> [!IMPORTANT]
>
> 需要使用这个功能请自行Fork一份代码到自己的仓库，在你自己的仓库才能跑流水线。

### 零、新建一个分支

在`master`的基础上新建一个名为<b>`blog-content`</b>的分支，以后新的文章请推送到这个分支里。

### 一、设置SSH密钥

在仓库的<b>`Settings > Secrets and variables > Actions`</b>中，添加三个`Repository secrets`，分别为：

| 密钥名                     | 用途                         |
| -------------------------- | ---------------------------- |
| `DEPLOY_KNOWN_HOSTS`       | 用于让Gihub CI识别目标服务器 |
| `DEPLOY_SSH_KEY`           | 用于登录目标服务器           |
| `ENV_FILE`                 | 私有环境变量                 |
| `ALIYUN_ACCESS_KEY_ID`     | 阿里云的AccessKey ID         |
| `ALIYUN_ACCESS_KEY_SECRET` | 阿里云的AccessKey Secret     |

#### 1.`DEPLOY_KNOWN_HOSTS`

在终端执行命令

```shell
ssh-keyscan -H <你的服务器IP>
```

并将生成的所有内容放入该环境变量中

#### 2.`DEPLOY_SSH_KEY`

推荐在你本地新生成一把专门用于 GitHub 部署的 key

本地或服务器终端执行：

```
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

执行后会得到两个文件：

```
~/.ssh/github_actions_deploy
~/.ssh/github_actions_deploy.pub
```

> **`github_actions_deploy`** → 私钥，填到 `DEPLOY_SSH_KEY`
>
> **`github_actions_deploy.pub`** → 公钥，要加到服务器上

##### ① 设置Github私钥

查看私钥内容：

```
cat ~/.ssh/github_actions_deploy
```

把完整输出复制到变量值中。

##### ② 设置服务器公钥

随后，登录服务器终端，将`~/.ssh/github_actions_deploy.pub`中的内容添加到服务器的`~/.ssh/authorized_keys`，以实现Github CI访问服务器。

#### 3.`ENV_FILE`

这个变量用于生成构建所需的`.env`文件。

如果你已经设置好`.env`，它里面应该有如下内容

```env
PUBLIC_REMARK42_HOST=
PUBLIC_REMARK42_SITE_ID=
```

如果你还没配置好或不知道这些是干什么的，请详见：<b>[EnvVariables.md](EnvVariables.md)</b>

直接把`.env`中的所有内容复制到变量值中。

#### 4.`ALIYUN_ACCESS_KEY_ID`和`ALIYUN_ACCESS_KEY_SECRET`

如果你使用阿里云CDN为你的网站加速，Workflow在完成部署之后会通过阿里云API刷新CDN缓存。

获取ID和Secret的方法为：

- 打开 <b>[阿里云控制台](https://home.console.aliyun.com/home/dashboard/ProductAndService) > [访问控制](https://ram.console.aliyun.com/overview)</b>
- 点击 <b>[快速开始](https://ram.console.aliyun.com/overview?activeTab=workflow)</b>
- 在下方找到 <b>创建程序用户 > 创建可访问 AI 搜索服务的用户及 AccessKey</b>
- 自定义好名称后点击最下方的 <b>执行配置</b>
- 分别将出现的`AccessKey ID`和`AccessKey Secret`放入`ALIYUN_ACCESS_KEY_ID`和`ALIYUN_ACCESS_KEY_SECRET`

如果未配置这两个Secret则不会触发CDN刷新，这一项Job依然会标注运行成功。

### 二、设置环境变量

同样，在<b>`Settings > Secrets and variables > Actions`</b>中，添加四个`Repository variables`，分别为：

| 密钥名         | 内容                                                         |
| -------------- | ------------------------------------------------------------ |
| `DEPLOY_HOST`  | 服务器IP地址，如`192.168.1.1`                                |
| `DEPLOY_PATH`  | 在服务器上的部署路径，如`/www/wwwroot/blog.cloverta.top`     |
| `DEPLOY_PORT`  | 服务器SSH端口，一般是`22`                                    |
| `DEPLOY_USER`  | 登录用户，例如`root`                                         |
| `INDEXNOW_KEY` | 提交至IndexNow的一串ID字符，可以直接填``888c64d8d7d9a2b605bcd5277021a414`` |
| `SITE_URL`     | 你的域名，例如`https://blog.cloverta.top/`，注意结尾要带反斜杠 |

#### 关于`INDEXNOW_KEY`

仓库的`Actions`会自动向 [Index Now](https://www.indexnow.org/) 推送更新，你需要在`public`目录下生成一个随机的key向Index Now证明这个网站是你的。

如果懒得配可以直接用这个仓库中的`Key`

```txt
888c64d8d7d9a2b605bcd5277021a414
```

如果你想生成一个自己的，你可以使用

```bash
openssl rand -hex 16
```

生成一串随机字符，假设输出内容为`abcdefg123`，你需要将其保存到`public/abcdefg123.txt`，并且内容也为`abcdefg123`。
