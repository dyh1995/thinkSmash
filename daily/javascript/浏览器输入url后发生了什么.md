### 浏览器输入url后发生了什么?
1. 浏览器解析url,获取域名等信息
2. 域名解析为IP地址（DNS，Domain Name System）
* 查询浏览器缓存（这就是为什么切了host之后不会立即生效的原因，需要打开浏览器无痕模式）
* 查询系统host文件
* 查询路由器缓存，查找ISP服务商缓存DNS的服务器
* 询问根域名服务器->顶级域名服务器->权威域名服务器->本地域名服务器->本机
3. 建立TCP连接，三次握手
* 客户端向服务器发请求报文（SYN=1，seq=x）
* 服务器返回确认报文（SYN=1,ACK=1,seq=y,ack=x+1）
* 客户端发送发送确认收到确认报文，建立成功(ACK=1,seq=x+1,ack=y+1)
4. 建立http连接,获取请求的html文件
5. 拿到相应报文内的文档后，解析html
6. 生成dom树，解析到link标签时，会发起css请求，解析到script标签后会发起js请求
7. 解析css文件，生成cssom
8. 用dom树和cssom生成渲染树（render tree），渲染树每一个节点都有css属性
9. 浏览器根据渲染树进行布局（layout即回流reflow，painting）


