export default function(language) {
    const map = {
      "zh-CN": () =>
        import(/* webpackChunkName: "i18n/ctc/zh-CN" */ "./zh-CN/index"),
      "en-US": () =>
        import(/* webpackChunkName: "i18n/ctc/en-US" */ "./en-US/index")
    };
    return map[language || "zh-CN"];
  }
  