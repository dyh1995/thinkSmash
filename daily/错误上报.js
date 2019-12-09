var performance_report =  function () {//页面加载进度上报；浏览器的刷新按钮，快捷键刷新，以及location.reload()等方法不在上报
    var obj = {};
    var performance = window.performance || {};
    var can = false;//测试过程一直为true,打包记得改为false,浏览器的刷新按钮，快捷键刷新，以及location.reload()等方法不在上报

    setTimeout(function () {  //过早获取时 loadEventEnd有时会是0
    // if ( performance && performance.navigation ||  can) {
        if ( performance && performance.navigation && performance.navigation.type != 1 ||  can) {
        var timing = performance.timing;
        obj =  {
        DNS: timing.domainLookupEnd - timing.domainLookupStart,//DNS查询耗时
        TCP: timing.connectEnd - timing.connectStart,//TCP链接耗时
        request: timing.responseEnd - timing.requestStart,//request请求耗时
        domanalysis: timing.domComplete - timing.domInteractive, //解析dom树耗时
        whitescreen: timing.responseStart - timing.navigationStart, //白屏时间
        domready: timing.domContentLoadedEventEnd - timing.navigationStart,//domready时间(用户可操作时间节点)
        onload: timing.loadEventEnd - timing.navigationStart//onload时间(总下载时间)
        };
        can = true;
    } else if (!performance.navigation) {
        can = true;
    }

    if (can) {
        jsonp(config.REPORTDOMAIN + "/report?type=loadtime", {
        data: extent({"source_page": encodeURIComponent(config.source_page.split('?')[0])}, obj, browse, {channel: window.INTERREPORT.channel}),
        timeout: 300
        });
    }
    },1000);
};