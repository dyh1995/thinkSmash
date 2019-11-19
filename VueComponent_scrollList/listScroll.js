/**
 * 使用说明：
 * 该组件处理一般活动中获奖列表的滚动逻辑
 * 
 * 使用方法：
 * 1.在需要展示滚动列表的组件内引入该js 
 *      import listScroll from 'common/activity/listScroll.js';
 * 2.在设置完数据后初始化该组件 
 *      this.$nextTick(()=>{
            new listScroll({
                ulDom: "reward_ul",
                showItemCount: 1,
                forward: "portrait",
                interval: 2000
            });
        });
 * 参数说明：
 *      传入一个对象
 *      {
            forward: 'portrait',        // 纵向：portrait | 横向：horizontal
            showItemCount: 3,           // ul一次可以同时展示li的个数，一般是1，2，3。和判断ul是否滚动有关
            ulDom: 'act_luckylist_ul',  // 绑定的dom的id，不需要传#
            interval: 4000,             // 滚动时间间隔
 *      }
 */

class listScroll {
    constructor(params){
        this.ulDom = params.ulDom;
        this.$ulDom = null;
        this._dataLength = 1;
        this.forward = params.forward;
        this.showItemCount = params.showItemCount;    //需要移动的dom元素
        this.childDist = 0;   //一个li元素的宽度或高度，根据滚动方向决定
        this.rollTimer = null;//滚动定时器
        this.interval = params.interval;//滚动定时器

        this.init();
    }

    init(){
        this.$ulDom = document.querySelector("#" + this.ulDom);
        let liDom = document.querySelector("#" + this.ulDom + ' li');
        let lisDom = document.querySelectorAll("#" + this.ulDom + ' li');
        this._dataLength = lisDom.length;

        if (liDom) {
            if(this.forward == 'portrait'){   //纵向滚动
                this.childDist = parseFloat(this.getStyle(liDom, 'height')) + parseFloat(this.getStyle(liDom, 'marginBottom'));
                console.log('this.childDist',this.childDist)
            }else if(this.forward == 'horizontal'){
                this.childDist = parseFloat(this.getStyle(liDom, 'width')) + parseFloat(this.getStyle(liDom, 'marginRight'));
            }
        }

        if (this._dataLength > this.showItemCount && !this.rollTimer) {
            // 启动滚动定时器
            this.rollTimer = setInterval(() => {
                this.doRoll();
            }, this.interval);
        }
    }

    /**
     * 滚动
     */
    doRoll() {
        if (!this.ulDom) {
            return false;
        }
        this.$ulDom.style.transition = ".5s";
        var copydom = this.$ulDom.childNodes[0].cloneNode(true)
        this.$ulDom.appendChild(copydom);
        this.$ulDom.style.transform =`translateY(-${this.childDist}px)`;
        setTimeout(() => {
            this.$ulDom.style.transition = "none";
            this.$ulDom.removeChild(this.$ulDom.childNodes[0]);
            this.$ulDom.style.transform = 'translateY(0)';
        }, 1000);
    }

    /**
     * 获取一个元素的属性
     * @param {*} obj 
     * @param {*} attr 
     */
    getStyle(obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return document.defaultView.getComputedStyle(obj, null)[attr].replace('px', '');
        }
    }
}

export default listScroll;
