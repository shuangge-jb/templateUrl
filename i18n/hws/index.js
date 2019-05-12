export default function(language) {
    const map = {
      "zh-CN": () =>
        import(/* webpackChunkName: "i18n/hws/zh-CN" */ "i18n/hws//zh-CN/index"),
      "en-US": () =>
        import(/* webpackChunkName: "i18n/hws/en-US" */ "i18n/hws//en-US/index")
    };
    return map[language || "zh-CN"]();
  }