

export default function(language) {
  if (language === "zh-cn") {
    return new Promise((resolve, reject) => {
      require.ensure(
        [],
        require => {
          return resolve(require("i18n/default/zh-cn/ddm"));
        },
        err => reject(err),
        `i18n/default/zh-cn/ddm`
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      require.ensure(
        [],
        require => {
          return resolve(require("i18n/default/en-us/ddm"));
        },
        err => reject(err),
        `i18n/default/en-us/ddm`
      );
    });
  }
}
