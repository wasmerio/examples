## Automatic Deployment with GitHub Actions

<p align="right">[<a href="GithubActions.md">中文</a> | <a href="GithubActions-en.md">English</a>]</p>

> [!NOTE]
>
> This project's GitHub Actions workflow listens for `git push` operations on the `main` branch. If such operation happened, the build pipeline will be triggered.

> [!IMPORTANT]
>
> To use this feature, you need to fork this project into your own repository. The workflow can only run in your own repository.

### 0. Create a New Branch

Create a new branch named <b>`blog-content`</b> based on the `master` branch. Please push new articles to this branch in the future.

### 1. Set up SSH keys

In your repository, go to <b>`Settings > Secrets and variables > Actions`</b>, and add five `Repository secrets`:

| Secret Name          | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `DEPLOY_KNOWN_HOSTS` | Allows GitHub CI to recognize the target server |
| `DEPLOY_SSH_KEY`     | Used to log in to the target server             |
| `ENV_FILE`           | Private environment variables                    |
| `ALIYUN_ACCESS_KEY_ID` | Alibaba Cloud AccessKey ID                     |
| `ALIYUN_ACCESS_KEY_SECRET` | Alibaba Cloud AccessKey Secret             |

#### 1. `DEPLOY_KNOWN_HOSTS`

Run the following command in your terminal:

```shell
ssh-keyscan -H <your-server-ip>
````

Then copy all generated output into this environment variable.

#### 2. `DEPLOY_SSH_KEY`

It is recommended to generate a dedicated SSH key specifically for GitHub deployment.

Run this command on your local machine or server terminal:

```shell
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

After running it, you will get two files:

```shell
~/.ssh/github_actions_deploy
~/.ssh/github_actions_deploy.pub
```

> **`github_actions_deploy`** → private key, put this into `DEPLOY_SSH_KEY`
>
> **`github_actions_deploy.pub`** → public key, add this to your server

##### ① Set the GitHub private key

View the private key content:

```shell
cat ~/.ssh/github_actions_deploy
```

Copy the full output into the variable value.

##### ② Set the server public key

Then log in to your server terminal and add the contents of `~/.ssh/github_actions_deploy.pub` to the server's `~/.ssh/authorized_keys`, so that GitHub CI can access the server.

#### 3. `ENV_FILE`

This variable is used to generate the `.env` file required for building.

If you have already configured your `.env`, it should contain the following:

```env
PUBLIC_REMARK42_HOST=
PUBLIC_REMARK42_SITE_ID=
```

If you have not configured these yet or do not know what they mean, please see: <b>[EnvVariables-en.md](EnvVariables-en.md)</b>

Simply copy all contents of your `.env` file into the variable value.

#### 4. `ALIYUN_ACCESS_KEY_ID` and `ALIYUN_ACCESS_KEY_SECRET`

If you use Alibaba Cloud CDN to accelerate your website, the workflow will refresh the CDN cache through the Alibaba Cloud API after deployment is complete.

To obtain the ID and secret:

- Open <b>[Alibaba Cloud Console](https://home.console.aliyun.com/home/dashboard/ProductAndService) > [Resource Access Management](https://ram.console.aliyun.com/overview)</b>.
- Click <b>[Quick Start](https://ram.console.aliyun.com/overview?activeTab=workflow)</b>.
- Find <b>Create a programmatic user > Create a user and AccessKey with access to AI Search</b> further down the page.
- Enter a name, then click <b>Execute Configuration</b> at the bottom.
- Copy the displayed `AccessKey ID` and `AccessKey Secret` into `ALIYUN_ACCESS_KEY_ID` and `ALIYUN_ACCESS_KEY_SECRET`, respectively.

If these two secrets are not configured, CDN refresh will not be triggered, but this job will still be marked as ran successful.

### 2. Set up repository variables

Also in <b>`Settings > Secrets and variables > Actions`</b>, add four `Repository variables`:

| **Variable Name** | **Value**                                                    |
| ----------------- | ------------------------------------------------------------ |
| `DEPLOY_HOST`     | The IP address of your server, e.g. `192.168.1.1`            |
| `DEPLOY_PATH`     | The deployment path on the server, e.g. `/www/wwwroot/blog.cloverta.top` |
| `DEPLOY_PORT`     | The SSH port of your server, usually `22`                    |
| `DEPLOY_USER`     | The login user, e.g. `root`                                  |
| `INDEXNOW_KEY`    | A string used as the key submitted to IndexNow. You can directly use `888c64d8d7d9a2b605bcd5277021a414` |
| `SITE_URL`        | Your domain name, e.g. `https://blog.cloverta.top/`. Make sure to include the trailing slash |

#### About `INDEXNOW_KEY`

The repository's `Actions` workflow will automatically submit updates to [IndexNow](https://www.indexnow.org/). You need to generate a random key in the `public` directory so that IndexNow can verify that you own the website.

If you do not want to configure your own key, you can simply use the `Key` included in this repository:

```txt
888c64d8d7d9a2b605bcd5277021a414
```

If you want to generate your own key, you can use:

```bash
openssl rand -hex 16
```

This will generate a random string. For example, if the output is `abcdefg123`, you need to save it as `public/abcdefg123.txt`, with the contents of the file also set to `abcdefg123`.
