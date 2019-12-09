1.输出的html页面内
<!--#include file="/ssi_include/file.html"-->

2.file.html内
<!--#set var="ATTR" value="https://www.baidu.com/" -->
<script type="text/javascript">
    window.CONSTANT = {
        ATTR: "<!--#echo var='ATTR' -->",
    };
</script>