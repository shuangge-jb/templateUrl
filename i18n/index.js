import hws from "i18n/hws/index";
import ctc from "i18n/ctc/index";
import defaultI18n from "i18n/default/index";

export default function(scene) {
  const language =
    window.urlParams && window.urlParams.lang ? window.urlParams.lang : "zh-CN";
  const map = {
    hws: language => {
      return hws(language);
    },
    ctc: language => ctc(language),
    default: language => defaultI18n(language)
  };
  return map[scene](language);
}
