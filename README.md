## 添加docker 测试环境

### 安装centos
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
   - `--privileged=true` 是容器拥有访问Linux内核权限, 需要在容器中使用sytemctl
   - `centos:7` 使用centos:7镜像
    若是正常返回一组容器ID则代表容器创建成功.
  
3. 进入容器
  ```bash
  docker exec -it 4aeca61199bcb85e8d6 /bin/bash
  ```
  - `-i`: 交互式操作
  - `-t`: 终端
  - `-it`: `-i` `-t`的简写
  - `4aeca61199bcb85e8d6`: 刚刚创建的容器ID
  - `/bin/bash`: 放在镜像名后的是命令，这里我们希望有个交互式 Shell，因此用的是 /bin/bash。
  
4. 进入容器后, 在容器中安装 `vim` 和 `openssh`
   ```bash
   yum install -y vim openssh-server openssh-clients
   ```
   
5. 修改ssh配置信息
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
   
6. 重启ssh服务, 并设置开机启动

   ```bash
   systemctl restart sshd.service
   systemctl enable sshd.service
   ```

   如果在执行`systemctl`命令过程中报错 `Failed to get D-Bus connection: Operation not permitted` 则是第2步操作时未加上 `--privileged=true`的参数

7. 修改root用户密码

   ```bash
   passwd
   ```

8. 安装nginx依赖的运行环境

   ```bash
   yum install -y gcc-c++ pcre pcre-devel zlib zlib-devel openssl openssl-devel
   ```

9. 下载nginx安装包 [官网下载页面](https://nginx.org/en/download.html]) 中找到 Stable version (稳定版本) 的`.tar.gz` 下载链接

   ```bash
   cd ~ # 进入用户目录
   pwd # /root
   wget -c https://nginx.org/download/nginx-1.18.0.tar.gz
   ```

   若是`wget`命令不存在 可以使用 `yum install -y wget` 进行安装

10. 解压安装包并进入nginx源码目录

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

    - `4aeca61199bcb85e8d6`: 之前创建的容器id

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
    - `"/usr/local/nginx/sbin/nginx && /usr/sbin/sshd -D"` 执行`nginx` 和 `sshd` 的顺序如果不一致会导致nginx无法启动. 需要手动进入容器中启动

17. 使用 `ssh` 连接容器

    ```bash
    ssh root@127.0.0.1 -p 2222  #根据提示输入之前在容器中修改的root密码
    ```

18. 浏览器打开`nginx`默认页面 `http://localhost:8081`

    ```bash
    curl http://localhost:8081 #或者使用curl进行测试
    ```

### 使用 ssh-copy-id 进行免密ssh登陆的配置
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub root@127.0.0.1 -p 2222
```

如果 `~/.ssh/id_rsa.pub` 文件不存在, 使用`ssh-keygen`产生公钥私钥对

```bash
ssh-keygen
```
