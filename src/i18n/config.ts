// Locale 的相關標準:
// BCP 47 https://www.unicode.org/reports/tr35/tr35-59/tr35.html#Identifiers
// ISO 639-1 https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
// ISO 3166-1 https://en.wikipedia.org/wiki/ISO_3166-1

export enum Locale {
  enUS = 'en-US',
  zhTW = 'zh-TW',
  zhCN = 'zh-CN',
  vi = 'vi',
  th = 'th',
  // fil = 'fil', // TODO: disable filipino
  id = 'id',
  pt = 'pt',
  es = 'es',
  bn = 'bn',
  lo = 'lo',
  ko = 'ko',
}

export const defaultLocale = Locale.enUS

export const locales = [
  Locale.enUS,
  Locale.zhTW,
  Locale.zhCN,
  Locale.vi,
  Locale.th,
  Locale.id,
  Locale.pt,
  Locale.es,
  Locale.bn,
  Locale.lo,
  Locale.ko,
]

export const defaultNamespace = 'common'

export const cookieName = 'lang'
