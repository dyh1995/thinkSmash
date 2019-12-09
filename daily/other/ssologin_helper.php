<?php
/**
 * Created by caiyujiang
 * User: caiyujiang
 * Date: 2016-01-07
 * Time: 上午11:01
 * To change this template use File | Settings | File Templates.
 */
class ssologin {

    //授权返回页面页面
    private $_authBackUrl = 'http://%s/page/ssologin/';
    //授权页面
    private $_service = 'http://%s/page/ssologin/';
    private $_authBaseUrl = 'http://sso.sandai.net/server/login?service=%s&serverlogin=%s';

    private $SESSION_LOGIN = 'userinfo';
    private $SESSION_PREFIX = 'ssologin';
    private $SESSION_USERID = 'userid';

    private static $instance;
    public static function getInstance()
    {
        if(self::$instance == null)
        {
            $class = __CLASS__;
            self::$instance = new $class();
        }
        return self::$instance;
    }

    /**
     * 初始化
     */
    public function __construct() {
        $server = $_SERVER['HTTP_HOST'];
        //print_r($_SERVER);
        $this->_authBackUrl = sprintf($this->_authBackUrl,$server);
        $this->_service = sprintf($this->_service,$server);
    }

    /**
     * 根据ticket获取sso用户的信息
     */
    public function getInfoFromTicket($ticket){
        $_authBackUrl = urlencode($this->_authBackUrl);
        $checkUrl = "http://sso.sandai.net/server/serviceValidate?service={$this->_service}&ticket={$ticket}";
        $xml = $this->curl_data( $checkUrl, 1 ) ;
        $username = $truename = '';
        if (!empty($xml) && preg_match('/<cas\:name>UserLogNo<\/cas\:name>[^\<]*<cas\:value>([^\<]*)<\/cas\:value>/i', $xml, $matches) && preg_match('/<cas\:name>Email<\/cas\:name>/i', $xml)) {
            $username = $matches[1];
        }
        if (!empty($xml) && preg_match('/<cas\:name>TrueName<\/cas\:name>[^\<]*<cas\:value>([^\<]*)<\/cas\:value>/i', $xml, $matches) && preg_match('/<cas\:name>Email<\/cas\:name>/i', $xml)) {
            $truename = urldecode($matches[1]);
        }

        return array('username'=>$username,'truename'=>$truename);
    }

    /**
     * 根据ticket获取sso用户的信息
     */
    public function getAuthUrl(){
        $_authBackUrl = urlencode($this->_authBackUrl);
        $_service = urlencode($this->_service);
        return sprintf($this->_authBaseUrl,$_service,$_authBackUrl);
    }

    private function curl_data($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }
}