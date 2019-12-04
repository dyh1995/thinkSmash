```javascript
function start(tasks) {
    var result = [];
    return tasks.reduce((accumulator, item, index) => {
        return accumulator.then(res => {
            result.push(res);
            return index == tasks.length - 1 ? item.then(res => { result.push(res); return result; }) : item;
        });
    }, Promise.resolve(0));
}

function delay(time) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(time);
        }, time);
    });
}

start([delay(3000), delay(2000), delay(1000)]).then(res => {
    console.log(res); // [0, 3000, 2000, 1000]
});
```

```javascript
function promiseFunc2(index) {
    var p = new Promise(function(resolve,reject){
	     setTimeout(()=> {
          console.log('test2方法执行' + index);
		  resolve('promise2返回数据' + index);
        }, 2000);
	   });
	   return p;
}

//async返回的是promise对象
async function demoAsyn() {
    let res1 = await promiseFunc2(1);
	let res2 = await promiseFunc2(2);
	let res3 = await promiseFunc2(3);
	return res1 + res2 + res3;
}
demoAsyn().then((res) => {
    console.log(res);
});
```