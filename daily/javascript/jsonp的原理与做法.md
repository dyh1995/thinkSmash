<script>
    let btn = document.getElementById("button");
    let amount = document.getElementById("amount");

    btn.onclick = function () {
        let script = document.createElement("script");
        let functionName = 'taotao' + parseInt(Math.random() * 10000, 10);//***随机生成一个函数名
        window[functionName] = function (result) {//***必须使用window[functionName]这样的形式
            if (result.success === true) {
                amount.innerText = amount.innerText - 1;
            }
        }
        script.src = "http://jack.com:8002/pay?callback=" + functionName;//***将随机生成的函数名放到拼接到查询字符串上

        document.body.appendChild(script);//这句话一定要加上,这是与使用图片请求不一样的地方

        script.onload = function (e) {//如果script请求成功(返回码以2开头)
            e.currentTarget.remove();//添加移除代码
            delete window[functionName];//***不管成功失败,最后都移除functionName
        }
        
        script.onerror = function (e) {//返回码是4开头
            alert("失败")
            e.currentTarget.remove();
            delete window[functionName];//***不管成功失败,最后都移除functionName
        }
    }
</script>