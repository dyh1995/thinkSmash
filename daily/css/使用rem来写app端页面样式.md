由于rem的自适应性，可以用来适配不同分辨率的页面
页面根字号的设定如下：
```css
:root{
	--psd: 750;
	--rfz: 100;
}
html{font-size: calc(100vw / var(--psd) * var(--rfz));}
```

例设计稿宽度为750px，根元素（body）的字号大小是13.33vw
font-size = 100vw / var(--psd) * var(--rfz)
          = 100vw / 750 * 100 
          ≈ 0.13333vw * 100
          = 13.33vw
∵ 100vw = 750px;
∴ 1px = 100vw / 750 = 0.13vw

1rem = 1font-size = 13.33vw = 100px;
当需要渲染一个width:200px的元素时，设置width:200px，postcss的px2rem插件转换为rem则为2rem = 26.66vw;
```

### 参考
[zepto跨域ajax无法带cookie的问题](https://segmentfault.com/a/1190000010955254 "zepto跨域ajax无法带cookie的问题")