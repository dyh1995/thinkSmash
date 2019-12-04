
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