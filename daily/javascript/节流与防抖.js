//节流实现起来很好理解，设置一个bool值，在时间阀之内，根据这个bool来判断是否执行函数。
function throttle(fn,times = 300){ 
    let bool = true;
    return function(){
        if(!bool){
            return false;
        }
        bool = false
        setTimeout(()=>{
            bool = true;
            fn.apply(this,arguments);
        },times);
    }
}

//防抖实现起来的思路是，用闭包保存执行的函数，多次执行的时候把上一个执行的函数清除掉，然后再次创建一个新的函数。这样在间隔时间内还有事件触发的话，不会执行之前的函数，这么一来，函数真正的执行就是最后一次事件触发。
function debounce(fn,times){
    let timeout = null
    return function(){
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            fn.apply(this,arguments)
        },times)
    }
} 