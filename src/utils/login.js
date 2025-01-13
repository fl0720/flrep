import {getAccesToken} from "@/api/auth/auth";
import store from "@/store";

export const suposUtils = {
  delParam(paramKey) {
    var url = window.location.href; //页面url
    var urlParam = window.location.search.substr(1); //页面参数
    var beforeUrl = url.substr(0, url.indexOf("?")); //页面主地址（参数之前地址）
    var nextUrl = "";// eslint-disable-line no-unused-vars
    var arr = new Array();
    if (urlParam != "") {
      var urlParamArr = urlParam.split("&"); //将参数按照&符分成数组
      for (var i = 0; i < urlParamArr.length; i++) {
        var paramArr = urlParamArr[i].split("="); //将参数键，值拆开
        //如果键雨要删除的不一致，则加入到参数中
        if (paramArr[0] != paramKey) {
          arr.push(urlParamArr[i]);
        }
      }
    }
    if (arr.length > 0) {
      nextUrl = "?" + arr.join("&");
    }
    url = beforeUrl;
    return url;
  },
  getQueryString(key) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    return null;
  },

  async accessToken() {
    let code = this.getQueryString('code') || '';
    if (code) {
      let res = await getAccesToken(code)
      if (res && res.code === 200) {
        let url = suposUtils.delParam('code');//code使用过后 将其清除
        window.history.pushState({}, 0, url);
        store.dispatch("SSOLogin", res.data).then(() => {
          // this.$router.push({path: this.redirect || "/"}).catch(() => {
          // });
        }).catch(() => {
        });
      }
    } else {
      //如果没有登录切url参数上没有code参数则302到supOS换取认证
      let url = encodeURIComponent(window.location.href);
      window.location.href = "/api/auth/authorize?redirect_url=" + url
    }
  }

}
