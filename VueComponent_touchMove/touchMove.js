/**
 * 使用说明：
 * 该组件处理一般活动中判断手指滑动方向,触发事件的逻辑
 * 
 * 使用方法：
 * 1.在需要展示滚动列表的组件内引入该js 
 *      import touchMove from 'common/activity/touchMove.js';
 * 2.混入组件 
 *      mixins: [touchMove],
 * 3.初始化组件
 *      this.touchMoveInit({
            xCb: yourfunction,  //x方向移动的回调事件
            yCb: yourfunction,  //y方向移动的回调事件
            moveDisX: 50,   //x方向移动距离(像素)触发事件
            moveDisY: 50,   //y方向移动距离(像素)触发事件
            moveType: 'touch',  //'touch'移动端 'mouse'pc端
          }); //初始化中奖列表滚动
 * 4. 在dom上绑定事件
          如<ul class="monster_main" @touchstart="touchStart" @touchend="touchEnd" @mousedown="touchStart" @mouseup="touchEnd">
 * notice：混入时请勿在原组件中绑定与该组件中同名属性。
 */
let touchMove = {
    name: 'touchMove',

    data() {
        return {
            startX: 0,
            endX: 0,
            startY: 0,
            endY: 0,

            moveDisX: 50,
            moveDisY: 50,

            moveXCb: null,
            moveYCb: null,

            mouseOrTouch: 'touch',
        };
    },

    methods: {
        touchMoveInit(params) {
            this.moveDisX = params.moveDisX || 50;
            this.moveDisY = params.moveDisY || 50;
            this.moveXCb = params.moveXCb || null;
            this.moveYCb = params.moveYCb || null;
            this.mouseOrTouch = params.moveType || 'touch';
        },

        touchStart(e){
            if(this.mouseOrTouch == 'touch'){
                this.startX = this.endX = e.changedTouches[0] && e.changedTouches[0].pageX;
                this.startY = this.endY = e.changedTouches[0] && e.changedTouches[0].pageY;
            }else{
                this.startX = this.endX = e.pageX;
                this.startY = this.endY = e.pageY;
            }
        },

        touchEnd(e){
            if(this.mouseOrTouch == 'touch'){
                this.endX = e.changedTouches[0] && e.changedTouches[0].pageX;
                this.endY = e.changedTouches[0] && e.changedTouches[0].pageY;
            }else{
                this.endX = e.pageX;
                this.endY = e.pageY;
            }

            if(this.endX - this.startX >= this.moveDisX){ //x pre方向移动了
                this.moveXCb && this.moveXCb('pre');
            }else if(this.startX - this.endX >= this.moveDisX){ //x next方向移动了
                this.moveXCb && this.moveXCb('next');
            }
            if(this.endY - this.startY >= this.moveDisY){ //y pre方向移动了
                this.moveYCb && this.moveYCb('pre');
            }else if(this.startY - this.endY >= this.moveDisY){ //y next方向移动了
                this.moveYCb && this.moveYCb('next');
            }
        }
    },
}

export default touchMove;
