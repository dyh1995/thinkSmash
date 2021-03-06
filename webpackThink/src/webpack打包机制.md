## 一、webpack打包后的文件执行机制

1. 简化后的代码如下，是一个自执行函数，参数是一个数组，数组每个元素是引用的模块内容
2. webpack会按模块引入的顺序，对参数数组中的元素由0开始编号
3. __webpack_require__ 是模块引入函数，最初会调用模块0
4. __webpack_require__ 内首先判断moduleId模块是否在缓存中，若不在则在installedModules建立以moduleId为
	id的对象
5. modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	这行代码调用了moduleId模块，同时调用后把该模块存入module.exports。
	第一个参数相当于this，可以理解为{}，第三个实参module.exports传入后在模块里面形参是__webpack_exports__
	最终模块的代码会挂载在__webpack_exports__上，相当于把模块存入了module.exports和installedModules中
6. 返回module.exports

```
 //index.js
 	import fna from './fna.js';
	console.log('Hello World!'+fna.name);

 //fna.js
	export default {
		name: 'aModule'
	};

 //fnb.js
	export default {
		name: 'bModule'
	};

 //bundle.js
 (function(modules) {
 	var installedModules = {};  //模块缓存

 	function __webpack_require__(moduleId) {
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		module.l = true;
 		
 		return module.exports;
 	}

 	return __webpack_require__(__webpack_require__.s = 0);
 })

([
/* 0 */
	(function(module, __webpack_exports__, __webpack_require__) {
"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fna_js__ = __webpack_require__(1);
console.log('Hello World!'+__WEBPACK_IMPORTED_MODULE_0__fna_js__["a" /* default */].name);
	}),
/* 1 */
	(function(module, __webpack_exports__, __webpack_require__) {
"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'aModule'
});
	})
		]);
```

## 二、webpack打包循环引用时的情况分析
当index.js引用了a.js，a.js引用了b.js，b.js引用了a.js时打包代码如下。
模块0为a.js，模块1为index.js，模块2为b.js
如果b.js使用了a.js内的对象属性或方法，执行代码会报错“Uncaught TypeError: Cannot read property 'name' of undefined”
原因分析：
1. __webpack_require__(1)，缓存installedModules[1]被赋值，之后call方法进入模块1内部后，调用了__webpack_require__(0)	//执行到index.js内引入了a.js
2. __webpack_require__(0)，缓存installedModules[0]被赋值，之后call方法进入模块0内部后，调用了__webpack_require__(2)	//执行到a.js内引入了b.js
3. __webpack_require__(2)，缓存installedModules[2]被赋值，之后call方法进入模块2内部后，调用了__webpack_require__(0)	//执行到b.js内引入了a.js
4. __webpack_require__(0)，直接返回了缓存中的installedModules[0]，但此时installedModules[0].export为{}	//b.js内引入了a.js后尝试调用a.name，但此时a为{}，报错

总结成一句话就是webpack加载了一个被认为已加载完成，但实际未加载完成的模块，**并调用了这个模块** 的属性，导致报错。
```JavaScript
([
/* 0 */
	(function(module, __webpack_exports__, __webpack_require__) {
"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fnb__ = __webpack_require__(2);
/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'aModule'+__WEBPACK_IMPORTED_MODULE_0__fnb__["a" /* default */].name
});
	}),
/* 1 */
	(function(module, __webpack_exports__, __webpack_require__) {
"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fna_js__ = __webpack_require__(0);

console.log('Hello World!'+__WEBPACK_IMPORTED_MODULE_0__fna_js__["a" /* default */].name);

	}),
/* 2 */
	(function(module, __webpack_exports__, __webpack_require__) {
"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fna__ = __webpack_require__(0);

/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'bModule'+__WEBPACK_IMPORTED_MODULE_0__fna__["a" /* default */].name
});

	})
]);
```


## 三、条件语句引入模块时对webpack打包的影响
```JavaScript
//index.js
function test(type){
    if(type == 1){
        var fna = require( './fna.js');
        console.log('Hello World!'+fna.name);
    }else{
        var fnb = require( './fnb.js');
        console.log('Hello World!'+fnb.name);
    }
}

//a模块和b模块都会被打包进bundle，条件语句只是在执行时走了不同的代码而已，并没有做到按需加载。
```

## 四、import引入模块时webpack打包的异同
想要实现真正的动态加载模块，需要使用import()方法。
```JavaScript
//index.js
function test(type){
    if(type == 1){
        import('./fna.js').then(fna => {
            console.log('Hello World!'+fna.default.name);
        });
    }
}
```

打包后bundle.js中并没有出现fna模块的内容，而是出现了0.bundle.js这个文件，内容是模块fna，代码如下
通过bundle.js中的条件语句，实现了动态加载0.bundle.js文件。
```JavaScript
//0.bundle.js
webpackJsonp([0],[
/* 0 */,
/* 1 */
	 (function(module, __webpack_exports__, __webpack_require__) {

		"use strict";
		Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
		/* harmony default export */ __webpack_exports__["default"] = ({
			name: 'aModule'
		});
	 })
]);
```
1. 在bundle.js中，增加了installedChunks缓存。__webpack_require__.e 是引入chunk的核心方法，返回promise对象。
![installedChunks](https://segmentfault.com/img/bVbiF9e?w=589&h=442''installedChunks'')
2. __webpack_require__.e 执行阶段(在chunk存入缓存但未加载时)，installedChunks[n]内容被赋值为[resolve,reject,promise]
3. webpackJsonp 执行阶段(在chunk存入缓存且完成加载时)，installedChunks[n]内容被赋值为0，改赋值操作是在chunk文件加载完成后执行window[webpackJsonp]方法时进行的，同时会触发js的onload事件，触发__webpack_require__.e的onScriptComplete事件进行加载校验
4. 挂载到window下面的webpackJsonp函数是动态加载模块代码下载后的回调，它会通知webpack模块下载完成并将模块加入到modules当中。
5. 加载成功则调用resolve，失败则调用reject。resolve后不会传入模块本身，而是通过__webpack_require__来加载模块内容，require的模块id由webpack来生成
6. bundle内的parentJsonpFunction作用：使异步加载的模块在多个不同的bundle内同步。
7. __webpack_require__.n 主要处理commonjs规范和es_module规范模块之间引用是差异兼容问题

#### 参考文章
[简要分析webpack打包后代码](https://segmentfault.com/a/1190000006814420 "简要分析webpack打包后代码")
[webpack启动代码源码解读](https://segmentfault.com/a/1190000016524677 "webpack启动代码源码解读")
[webpack模块化原理-ES module](https://segmentfault.com/a/1190000010955254 "webpack模块化原理-ES module")

### tapable内部钩子

Sync 同步类型的钩子（通过 tap 注册的事件，通过 call 触发）
1. SyncHook 为串行同步执行，不关心事件处理函数的返回值，在触发事件之后，会按照事件注册的先后顺序执行所有的事件处理函数。
2. SyncBailHook 同样为串行同步执行，如果事件处理函数执行时有一个返回值不为空（即返回值为 undefined），则跳过剩下未执行的事件处理函数（如类的名字，意义在于保险）。
3. SyncWaterfallHook 为串行同步执行，上一个事件处理函数的返回值作为参数传递给下一个事件处理函数，依次类推，正因如此，只有第一个事件处理函数的参数可以通过 call 传递，而 call 的返回值为最后一个事件处理函数的返回值。
4. SyncLoopHook 为串行同步执行，事件处理函数返回 true 表示继续循环，即循环执行当前事件处理函数，返回 undefined 表示结束循环，SyncLoopHook 与 SyncBailHook 的循环不同，SyncBailHook 只决定是否继续向下执行后面的事件处理函数，而 SyncLoopHook 的循环是指循环执行每一个事件处理函数，直到返回 undefined 为止，才会继续向下执行其他事件处理函数，执行机制同理。

Async 异步类型的钩子
Async 类型可以使用 tap、tapAsync 和 tapPromise 注册不同类型的插件 “钩子”，分别通过 call、callAsync 和 promise 方法调用
1. AsyncParallelHook 为异步并行执行
2. AsyncSeriesHook 为异步串行执行

在 tapable 源码中，注册事件的方法 tab、tapSync、tapPromise 和触发事件的方法 call、callAsync、promise 都是通过 compile 方法快速编译出来的
在 Webpack 中，这些 “钩子” 的真正作用就是将通过配置文件读取的插件与插件、加载器与加载器之间进行连接，“并行” 或 “串行” 执行

#### 参考文章
[Webpack 核心模块 tapable 解析](https://www.jianshu.com/p/273e1c9904d2 "Webpack 核心模块 tapable 解析")
