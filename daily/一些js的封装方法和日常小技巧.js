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
var compose = function(...args) {
    return function(x) {
        return args.reduceRight(function(value, item){
            return item(value)
        }, x);
    }
};
//es6
// var compose = (...args) => x => args.reduceRight((value, item) => item(value), x);
var toUpperCase = function(x) { return x.toUpperCase(); };
var exclaim = function(x) { return x + '!'; };
var shout = compose(exclaim, toUpperCase);  //组合函数
shout("send in the clowns");
//=> "SEND IN THE CLOWNS!"
