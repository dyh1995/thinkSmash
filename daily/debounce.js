///* eslint-disable no-undefined */
//
//var throttle = require('./throttle');
//
///**
// * Debounce execution of a function. Debouncing, unlike throttling,
// * guarantees that a function is only executed a single time, either at the
// * very beginning of a series of calls, or at the very end.
// *
// * @param  {Number}   delay         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
// * @param  {Boolean}  atBegin       Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
// *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
// *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
// * @param  {Function} callback      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
// *                                  to `callback` when the debounced-function is executed.
// *
// * @return {Function} A new, debounced function.
// */
//module.exports = function ( delay, atBegin, callback ) {
//	return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
//};

/**
 * 函数连续调用时，间隔时间必须大于或等于wait，func才会执行
 * @param {Function} func - 传入函数
 * @param {Number} wait - 函数触发的最小间隔
 * @param {Boolean} [immediate] - 设置为ture时，调用触发于开始边界而不是结束边界
 * @returns {Function} - 返回客户调用函数
 */
module.exports = function (func, wait, immediate) {
    if (typeof Date.now !== 'function') {
        Date.now = function () {
            return new Date().getTime();
        };
    }

    var timeout, args, context, timestamp, result;

    var later = function () {
        //据上一次触发时间间隔
        var last = Date.now() - timestamp;

        //上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;

            //如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);

                if (!timeout) {
                    context = args = null;
                }
            }
        }
    };

    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();

        var callNow = immediate && !timeout;

        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
};
