/**
apply()
    使用 apply， 你可以继承其他对象的方法：
这里apply()的第一个参数是null，在非严格模式下，第一个参数为null或者undefined时会自动替换为指向全局对象，apply()的第二个参数为数组或类数组。

call()
    call()是apply()的语法糖，作用和apply()一样，同样可实现继承，唯一的区别就在于call()接收的是参数列表，而apply()则接收参数数组。

bind()
    bind()的作用与call()和apply()一样，都是可以改变函数运行时上下文，区别是call()和apply()在调用函数之后会立即执行，而bind()方法调用并改变函数运行时上下文后，返回一个新的函数，供我们需要时再调用。
 */

 function Person(){}
 Person.prototype = {
    name: 'name2',
    say: function() {
        console.log("My color is " + this.name);
    }
 }
 var p1 = new Person();
 p1.say();

 p2 = {
     name: 'p2name'
 }
 p1.say.call(p2)