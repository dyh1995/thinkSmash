### 使用nvm管理node版本 
### 说明：
1. 下载nvm-setup.zip（[nvm下载地址](https://github.com/coreybutler/nvm-windows/releases/tag/1.1.7 "nvm")）
2. 解压安装（一般安装在C:\Users\admin\AppData\Roaming\nvm）
3. 设置安装目录下settings.txt，内容如下
```
root: C:\Users\admin\AppData\Roaming\nvm
path: C:\Program Files\nodejs
arch: 64
```
4. 执行nvm -v查看是否安装成功
5. 相关命令
```
nvm list    查看已安装的node列表
nvm install <node版本号> 安装对应版本node
nvm use <node版本号> 使用对应版本node
```
6. 执行nvm后，可以查看node和npm版本是否切换成功