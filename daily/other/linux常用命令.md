### vi搜索
1. 命令模式下，输入：/字符串
比如搜索user, 输入/user
按下回车之后，可以看到vim已经把光标移动到该字符处和高亮了匹配的字符串
2. 查看下一个匹配，按下n(小写n)
3. 跳转到上一个匹配，按下N（大写N）

### 查看当前路径
pwd

### 修改ng配置
1./usr/local/nginx/conf/vhosts/xxx.conf 文件添加配置
server {
     listen      80;
     listen      10099;
     server_name  xxx.xxx.com;
     root    /data/vhosts/xxx.com/xxx.com;
     ssi on;
     ssi_silent_errors on;
     ssi_types text/shtml;
     expires 0;
}

2.切换到/usr/local/nginx/sbin重启ng
./nginx -s reload