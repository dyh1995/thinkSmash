### typeof
```javascript
typeof 1 == 'number';
typeof 'str' == 'string';
typeof true == 'boolean';
typeof {} == 'object';
typeof [] == 'object';
typeof null == 'object';
typeof function a(){} == 'function';
typeof undefined == 'undefined';
```

### instanceof
instanceof运算符用来测试一个对象在其原型链中是否存在一个构造函数的prototype属性。
```javascript
[] instanceof Array     //true
[] instanceof Object     //true

```

### js基本数据类型和引用数据类型
基本数据类型(基本类型的访问是按值访问的,存放在栈区): string,number,boolean,null,undefined,symbol
不可添加属性，eg：
```javascript
var a = 123;
a.name = 'name';
console.log(a.name) //undefined
```

引用数据类型(基本类型的访问是按引用访问的,指针存放在栈区，值存在堆区): array, function