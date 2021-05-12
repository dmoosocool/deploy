## fast-deploy

1. 使用 `getEnvData` 读取项目配置信息
2. 使用 `loadConfigFromEnv` 读取具体需要发布环境的信息.
3. 使用 `packageFolder` 将上传目录压缩成 zip 包.
4. 使用 `generateIncrementalPackage` 将两个资源包生成增量包进行上传.
5. 使用 `uploadFile` 将 zip 包上传至服务器.
6. 使用 `uploadFile` 上传 shell 脚本用于在服务器端解压 zip 资源包以及重启 nginx 服务.
7. 使用 `runRemoteShell` 在远端执行 shell 脚本.
