const log:{
  capsule: Function;
  colorful: Function;
  default: Function;
  primary: Function;
  success: Function;
  warning: Function;
  danger: Function;
} = {

}

/**
 * Returns the color value of this style
 * @param type Style name [ primary | success | warning | danger | text ]
 * @return string
 */
function typeColor(type: string = 'default'): string {
  let color = ''
  switch (type) {
    case 'default':
      color = '#35495E'
      break
    case 'primary':
      color = '#3488ff'
      break
    case 'success':
      color = '#43B883'
      break
    case 'warning':
      color = '#e6a23c'
      break
    case 'danger':
      color = '#f56c6c'
      break
    default:
      break
  }
  return color
}

/**
 * Print a [ title | text ] style message
 * @param {String} title title text
 * @param {String} info info text
 * @param {String} type style
 */
log.capsule = function (title: string, info: string, type = 'primary') {
  console.log(
    `%c ${title} %c ${info} %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:${typeColor(
      type
    )}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
    'background:transparent'
  )
}

/** Print color text */
log.colorful = function (textArr: {
  text: string;
  type: string;
}[]) {
  console.log(
    `%c${textArr.map(t => t.text || '').join('%c')}`,
    ...textArr.map(t => `color: ${typeColor(t.type)};`)
  )
}

/** Print default style text */
log.default = function (text: string) {
  log.colorful([{ text }])
}

/** Print primary style text */
log.primary = function (text: string) {
  log.colorful([{ text, type: 'primary' }])
}

/** Print success style text */
log.success = function (text: string) {
  log.colorful([{ text, type: 'success' }])
}

/** Print warning style text */
log.warning = function (text: string) {
  log.colorful([{ text, type: 'warning' }])
}

/** Print danger style text */
log.danger = function (text: string) {
  log.colorful([{ text, type: 'danger' }])
}

window.log = log
export default log
