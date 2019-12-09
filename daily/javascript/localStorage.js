/**
 * localStorage加入保存时间
 * 调用方法在后面setItem的第三个参数加入时间，单位小时
 * 
 */
var LocalStorage = {//新建一个LocalStorage对象
    setItem: function(key, value, time) //设置缓存
    {
       if (parseInt(time)) {
       		time = (new Date()).getTime() + time * 60 * 60 * 1000
       		localStorage.setItem(key+"_time", time);
       		
       }
       localStorage.setItem(key, value)
    },
    getItem:function(key)
    {
        var time =localStorage.getItem(key+"_time")
        if (!time) {
        	return localStorage.getItem(key)
        } else {
        	var d = (new Date()).getTime();
        	if (d > time) {//过期了
        		localStorage.removeItem(key)
        		return undefined
        	} else {
        		return localStorage.getItem(key)
        	}
        }
    },
    removeItem:function(key)
    {
        localStorage.removeItem(key)
        localStorage.removeItem(key+"_time")
    },
    clear:function()
    {
        localStorage.clear();
    }
};

export default LocalStorage;