
### 为什么要发预检请求(preflight request)
preflight request是为确保服务器是否允许发起对服务器数据产生副作用的HTTP请求方法，而预先由浏览器发起OPTIONS方法的一个预检请求，如果允许就发送真实的请求，如果不允许则直接拒绝发起真实请求。

### 跨域访问时发送OPTIONS请求（预检请求）的条件
不会触发预检请求的方法: GET HEAD 一些POST
仅当POST方法的Content-Type值等于下列之一才算做简单请求
1. text/plain 
2. multipart/form-data 
3. application/x-www-form-urlencoded

当header有自定义属性时也会发送options

### 注意事项
* preflight request不允许重定向
* 对于附带身份凭证的请求(即服务器设置Access-Control-Allow-Credentials: true)，服务器不得设置 Access-Control-Allow-Origin 的值为“*”。否则请求将会失败。

### 参考文献
[CORS预检请求详谈](https://www.cnblogs.com/wonyun/p/CORS_preflight.html "CORS预检请求详谈")