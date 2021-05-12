
## 添加 docker 测试环境

### 安装 centos

1. 拉取镜像
   ```bash
   docker pull centos:7
   ```
2. 运行镜像生成容器

   ```bash
   docker run -d --name centos7-nginx1.18 --privileged=true centos:7 /usr/sbin/init
   4aeca61199bcb85e8d658cc1513da0233fc43871bf2bd020d105caa9af30f165 #生成的容器ID
   ```

   - `--name` 新容器名称
   - `--privileged=true` 是容器拥有访问 Linux 内核权限, 需要在容器中使用 sytemctl
   - `centos:7` 使用 centos:7 镜像
     若是正常返回一组容器 ID 则代表容器创建成功.

3. 进入容器

```bash
docker exec -it 4aeca61199bcb85e8d6 /bin/bash
```

- `-i`: 交互式操作
- `-t`: 终端
- `-it`: `-i` `-t`的简写
- `4aeca61199bcb85e8d6`: 刚刚创建的容器 ID
- `/bin/bash`: 放在镜像名后的是命令，这里我们希望有个交互式 Shell，因此用的是 /bin/bash。

4. 进入容器后, 在容器中安装 `vim` 和 `openssh`
   ```bash
   yum install -y vim openssh-server openssh-clients
   ```
5. 修改 ssh 配置信息
   ```bash
   vim /etc/ssh/sshd_config
   ```
   需要修改的地方:
   ```yaml
   ubkeyAuthentication yes #启用公钥私钥配对认证方式
   AuthorizedKeysFile .ssh/authorized_keys #公钥文件路径（和上面生成的文件同）
   PermitRootLogin yes #root能使用ssh登录
   ClientAliveInterval 60  #参数数值是秒 , 是指超时时间
   ClientAliveCountMax 3 #设置允许超时的次数
   ```
6. 重启 ssh 服务, 并设置开机启动

   ```bash
   systemctl restart sshd.service
   systemctl enable sshd.service
   ```

   如果在执行`systemctl`命令过程中报错 `Failed to get D-Bus connection: Operation not permitted` 则是第 2 步操作时未加上 `--privileged=true`的参数

7. 修改 root 用户密码

   ```bash
   passwd
   ```

8. 安装 nginx 依赖的运行环境

   ```bash
   yum install -y gcc-c++ pcre pcre-devel zlib zlib-devel openssl openssl-devel
   ```

9. 下载 nginx 安装包 [官网下载页面](https://nginx.org/en/download.html]) 中找到 Stable version (稳定版本) 的`.tar.gz` 下载链接

   ```bash
   cd ~ # 进入用户目录
   pwd # /root
   wget -c https://nginx.org/download/nginx-1.18.0.tar.gz
   ```

   若是`wget`命令不存在 可以使用 `yum install -y wget` 进行安装

10. 解压安装包并进入 nginx 源码目录

```bash
tar -zxvf nginx-1.18.0.tar.gz
cd nginx-1.18.0
```

11. 使用默认配置进行安装

    ```bash
    pwd #/root/nginx-1.18.0
    ./configure # 检查所需的环境等信息, 无报错信息就可以进行编译安装了. 若有报错信息请检查第8步中的包是否安装成功
    make && make install # 进行编译安装

    # 编译安装完成之后的nginx目录默认在 /usr/local/nginx/中
    # 默认启动命令 /usr/local/nginx/sbin/nginx
    # 默认停止命令 /usr/local/nginx/sbin/nginx -s stop
    # 默认退出命令 /usr/local/nginx/sbin/nginx -s quit
    # 默认重载命令 /usr/local/nginx/sbin/nginx -s reload
    ```

12. 退出容器

    ```bash
    exit
    ```

13. 保存更改

    ```bash
    docker commit -m 'support: centos7 sshd nginx1.18' -a 'docker for ssh nginx' 4aeca61199bcb85e8d6 centos7-nginx1.18
    ```

    - `-m`: 提交的说明信息

    - `-a`: 指定更新用户信息

    - `4aeca61199bcb85e8d6`: 之前创建的容器 id

    - `centos7-nginx1.18`: 目标镜像的仓库名

14. 查看镜像

    ```bash
    docker images
    ```

15. 删除构建容器

    ```bash
    docker stop 4aeca61199bcb85e8d6
    docker rm 4aeca61199bcb85e8d6
    ```

16. 使用新生成的镜像启动新的容器, 并进行端口映射.

    ```bash
    docker run -d -p 2222:22 -p 8081:80 centos7-nginx1.18 sh -c "/usr/local/nginx/sbin/nginx && /usr/sbin/sshd -D"
    ```

    - `-p 2222:22` 将容器中的`22`端口映射到本机的`2222`端口
    - `-p 8081:80` 将容器中`nginx`的`80`端口映射到本机的`8081`端口
    - `centos7-nginx1.18` 镜像名称
    - `sh -c "/usr/local/nginx/sbin/nginx && /usr/sbin/sshd -D"` 因需要执行多个命令, 则使用 `sh -c`
    - `"/usr/local/nginx/sbin/nginx && /usr/sbin/sshd -D"` 执行`nginx` 和 `sshd` 的顺序如果不一致会导致 nginx 无法启动. 需要手动进入容器中启动

17. 使用 `ssh` 连接容器

    ```bash
    ssh root@127.0.0.1 -p 2222  #根据提示输入之前在容器中修改的root密码
    ```

18. 浏览器打开`nginx`默认页面 `http://localhost:8081`

    ```bash
    curl http://localhost:8081 #或者使用curl进行测试
    ```

### 使用 ssh-copy-id 进行免密 ssh 登陆的配置

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub root@127.0.0.1 -p 2222
```

如果 `~/.ssh/id_rsa.pub` 文件不存在, 使用`ssh-keygen`产生公钥私钥对

```bash
ssh-keygen
```

### 让 docker 中的 nginx 支持 vhost.

以下操作是配置 docker 中的 nginx

1. 进入 `/usr/local/nginx/conf` 目录 修改 `nginx.conf` 文件, 在`http`的`server` 块下添加:

   ```nginx
   # include vhost.
   include /usr/local/nginx/vhost/*.conf;
   ```

   完整的 `nginx.conf` 如下 :

   ```nginx
   #user  nobody;
   worker_processes  1;

   #error_log  logs/error.log;
   #error_log  logs/error.log  notice;
   #error_log  logs/error.log  info;

   #pid        logs/nginx.pid;

   events {
       worker_connections  1024;
   }

   http {
       include       mime.types;
       default_type  application/octet-stream;

       #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
       #                  '$status $body_bytes_sent "$http_referer" '
       #                  '"$http_user_agent" "$http_x_forwarded_for"';

       #access_log  logs/access.log  main;

       sendfile        on;
       #tcp_nopush     on;

       #keepalive_timeout  0;
       keepalive_timeout  65;

       #gzip  on;

       server {
           listen       80;
           server_name  localhost;

           #charset koi8-r;

           #access_log  logs/host.access.log  main;

           location / {
               root   html;
               index  index.html index.htm;
           }

           #error_page  404              /404.html;

           # redirect server error pages to the static page /50x.html
           #
           error_page   500 502 503 504  /50x.html;
           location = /50x.html {
               root   html;
           }

           # proxy the PHP scripts to Apache listening on 127.0.0.1:80
           #
           #location ~ \.php$ {
           #    proxy_pass   http://127.0.0.1;
           #}

           # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
           #
           #location ~ \.php$ {
           #    root           html;
           #    fastcgi_pass   127.0.0.1:9000;
           #    fastcgi_index  index.php;
           #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
           #    include        fastcgi_params;
           #}

           # deny access to .htaccess files, if Apache's document root
           # concurs with nginx's one
           #
           #location ~ /\.ht {
           #    deny  all;
           #}
       }

       # include vhost
       include /usr/local/nginx/vhost/*.conf;

       # another virtual host using mix of IP-, name-, and port-based configuration
       #
       #server {
       #    listen       8000;
       #    listen       somename:8080;
       #    server_name  somename  alias  another.alias;

       #    location / {
       #        root   html;
       #        index  index.html index.htm;
       #    }
       #}


       # HTTPS server
       #
       #server {
       #    listen       443 ssl;
       #    server_name  localhost;

       #    ssl_certificate      cert.pem;
       #    ssl_certificate_key  cert.key;

       #    ssl_session_cache    shared:SSL:1m;
       #    ssl_session_timeout  5m;

       #    ssl_ciphers  HIGH:!aNULL:!MD5;
       #    ssl_prefer_server_ciphers  on;

       #    location / {
       #        root   html;
       #        index  index.html index.htm;
       #    }
       #}

   }
   ```

2. 添加 `stg.sjkh.dev.conf`

   ```nginx
   server {
     listen 80;
     servername stg.sjkh;
     access_log /www/logs/stg.sjkh.access.log main;

     location / {
       root /www/stg.sjkh;
       index index.html index.htm;
     }

     error_page 500 502 503 504 /50x.html;

     location = /50x.html {
       root /usr/local/nginx/html;
     }
   }
   ```

3. 修改 `/etc/host` 文件

```shell
# 使用管理员权限编辑 /etc/host 文件
sudo vim /etc/hosts

# 在/etc/host文件中最下行添加
127.0.0.1 stg.sjkh

```

4. 修改本地`hosts`文件

   ```shell
   # 使用管理员权限编辑 /etc/host 文件
   sudo vim /etc/hosts

   # 在/etc/host文件中最下行添加
   127.0.0.1 stg.sjkh
   ```

5. 通过浏览器地址访问 [http://stg.sjkh:8081/](http://stg.sjkh:8081/) 访问 `docker nginx` 服务

6. 【可选】本机 `nginx` 添加端口映射, `MacOs` 环境安装`Nginx`方法 同 Docker 中安装方法一致.

```nginx
   # 为本机nginx添加 vhost stg.sjkh的配置文件 /usr/local/nginx/conf/vhost/stg.sjkh.conf
   server {
     listen 80;
     server_name stg.sjkh;
     access_log /Users/{Your Name}/wwwroot/logs/stg.sjkh.access.log main;
     error_log /Users/{Your Name}/wwwroot/logs/stg.sjkh.error.log;

     location / {
       proxy_pass http://127.0.0.1:8081;
       proxy_set_header Host stg.sjkh;
     }

     # 和上面写法二选一
     #location / {
     #  proxy_pass http://stg.sjkh:8081;
     #}
   }
```

7. 通过浏览器地址访问 [http://stg.sjkh/](http://stg.sjkh/) 访问`docker nginx` 服务

### 在 docker 容器中准备上传目录及脚本目录

`/www/uploads` 文件夹作为后续上传压缩包的目录,
`/www/shells` 文件夹作为后续执行上传完压缩包之后的脚本目录.

```shell
cd /www
mkdir uploads
mkdir shells
```

### 常见问题

Q: 当机器重启后 通过`docker ps -a` 查询到容器 `Status` 为 `Exist`, 使用命令: `docker container start [容器id]` 进行唤醒.
