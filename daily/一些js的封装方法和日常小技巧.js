/**
 * ios上new Date时出现的问题
 */
// 做活动时发现有一个日期的过滤器代码在iOS上最后显示了NaN，检查代码发现如下问题：
var startTime = new Date('2017-03-08 00:00:00')
//该代码在iOS上得到的结果startTime为NaN，说明iOS在new Date()的时候时间参数为'2017-03-08 00:00:00'会有问题，日期中的-替换为/可以兼容该问题
var startTime2 = new Date('2017/03/08 00:00:00');

/**
 * 修改依赖包源码的烦恼
 * 多人合作时，有时候碰到需要修改依赖包源码的情况往往会造成开发之间依赖包不同步的问题
 * 可以使用patch-package模块来快速处理该问题，步骤如下：
 * 1. 安装patch-package包
 * 2. 修改需要修改的依赖包
 * 3. 创建补丁 npx patch-package package-name
 * 运行后通常会在项目根目录下的patches目录中创建一个名为package-name+version.patch的文件。将该patch文件提交至版本控制中，即可在之后应用该补丁了。
 * 4. 修改package.json的内容，在scripts中加入"postinstall": "patch-package"
 * 5. npm run postinstall;
 */

 /**
  * iOS上获取dom元素宽高精度问题
  */
 // 一般通过dom.offsetWidth（dom.offsetHeight）的形式获取元素宽高，但在ios上如果元素rem单位被渲染为px时有了小数精度，
 // 则通过这种方式获取宽高则会产生精度误差累计，尤其是在做列表滚动时，误差累计的多了就会出现显示异常截断的问题。
 // 解决方法是使用以下兼容获取宽高，不会省略掉小数位精度。
getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return document.defaultView.getComputedStyle(obj, null)[attr].replace('px', '');
    }
}

/**
 * 函数式编程
 * eg：把数组cars每一个元素的make属性单独拿出来，组成一个新数组
 */
var cars = [{make: 64},{make: 23},{make: 51},{make: 40}];
// 原始的命令式，产生了外部变量makes
var makes = [];
for (var i = 0; i < cars.length; i++) {
  makes.push(cars[i].make * 10);
}
// 优雅的声明式，map不改变原数组
var makes = cars.map(function(car){ return car.make * 10; });

//函数组合
//1. 不优雅的嵌套式
var toUpperCase = function(x) { return x.toUpperCase(); };
var exclaim = function(x) { return x + '!'; };
var shout = function(x){
  return exclaim(toUpperCase(x));   //函数由内向外执行了
};
shout("send in the clowns");
//=> "SEND IN THE CLOWNS!"

//2. 优雅的合成式
//定义compose
//es5
//reduceRight(callbacks, initialValue)
//callbacks(prevValue, currentValue)
var compose = function(...args) {
    return function(initialValue) {
        return args.reduceRight(function(value, item){
            return item(value)
        }, initialValue);
    }
};
//es6
// var compose = (...args) => x => args.reduceRight((value, item) => item(value), x);
var toUpperCase = function(x) { return x.toUpperCase(); };
var exclaim = function(x) { return x + '!'; };
var shout = compose(exclaim, toUpperCase);  //组合函数
shout("send in the clowns");
//=> "SEND IN THE CLOWNS!"

/**
 * let	var	const区别 
 */
/*
                let             var             const
    变量or常量	变量	         变量	         常量
    作用域	    块级作用域	     函数作用域	      块级作用域
    创建	    作用域顶部创建	 作用域顶部创建	   作用域顶部创建
    初始化	    let语句	        作用域顶部	      const语句
    赋值	    可以赋值	    可以赋值	      报错
    重复声明	报错	        可以重复声明	  报错
    暂时性死区	有	            没有	          有
*/

/**
 * click时间连点延迟触发
 */
var timeout = null;      //搜索触发定时器
var clickTimes = 0;      //存储连续输入次数
var waitTime = 500;      //500ms内连续输入不进行搜索，减少请求次数
function click(){
    if(this.key == ''){
	    return false;
    }

	if (this.clickTimes == 0) {
		this.timeout = setTimeout(() => {
			//trigger();
		}, this.waitTime);
	} else {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			//trigger();
		}, this.waitTime);
	}
	this.clickTimes++;
}

/**
 * 移动端点击输入框弹出键盘时，键盘会遮挡输入框
 * 解决方法，添加点击事件如下
 */
function scrollView(e) {
    try {
    e.scrollIntoView();
    } catch (err) {}
}

/**
 * async/awite在promise返回reject时如何接收错误信息
 * await要在async内使用
 */
//使用try...catch处理
let pro = function () {
    return new Promise((resolve, reject) => {
        reject('err')
    });
};
let awaitResult = await pro().catch(function(err){
    console.log(err);
});

/**
 * Macrotask 与 Microtask
 * 1. Macrotasks 包含了解析 HTML、生成 DOM、执行主线程 JS 代码和其他事件如 页面加载、输入、网络事件、定时器事件等。从浏览器的角度，Macrotask 代表的是一些离散的独立的工作
 * 常见应用: setTimeout, setInterval, setImmediate, requestAnimationFrame, I/O, UI rendering
 * 2. Microtasks 则是为了完成一些更新应用程序状态的较小的任务，如处理 Promise 的回调和 DOM 的修改，以便让这些任务在浏览器重新渲染之前执行。Microtask 应该以异步的方式尽快执行，所以它们的开销比 Macrotask 要小，并且可以使我们在 UI 重新渲染之前执行，避免了不必要的 UI 渲染。
 * 常见应用: process.nextTick, Promises, Object.observe, MutationObserver
 * 
 * 执行顺序：
 * Microtask Queue 具有更高的优先级，即执行一个 Macrotask 任务后，就会清空整个 Microtask Queue，此时如果有新的 Microtask 加入也会被执行。
 * 
 * Microtask 相比 Macrotask 具有更高的优先级
 * Macrotask 总是在 JS 代码执行完成并且 Microtask Queue 清空之后执行
 * JS 代码执行本身也是一个 Macrotask
 * Microtask Queue 清空后有可能会重新渲染 UI
 * Promise 属于 Microtask，setTimeout 属于 Macrotask
 */

 /**
  * slice splice substring substr区别
  * Array,String -> slice(start, end)
  * Array -> splice(index,howmany,item1,itemx) 方法向/从数组中添加/删除项目，然后返回被删除的项目。 该方法会改变原始数组
  * String -> substring(start, end)
  * String -> substr(start, length)
  */

  /**
   * 之前在做图片上传时都是调用的客户端提供的接口拉起相册，上传文件，
   * 今天遇到了需要把页面在app外使用的情况，需要做app外部文件上传的兼容，记录如下
   */
  /**
   * html代码
   * <div class="photo_up_infos">
        <p><span class="photo_up_info">点击上传正面</span></p>
        <label for="uploadImg"/>
        <input 
            id="uploadImg" name="image"
            type="file" 
            accept="image/png, image/jpeg" 
            style="display:none;"
            @change="uploadImg($event)">
    </div>
   */
let vue = {
    methods: {
        uploadImg(e){
            return new Promise((resolve, reject) => {
                if (e) {
                    const formData = new FormData(); // 声明一个FormData对象
                    formData.append('image', e.target.files[0]);
                    //发送post请求,formData要放在data字段内
                    //      {  // 设置axios的参数
                    //          url: '请求地址',
                    //          data: formData,
                    //          method: 'post',
                    //          headers: { 
                    //              'Content-Type': 'multipart/form-data'
                    //      }
                    api.appOutUpload(formData).then(data => {
                        if (data.result == 0) {
                            resolve(data.data.url);
                        } else {
                            reject(data.message);
                        }
                    });
                } else {
                    reject(new Error('表单元素不存在'));
                } 
            });
        }
    }
}
//不使用圆括号，$event被自动当作实参传入
// 使用圆括号，必须显式的传入$event对象，如果不传入可能最终找到的是全局的window .event

/**
 * 利用js在保留当前页面，新打开一个tab页面
 */
let url = '';
window.open(url, 'blank');

/**
 * 利用js在保留当前页面，新打开一个非tab页面
 */
let url = '';
window.open(url, 'blank', "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
//详细参数：https://www.runoob.com/jsref/met-win-open.html

/**
 * definePropety函数的一些小结
 */
//作用：可以在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。
//语法形式 Object.defineProperty(obj, prop, descriptor) 三个参数：属性所在的对象、属性的名字和一个描述符对象。描述符对象descriptor分为两类。：数据属性和访问器属性

//属性描述符必须是数据属性和访问器属性两种形式之一，不能同时是两者
var obj = {
    _num: 2
}
Object.defineProperty(obj, "num", {
    //通用属性
    enumerable: true,   //表示能否通过 for-in 循环返回属性
    configurable: true, //表示能否通过 delete 删除属性从而重新定义属性

    //数据属性
    value: 1,       //该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined
    writable: true, //表示能否修改属性的值

    //访问器属性
    get: function(){
        return this._num;
    },
    set: function(newValue){
        this._num = newValue;
    },
});

//下面是一个使用defineProperty的例子
/************传统做法************/
<div>
    <div id="container1"></div>
    <div id="container2"></div>
</div>
document.getElementById('button').addEventListener("click", function(){
    var container = document.getElementById("container");
    container.innerHTML = Number(container.innerHTML) + 1;
});

/************defineProperty做法************/
var obj = {
    value: 1
  };

  var obj2 = {
    value: 1
  };

  function watch(obj, name, func) {
    //存储value的变量
    var value = obj[name];
    Object.defineProperty(obj, name, {
      get: function() {
        return value;
      },
      set: function(newValue) {
        /**
         * 在set中不可以直接修改obj.value。会引起死循环
         * 但是直接暴露一个value到最外层会导致需要监控很多属性值的改变时候，要一个一个写，很累，所以建立watch函数内部保存value值
         **/
        value = newValue;
        func(value);
      }
    });
    if (value) obj[name] = value;
  }

  watch(obj, "value", function(newvalue) {
    document.getElementById("container1").innerHTML = newvalue;
  });
  watch(obj2, "value", function(newvalue) {
    document.getElementById("container2").innerHTML = newvalue;
  });

  document.getElementById("container1").addEventListener("click", function() {
    obj.value += 1; //试图修改obj的属性值会触发set
  });
  document.getElementById("container2").addEventListener("click", function() {
    obj2.value += 2; //试图修改obj的属性值会触发set
  });

  /**
   * 正则表达式反向引用 
   */
  document.addEventListener('DOMContentLoaded', function(){
    let ua = window.navigator.userAgent;
    ua += ' language/zh-CN';

    try{
        let match = ua.match(new RegExp(/language\/([^\s]*)/ig));
        if(match && match.length > 0){
            let lang = RegExp.$1;   //反向引用
            console.log('匹配到了语言页面为：', lang)

            let body = document.querySelector('body');
            document.getElementsByTagName("body")[0].className = lang;

            // 阿拉伯语言，设置页面镜像反转
            if(lang == 'zh-CN'){
                let html = document.getElementsByTagName('html')['0'];
                html.dir = 'rtl';
            }
        }else{
            throw new Error('Catch-Error：未匹配到页面语言');
        }
    }catch(e){
        console.log(e);
    }
}, false);

/**
 * js实现类似客户端调用window.onResume逻辑
 * bfcache(back-forward cache,可称为“往返缓存”)行为提供了pagehide和pageshow(若页面在bfcahe中，再次打开页面不会触发load)
 */
window.onpageshow = event => {
    // onload(mounted)事件在页面从浏览器缓存中读取时不触发, 如果页面从浏览器的缓存中读取，event.persisted属性返回 ture，否则返回 false。
    if (event.persisted || (window.performance && window.performance.navigation.type == 2)) {
        if(units.platform().ios){   //onpageshow方法在ios上可以触发，但是不知道为什么实际抓包时发现init()里面的接口并没有请求，缓存问题？
            window.location.reload();
        }else{
            this.init();
        }
    }
};

/**
 * 2019-11-06T16:32:18.000Z时间转北京当地时间，需要减8小时
 */
var t = '2019-11-06T16:32:18.000Z';
var date = new Date(item.frontmatter.date);
var localTime = date.setHours(date.getHours() - 8);

/**
 * 修改页面title
 */
document.title  = 'xxx';

/**
 * 数组去重
 * ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。
 * Set 本身是一个构造函数，用来生成 Set 数据结构。
 * Array.from可以将一个类数组对象或者可遍历对象转换成一个真正的数组。
 * 所谓类数组对象，最基本的要求就是具有length属性的对象。
 */
function un(arr){var set = new Set(arr);return Array.from(set)}

/**
 * 字符串去重
 */
function removeRepeatStr(str){
    var obj = {};
    var newStr = '';
    var len = str.length;
    for(var i = 0; i < len; i++){
        if(!obj[str[i]]){
            newStr = newStr + str[i];
            obj[str[i]] = 1;//注意，这里的1是给对象属性赋值，这个值可以任意取。意思是把每个遍历的字符作为对象属性并赋值保存，保证该属性的唯一性
        }
    }
    return newStr;
}

/**
 * audio一些做法
 */
function playAudio (src) {
    if (!src || !src.trim()) {
        // 接口报错的话，itemSound是不存在的，代码应该停止播放逻辑
        return false;
    }

    var audio = document.getElementById('audio');
    this.audioUrl = src;
    audio.load();

    setTimeout(() => {
        if (audio.paused) {
            /* 如果已经暂停 */
            audio.play(); /* 播放 */
        } else {
            audio.pause(); /* 暂停 */
        }
    }, 500);
}

function stopAudio () {
    var audio = document.getElementById('audio');
    if (!audio.paused) {
        audio.pause(); /* 暂停 */
    }
}

/**
 * node.cloneNode(deep)
 * 该方法将复制并返回调用它的节点的副本。如果传递给它的参数是 true，它还将递归复制当前节点的所有子孙节点。否则，它只复制当前节点。
 */
node.cloneNode(deep);

/**
 * appendChild的坑
 */
node.appendChild(node.childNodes[0]); //当node已经存在子节点childNodes[0]时，复制先删除当前子节点，再追加该childNodes[0]

/**
 * cmd amd commonjs
 */
/**
 * 1.AMD-异步模块定义,依赖前置；
 * AMD是RequireJS在推广过程中对模块定义的规范化产出
 * define(['package/lib'], function(lib){
 *      return {}
 * });
 * 
 * 2）CMD---是SeaJS在推广过程中对模块定义的规范化产出，是一个同步模块定义，就近依赖
 * 是SeaJS的一个标准，SeaJS是CMD概念的一个实现，SeaJS是淘宝团队提供的一个模块开发的js框架.
 * define(function(require, exports, module){
 *      var $ = require('jquery');
 * });
 * 
 * 3）CommonJS规范---是通过module.exports定义的，在前端浏览器里面并不支持module.exports,
 * 通过node.js后端使用的。Nodejs端是使用CommonJS规范的，前端浏览器一般使用AMD、CMD、ES6等定义模块化开发的
 * exports.aaa = function(){}
 * module.exports = function(){}
 * 
 * var aaa = require('./aaa.js')
 * 
 * 4）ES6特性，模块化---export/import对模块进行导出导入的
 * export default {}
 * import aa from '';
 *  */

 /**
  * vuerouter hash模式和history模式区别
  * 对于vue这类渐进式前端开发框架，为了构建 SPA（单页面应用），需要引入前端路由系统，
  * 这也就是 Vue-Router 存在的意义。前端路由的核心，就在于 —— 改变视图的同时不会向后端发出请求。
  * 
  * 1.hash模式背后的原理是onhashchange事件,可以在window对象上监听这个事件:
  * hash —— 即地址栏 URL 中的 # 符号（此 hash 不是密码学里的散列运算）。
  * 比如这个 URL：www.abc.com/#/hello的值为 #/hello。
  * 它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，
  * 因此改变 hash 不会重新加载页面。
  * 
  * 2.history —— 利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法。
  * （需要特定浏览器支持）这两个方法应用于浏览器的历史记录栈，在当前已有的 back、forward、go 的基础之上，
  * 它们提供了对历史记录进行修改的功能。只是当它们执行修改时，虽然改变了当前的 URL，但浏览器不会立即向后端发送请求。
  * 如 www.abc.com/book/id
  *  */
 window.onhashchange = function(event){
    console.log(event.oldURL, event.newURL);
    let hash = location.hash.slice(1); 
    document.body.style.color = hash;
}

/**
 * 移动端1px问题
 * 检测手机是几倍屏-》window.devicePixelRatio
 * 在不同的屏幕上(普通屏幕 vs retina屏幕)，css像素所呈现的大小(物理尺寸)是一致的，
 * 不同的是1个css像素所对应的物理像素个数是不一致的。
 * 在普通屏幕下，1个css像素 对应 1个物理像素(1:1)。
 * 在retina（视网膜）屏幕下，1个css像素对应 4个物理像素(1:4)。
 * 
 * 使用 viewport+rem+js 来实现的，可以直接设置1px就行了
 * <html>  
    <head> 
        <title>1px question</title> 
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"> 
        <meta name="viewport" id="WebViewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">      
        <style> 
            html { 
                font-size: 1px; 
            }            
            * { 
                padding: 0; 
                margin: 0; 
            } 
               
            .bds_b { 
                border-bottom: 1px solid #ccc; 
            } 
               
            .a, 
            .b { 
                margin-top: 1rem; 
                padding: 1rem;               
                font-size: 1.4rem; 
            } 
               
            .a { 
                width: 30rem; 
            } 
               
            .b { 
                background: #f5f5f5; 
                width: 20rem; 
            } 
        </style> 
        <script> 
           
            var viewport = document.querySelector("meta[name=viewport]"); 
            //下面是根据设备像素设置viewport 
            if (window.devicePixelRatio == 1) { 
                viewport.setAttribute('content', 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'); 
            } 
            if (window.devicePixelRatio == 2) { 
                viewport.setAttribute('content', 'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no'); 
            } 
            if (window.devicePixelRatio == 3) { 
                viewport.setAttribute('content', 'width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no'); 
            } 
            var docEl = document.documentElement; 
            var fontsize = 10 * (docEl.clientWidth / 320) + 'px'; 
            docEl.style.fontSize = fontsize; 
               
        </script> 
    </head> 
    <body> 
        <div class="bds_b a">下面的底边宽度是虚拟1像素的</div> 
        <div class="b">上面的边框宽度是虚拟1像素的</div> 
    </body> 
</html></span> 
 */

/**
 * http2特性
 * 1.服务器推送
 * 2.多路复用（http1长连接复用）
 * 3.头部压缩
 */