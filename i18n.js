

export default function(language) {
  if (language === "zh-cn") {
    return import(/* webpackChunkName: "i18n/default/zh-cn/ddm" */ 'i18n/default/zh-cn/ddm');
  } else {
    return import(/* webpackChunkName: "i18n/default/en-us/ddm" */ 'i18n/default/en-us/ddm');
  }
}
