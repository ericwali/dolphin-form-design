
/**
 * Convert css strings to class style rules
 * @param val Css string
 * @return string[] Css array
 */
export function parseCss (val: string): string[] {
  if (!val) return []
  return val.split(/}\s+./).filter(v => v).map(item => {
    (item = item.trim())[0] !== '.' && (item = '.' + item)
    item[item.length - 1] !== '}' && (item += '}')
    return item
  })
}

/**
 * Insert custom style
 * @param css Parse css
 * @param formId Form unique id
 * @return void
 */
export function insertCss (css: string[], formId: string): void {
  // Get an embed style, note that you need to set head[0] to embed style
  const styleSheets = document.styleSheets[0]
  const rules = styleSheets.cssRules
  // Delete the added style
  for (let i = 0; i < rules.length;) {
    const rule = rules[i]
    if (!(rule instanceof CSSStyleRule)) continue
    (rule.selectorText && rule.selectorText.indexOf(formId) === 0)
      ? styleSheets.deleteRule(i)
      : i++
  }
  // Insert style
  for (let i = 0; i < css.length; i++) styleSheets.insertRule(`.${formId} ${css[i]}`, 0)
}

/**
 * Get all class names of custom css styles
 * @param css Parse css strings
 * @return string[] Class
 */
export function classCss (css: string[]): string[] {
  return css.map(item => {
    const space = item.indexOf(' ')
    const leftBrackets = item.indexOf('{')
    let i = leftBrackets
    space > 0 && space < leftBrackets && (i = space)
    return item.substring(1, i)
  })
}
