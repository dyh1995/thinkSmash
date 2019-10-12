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