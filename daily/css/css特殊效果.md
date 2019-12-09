
### 段落文字的首行缩进两个文字
```css
{
    text-indent: 2em;
}
```

### 文字过长隐藏三个点
```css
{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
```

### 隐藏一个元素
```css
{
    display:none;       //隐藏，不触发事件，不占据空间
    visibility: hidden; //隐藏，不触发事件，占据空间
    opacity: 0;         //隐藏，触发事件，占据空间
}
```

### border制作三角形
```css
.down{ 
	border-width: 20px;
	border-color: transparent transparent #333;
}
.up{ 
	border-width: 20px;
	border-color: #333  transparent transparent;
}
```

### 使用clip-path制作小三角形
```css
.triangle {
	width: 50px;
	height: 40px;
	-webkit-clip-path: polygon(0 100%, 50% 0, 100% 100%);
	background-color:#F05050 ;
}
```

### font-weight: 100, 200, 300, ..., 900, normal, bold, bolder, lighter取值
normal -> 400
bold -> 700
但是还是和字体有关，一种字体不一定包含全部的字重，例如设置为normal，但是该字体没有对应400字重的字体，则会先降重查找，再加重查找
400 -> 300 -> 200 -> 100 -> 500 -> 600 ...

### line-height
父元素设置line-height:1.5会直接继承给子元素，子元素根据自己的font-size再去计算子元素自己的line-height。
父元素设置line-height:150%是计算好了line-height值，然后把这个计算值给子元素继承，子元素继承拿到的就是最终的值了。此时子元素设置font-size就对其line-height无影响了。

比如
父元素设置属性：font-size:14px; line-height:1.5; child设置font-size:26px;
那么父元素：line-height = 14px * 1.5 = 21px，子元素：line-height = 26px * 1.5 = 39px。

父元素设置属性：font-size:14px; line-height:150%; child设置font-size:26px;
那么父元素：line-height = 14px * 150% = 21px，子元素：line-height = 父元素的line-height = 21px。

### box-sizing: content-box | border-box | inherit;
content-box：这是由CSS2.1规定的宽度高度行为，宽度和高度分别应用到元素的内容框，在宽度和高度之外绘制元素的内边距和边框；(width = content)
border-box：为元素设定的宽度和高度决定了元素的边框盒，就是说，为元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制。通过从已设定的宽度和高度分别减去边框和内边距才能得到内容的宽度和高度;
inherit：规定应从父元素继承box-sizing属性的值; (width = content + padding + border)

### box-shadow: h-shadow v-shadow blur spread color inset;
h-shadow 必需。水平阴影的位置。允许负值。
v-shadow 必需。垂直阴影的位置。允许负值。
blur	 可选。模糊距离。
spread	 可选。阴影的尺寸。
color	 可选。阴影的颜色。
inset	 可选。将外部阴影 (outset) 改为内部阴影。

