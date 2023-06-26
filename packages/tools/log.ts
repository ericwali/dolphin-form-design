
const log:{
  capsule: (title: string, info: string, type: string) => void;
  colorful: (textArr: { text: string; type?: string; }[]) => void;
  default: (text: string) => void;
  primary: (text: string) => void;
  success: (text: string) => void;
  warning: (text: string) => void;
  danger: (text: string) => void;
} = {
  /**
   * Print a [ title | text ] style message
   * @param {String} title title text
   * @param {String} info info text
   * @param {String} type style
   */
  capsule: (title: string, info: string, type = 'primary') => {
    console.log(
      `%c ${title} %c ${info} %c`,
      'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
      `background:${typeColor(
        type
      )}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
      'background:transparent'
    )
  },
  /** Print color text */
  colorful: (textArr: {
    text: string;
    type?: string;
  }[]) => {
    console.log(
      `%c${textArr.map(t => t.text || '').join('%c')}`,
      ...textArr.map(t => `color: ${typeColor(t.type)};`)
    )
  },
  /** Print default style text */
  default: (text: string) => {
    log.colorful([{ text }])
  },
  /** Print primary style text */
  primary: (text: string) => {
    log.colorful([{ text, type: 'primary' }])
  },
  /** Print success style text */
  success: (text: string) => {
    log.colorful([{ text, type: 'success' }])
  },
  /** Print warning style text */
  warning: (text: string) => {
    log.colorful([{ text, type: 'warning' }])
  },
  /** Print danger style text */
  danger: (text: string) => {
    log.colorful([{ text, type: 'danger' }])
  }
}

/**
 * Returns the color value of this style
 * @param type Style name [ primary | success | warning | danger | text ]
 * @return string
 */
function typeColor (type = 'default'): string {
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

window.$Log = log
export default log
