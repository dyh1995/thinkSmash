//index.js
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import main from './components/level/main.vue';
Vue.use(VueI18n); // 通过插件的形式挂载
const i18n = new VueI18n({
    locale: 'zh-CN', // 默认语言标识
    messages: {
        'zh-CN': require('./lang/level/zh'), // 中文语言包
        'en-US': require('./lang/level/en') // 英文语言包
    }
});
new Vue({
    el: '#app',
    i18n,
    render: h => h(main)
});

/*
    main.vue 

    <template>
        <div class="wrap">
            <div>{{ $t('lang.music') }}</div>
            <p class="testp" dir="rtl">这是一个测试文本</p>
        </div>
    </template>

    <script>
    export default {
        data () {
            return {
                lang: 'zh-CN'
            };
        },

        created () {
            if (this.lang == 'en-US') {
                this.lang = 'en-US';
                this.$i18n.locale = this.lang; // 关键语句
            } else {
                this.lang = 'zh-CN';
                this.$i18n.locale = this.lang; // 关键语句
            }
        }
    };
    </script>
*/

//语言包
export const lang = {
    music: 'Music', // 网易云音乐
    findMusic: 'FIND MUSIC', // 发现音乐
    myMusic: 'MY MUSIC', // 我的音乐
    friend: 'FRIEND', // 朋友
    musician: 'MUSICIAN', // 音乐人
    download: 'DOWNLOAD' // 下载客户端
};

/**
 * css样式从右到左处理
 * 主要方式是<html dir="rtl">
 * <div dir="rtl"></div>
 * 
 * 有一些踩坑点
 * 1.当html设置dir="rtl"后，部分脱离文档流的元素不受该属性影响
 * 如absolute定位，float布局，尽量不使用这种布局
 * 2.当页面整体改变dir为rtl后，如果部分元素不想改变方向，可以在该元素上使用dir="ltr"
 * 3.>箭头在改变方向后，文本内容也会发生方向改变，但汉字不会改变阅读方向
 * 4.避免不必要的样式，如text-align: left
 * 5.列表title的分边显示，最好不要设定tab的宽度，同时不适用text-align指定对其方式，外层使用flex布局，space-between
 */