## webpack打包后的文件执行机制

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

## webpack打包循环引用时的情况分析
当index.js引用了a.js，a.js引用了b.js，b.js引用了a.js时打包代码如下。
模块0为a.js，模块1为index.js，模块2为b.js
如果b.js使用了a.js内的对象属性或方法，执行代码会报错“Uncaught TypeError: Cannot read property 'name' of undefined”
原因分析：
1. __webpack_require__(1)，缓存installedModules[1]被赋值，之后call方法进入模块1内部后，调用了__webpack_require__(0)	//执行到index.js内引入了a.js
2. __webpack_require__(0)，缓存installedModules[0]被赋值，之后call方法进入模块0内部后，调用了__webpack_require__(2)	//执行到a.js内引入了b.js
3. __webpack_require__(2)，缓存installedModules[2]被赋值，之后call方法进入模块2内部后，调用了__webpack_require__(0)	//执行到b.js内引入了a.js
4. __webpack_require__(0)，直接返回了缓存中的installedModules[0]，但此时installedModules[0].export为{}	//b.js内引入了a.js后尝试调用a.name，但此时a为{}，报错

总结成一句话就是webpack加载了一个被认为已加载完成，但实际未加载完成的模块，**并调用了这个模块** 的属性，导致报错。
```
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

#### 参考文章
[简要分析webpack打包后代码](https://segmentfault.com/a/1190000006814420 "简要分析webpack打包后代码")

[webpack启动代码源码解读](https://segmentfault.com/a/1190000016524677 "webpack启动代码源码解读")