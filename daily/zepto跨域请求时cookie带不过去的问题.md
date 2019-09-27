今天遇到了一个ajax跨域post请求时cookie一直到不过去的问题，在此记录。
首先之前遇到过这个问题，解决方法是在$.ajax内添加参数xhrFields即可，代码如下：
```
$.ajax({
    type: "POST",
    url: getUrl,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,
    success: function(json) {
    },
    error: function(xhr, type) {
    },
    complete: function(xhr, status) {
    }
});
```

但是这一次也加上了该参数，仍然不见效果，研究发现这次是用的$.ajax是zepto的轻版本，内部实现和jQuery还是有些不同的。
查阅官方文档：
xhrFields (default: none): an object containing properties to be copied over verbatim to the XMLHttpRequest instance. v1.1
但实际zepto库的ajax模块中，并没有实现与文档相匹配的options的xhrFields属性，如果要达到带cookie的效果，只能通过下面代码解决
```
$.ajaxSettings.beforeSend = function(xhr) {
    xhr.withCredentials = true;
};
```