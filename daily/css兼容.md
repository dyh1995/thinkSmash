
### ihpone上h5页面字体被放大的问题处理
text-size-adjust：auto | none | <percentage> 属性允许我们控制将文本溢出算法应用到一些手机设备上，添加代码
```
html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
```
[webpack模块化原理-ES module](http://www.tensweets.com/article/5badeb04f0cb0c04f86b23e9 "webpack模块化原理-ES module")

### 解决ihpone上h5页面滑动卡顿的问题
```
-webkit-overflow-scrolling: touch;
```

### 解决ihpone上h5页面元素被切或动画闪动问题
由于项目中页面最终尺寸使用rem作为单位，在ios上，rem在渲染时会被计算成带有小数位的px值，会造成
一些icon被切掉或者序列帧动画雪碧图定位不准，闪动的问题。
针对图片被切的问题，可以在切图时给图片四周留1-2px的空白间距。
针对动画闪动的问题，可以设定background-posion和图片宽高为Px，不转为rem，同时使用媒体查询进行缩放

###  移动端span元素点击时出现高亮蓝色背景的样式兼容问题
```
-webkit-tap-highlight-color: rgba(0,0,0,0);
```