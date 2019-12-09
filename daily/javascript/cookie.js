/**
 * 写cookie
 * @param {type} name
 * @param {type} value
 * @param {type} expireMin 有效期 默认当前会话期
 * @param {type} domain 域名，默认当前访问的域名
 * @returns {undefined}
 */

function setCookie(name, value, expireMin, domain) {
    domain = domain || window.location.hostname;

    if (domain == 'root') {
        var urlHost = location.hostname;
        var ary = urlHost.split('.');
        var len = ary.length;
        domain = ary[len - 2] + '.' + ary[len - 1];
    }

    if (arguments.length > 2) {
        var expireTime = new Date(new Date().getTime() + parseInt(expireMin * 60 * 1000));
        document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; domain=' + domain + '; expires=' + expireTime.toGMTString();
    } else {
        document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; domain=' + domain;
    }

}

/**
 * 读取cookie
 * @param {type} name
 * @returns {RegExp.$2|String}
 */
function getCookie(name) {
    return (document.cookie.match(new RegExp('(^' + name + '| ' + name + ')=([^;]*)')) == null) ? '' : decodeURIComponent(RegExp.$2);
}

window.setCookie = setCookie;
window.getCookie = getCookie;
export { setCookie, getCookie };
