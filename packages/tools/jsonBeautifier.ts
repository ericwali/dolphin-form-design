// eslint-disable-next-line no-control-regex,no-misleading-character-class
const escapable = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
const keyable = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
let gap: string
let indent: string
// Character substitution table
const meta: Record<string, string> = {
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r',
  '"': '\\"',
  "'": "\\'",
  '\\': '\\\\'
}
let rep: any

export interface ConvertOptions {
  // Specify indent
  space?: number;
  // Whether to remove the quotation marks on the object key
  dropQuotesOnKeys?: boolean;
  // Whether to delete the object value is the quotation marks in the number
  dropQuotesOnNumbers?: boolean;
  // Whether to turn on arrays in collapsed objects
  inlineShortArrays?: boolean;
  // The array in the folded object, the depth of the fold
  inlineShortArraysDepth?: number;
  // Quotation mark type(single,double)
  quoteType?: 'single' | 'double';
  // Reduce json, remove all formatting
  minify?: boolean;
}

export default function convert (object: any, options: ConvertOptions = {}): string {
  const space = options.space || 2
  const dropQuotesOnKeys = options.dropQuotesOnKeys || false
  const dropQuotesOnNumbers = options.dropQuotesOnNumbers || false
  const inlineShortArrays = options.inlineShortArrays || false
  const inlineShortArraysDepth = options.inlineShortArraysDepth || 1
  const quoteType = options.quoteType || 'double'
  const minify = options.minify || false

  if (dropQuotesOnNumbers) walkObjectAndDropQuotesOnNumbers(object)

  let result = stringify(object, undefined, minify ? undefined : space, dropQuotesOnKeys, quoteType)

  if (inlineShortArrays && !minify) {
    let newResult = inlineShortArraysInResult(result)
    // 深度递归折叠,默认深度折叠为1
    if (inlineShortArraysDepth > 1) {
      for (let i = 1; i < inlineShortArraysDepth; i++) {
        result = newResult
        newResult = inlineShortArraysInResult(result)
        if (newResult === result) break
      }
    }
    result = newResult
  }

  return result
}

/** Remove the quotation marks in the object value is a number */
function walkObjectAndDropQuotesOnNumbers (object: any): void {
  if (!isObject(object)) return
  const keys = Object.keys(object)
  if (!keys) return

  keys.forEach(function (key) {
    const value = object[key]
    if (typeof value === 'string') {
      const number = parseInt(value) - 0
      object[key] = isNaN(number) ? value : number
    } else if (isObject(value) || Array.isArray(value)) {
      walkObjectAndDropQuotesOnNumbers(value)
    }
  })
}

function isObject (o: any): boolean {
  return o && typeof o === 'object'
}

/** When the length of the array does not exceed the specified width collapse the array, that is, into a line, characters (including indentation) */
function inlineShortArraysInResult (result: string, width?: number): string {
  width || (width = 80)
  if (typeof width !== 'number' || width < 20) {
    throw Error("Invalid width '" + width + "'. Expecting number equal or larger than 20.")
  }
  const list = result.split('\n')
  let i = 0
  let start = null
  let content: string[] = []
  while (i < list.length) {
    const startMatch = !!list[i].match(/\[/)
    const endMatch = !!list[i].match(/\],?/)

    if (startMatch && !endMatch) {
      content = [list[i]]
      start = i
    } else if (endMatch && !startMatch && start) {
      content.push((list[i] || '').trim())
      const inline = content.join(' ')
      if (inline.length < width) {
        list.splice(start, i - start + 1, inline)
        i = start
      }
      start = null
      content = []
    } else {
      if (start) content.push((list[i] || '').trim())
    }
    i += 1
  }
  return list.join('\n')
}

/**
 * The stringify method accepts a value and an optional replacer, and an optional
 * space parameter, and returns a JSON text. The supplanter can be a function
 * can replace the value, or will select an array of strings for the key.
 * Default substitution methods can be provided. The use of spatial parameters can
 * Generate more readable text.
 */
function stringify (
  value: any,
  replacer?: ((key: string, value: any) => any) | (string | number)[],
  space?: string | number,
  dropQuotesOnKeys?: boolean,
  quoteType?: 'single' | 'double'
): string {
  let i: number
  gap = ''
  indent = ''

  // If the space parameter is a number, create an indent string with that number of spaces.
  if (typeof space === 'number') {
    for (i = 0; i < space; i += 1) {
      indent += ' '
    }
  // If the space parameter is a string, use it as the indent string.
  } else if (typeof space === 'string') {
    indent = space
  }

  // If a replacer is provided, it must be a function or an array; otherwise, throw an error.
  rep = replacer
  if (
    replacer &&
    typeof replacer !== 'function' &&
    (typeof replacer !== 'object' || typeof replacer.length !== 'number')
  ) {
    throw new Error('JSON.stringify')
  }

  // Return the result of stringIfyIng the value, creating a fake root object under the key ''.
  return str('', { '': value }, dropQuotesOnKeys ?? false, quoteType ?? 'double')
}

function str (
  key: string,
  holder: any,
  dropQuotesOnKeys: boolean,
  quoteType: 'single' | 'double'
): string {
  // Cycle counter
  let i: number
  // Member Key
  let k: string
  let v: string
  let length: number
  const mind = gap
  let partial: string[]
  // Generate a string from holder[key]
  let value: any = holder[key]

  // If the value has a toJson method, call it to get the replacement value
  if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }

  // Get the substitution value, if we are called by the substitution function, then call the substitution function
  if (typeof rep === 'function') {
    value = rep.call(holder, key, value)
  }

  // What happens next depends on the type of value
  switch (typeof value) {
    case 'string':
      return quote(value, quoteType)

    case 'number':
      // JSON numbers must be finite, and non-finite numbers are encoded as null
      return isFinite(value) ? String(value) : 'undefined'

    // If the type is object, we may be dealing with an object or an array
    case 'object':

      // Due to a specification error in ECMAScript, typeof null is 'object', so be aware of this case
      if (!value) return 'null'

      // Make an array to hold some of the results of stringing the value of this object
      gap += indent
      partial = []

      // The value is an array, stringing each element for non-JSON values, using null as a placeholder
      if (Object.prototype.toString.apply(value) === '[object Array]') {
        length = value.length
        for (i = 0; i < length; i += 1) {
          partial[i] = str(String(i), value, dropQuotesOnKeys, quoteType)
        }

        // Link all elements together, separated by commas, and wrap them in curly brackets
        v = partial.length === 0
          ? '[]'
          : gap
            ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
            : '[' + partial.join(',') + ']'
        gap = mind
        return v
      }

      // If the replacer is an array, use it to select the members to be stringIfIed
      if (rep && typeof rep === 'object') {
        length = rep.length
        for (i = 0; i < length; i += 1) {
          if (typeof rep[i] === 'string') {
            k = rep[i]
            v = str(k, value, dropQuotesOnKeys, quoteType)
            partial.push((dropQuotesOnKeys ? condQuoteKey(k, quoteType) : quote(k, quoteType)) + (gap ? ': ' : ':') + v)
          }
        }
      } else {
        // Otherwise, iterate through all the keys in the object
        for (k in value) {
          if (Object.prototype.hasOwnProperty.call(value, k)) {
            v = str(k, value, dropQuotesOnKeys, quoteType)
            partial.push((dropQuotesOnKeys ? condQuoteKey(k, quoteType) : quote(k, quoteType)) + (gap ? ': ' : ':') + v)
          }
        }
      }

      // Link all member texts together, separated by commas, and wrap them in curly brackets
      v = partial.length === 0
        ? '{}'
        : gap
          ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
          : '{' + partial.join(',') + '}'
      gap = mind
      return v

    default:
      return String(value)
  }
}

function quote (string: string, quoteType: 'single' | 'double'): string {
  // If the string doesn't contain control characters, quote characters,
  // and backslash characters, we can safely surround it with quotes
  // Otherwise, we need to replace problematic characters with safe escapes

  // Specify the starting position for the next search in the target string
  escapable.lastIndex = 0

  let surroundingQuote = '"'
  if (quoteType === 'single') {
    surroundingQuote = "'"
  }

  // Escape problematic characters, matching the specified character replacement table.
  // If the character replacement is not found, generate the corresponding Unicode code point.
  return escapable.test(string)
    ? surroundingQuote +
      string.replace(escapable, (a) => {
        const c = meta[a]
        return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
      }) +
      surroundingQuote
    : surroundingQuote + string + surroundingQuote
}

function condQuoteKey (string: string, quoteType: 'single' | 'double'): string {
  return keyable.test(string) ? string : quote(string, quoteType)
}
