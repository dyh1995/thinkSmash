/**
 * 使用说明：
 * 该组件处理一般活动中获奖列表的滚动逻辑
 * 
 * 使用方法：
 * 1.在需要展示滚动列表的组件内引入该js 
 *      import listScroll from 'common/activity/listScroll.js';
 * 2.混入组件 
 *      mixins: [listScroll],
 * 3.在接口拿到数据后初始化组件
 *      this.scrollListInit({
            scrollDataList: this.yourdataArr, 
            forward: 'portrait',
            showItemCount: 3,
            ulDom: 'act_luckylist_ul',
            interval: 4000,
          }); //初始化中奖列表滚动
 * 4. 在dom上绑定数据ulPosition
          如<ul class="act_luckylist_ul" id="act_luckylist_ul" :style="'transform: translateY(-' + ulPosition + 'px)'">
   5. 在dom上渲染数据scrollDataList
          如<li class="act_luckylist_item" v-for="item in scrollDataList">xxxxx</li>
 * 参数说明：
 *      传入一个对象
 *      {
 *          scrollDataList: '你需要渲染的列表的数据', 
            forward: 'portrait',        // 纵向：portrait | 横向：horizontal
            showItemCount: 3,           // ul一次可以同时展示li的个数，一般是1，2，3。和计算ul移动距离有关
            ulDom: 'act_luckylist_ul',  // 绑定的dom的id，不需要传#
            interval: 4000,             // 滚动时间间隔
 *      }
 * notice：混入时请勿在原组件中绑定与该组件中同名属性。
 */
let listScroll = {
    name: 'listScroll',

    data() {
        return {
            scrollDataList: [], //滚动列表的数据数组
            showItemCount: 1,   //ul元素同时显示的li的个数，一般情况是1，2，3
            ulDom: null,    //需要移动的dom元素
            childDist: 0,   //一个li元素的宽度或高度，根据滚动方向决定
            rollIndex: 1,   //滚动索引
            rollTimer: null,//滚动定时器
        };
    },

    computed: {
        ulPosition(){   //绑定在dom上的位置偏移
            return `${this.childDist * (this.rollIndex - 1)}`;
        }
    },

    methods: {
        scrollListInit(params) {
            this.scrollDataList = params.scrollDataList;
            this.showItemCount = params.showItemCount;

            this.$nextTick(() => {
                this.ulDom = document.querySelector("#" + params.ulDom);
                let liDom = document.querySelector("#" + params.ulDom + ' li');
                if (liDom) {
                    if(params.forward == 'portrait'){   //纵向滚动
                        //2019.7.29修改为window.getComputedStyle()获取元素宽高，这样不会忽略移动端就缺到小数点后的精度
                        this.childDist = parseFloat(this.getStyle(liDom, 'height')) + parseFloat(this.getStyle(liDom, 'marginBottom'));
                        // this.childDist = liDom.offsetHeight + parseFloat(this.getStyle(liDom, 'marginBottom'));
                    }else if(params.forward == 'horizontal'){
                        this.childDist = parseFloat(this.getStyle(liDom, 'width')) + parseFloat(this.getStyle(liDom, 'marginRight'));
                    }
                }

                if (this.scrollDataList.length > params.showItemCount && !this.rollTimer) {

                    // 给数组内增加params.showItemCount个数据，使滚动可以循环无缝衔接
                    let addArr = [];
                    for (let i = 0; i < params.showItemCount; i++) {
                        addArr.push(this.scrollDataList[i]);
                    }
                    this.scrollDataList = this.scrollDataList.concat(addArr);

                    // 启动滚动定时器
                    this.rollTimer = setInterval(() => {
                        this.doRoll();
                    }, params.interval);
                }
            });
        },

        doRoll() {
            if (!this.ulDom) {
                return false;
            }
            if (this.rollIndex < this.scrollDataList.length - this.showItemCount) {
                this.ulDom.style.transition = ".5s";
                this.rollIndex++;
            } else if (this.rollIndex == this.scrollDataList.length - this.showItemCount) {
                this.rollIndex++;
                setTimeout(() => {
                    this.ulDom.style.transition = "none";
                    this.rollIndex = 1;
                }, 500);
            }
        },

        getStyle(obj, attr) {
            if (obj.currentStyle) {
                return obj.currentStyle[attr];
            } else {
                return document.defaultView.getComputedStyle(obj, null)[attr].replace('px', '');
            }
        }
    },
}

export default listScroll;
