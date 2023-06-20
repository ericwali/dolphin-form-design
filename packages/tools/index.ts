import { LATIN_BURRING_MAPPING, KEY_WIDGET_CONFIG_NAME, KEY_COMPONENT_NAME } from '../form-design/src/constants'
import { RE_PROP_NAME, RE_LATIN, RE_COMBO_RANGE, RE_APOS, RE_HAS_UNICODE_WORD, RE_UNICODE_WORD, RE_ASCII_WORD } from '../form-design/src/constants/regex'
import random from './random'
import type { DolphinFieldsGroupProps, WidgetFormDefaultConfig, JsonOptionDefaultConfig, DataSource } from '../../types/form-design/setup'
import GlobalConfig from '../form-design/src/constants/conf'

/**
 * Set px pixels
 * @param val set px value
 * @return string
 */
export function setPx (val: number | string, defVal = ''): string {
  if (validateNull(val)) val = defVal
  if (validateNull(val)) return ''
  val = val + ''
  if (val.indexOf('%') === -1) {
    val = val + 'px'
  }
  return val
}

/**
 * Deep copy of objects
 * @param obj Clone object
 * @return T new Object
 */
export function deepClone<T>(obj: T): T {
  const type = getObjType(obj);
  if (type === 'array') {
    const newObj: any[] = [];
    for (let i = 0, len = (obj as unknown as any[]).length; i < len; i++) {
      if ((obj as unknown as any[])[i]) {
        delete (obj as unknown as any[])[i].$parent;
      }
      newObj.push(deepClone((obj as unknown as any[])[i]));
    }
    return newObj as unknown as T;
  } else if (type === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        delete (obj as any)[key].$parent;
      }
      newObj[key] = deepClone((obj as any)[key]);
    }
    return newObj;
  } else {
    // No longer has the next level
    return obj;
  }
}

/**
 * Get object type
 * @param obj object
 * @return string type strings
 */
export function getObjType(obj: any): string {
  const toString = Object.prototype.toString
  const map: { [key: string]: string } = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
    '[object Promise]': 'promise'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

/**
 * Determine if the value is null
 * @param val value
 * @return boolean
 */
export function validateNull(val: any): boolean {
  // Special validate
  if (val && parseInt(val) === 0) return false;
  const list: string[] = ['$parent'];
  if (val instanceof Date || typeof val === 'boolean' || typeof val === 'number') {
    return false;
  }
  if (val instanceof Array) {
    if (val.length === 0) {
      return true;
    }
  } else if (val instanceof Object) {
    val = deepClone(val);
    list.forEach(ele => {
      delete val[ele];
    });
    for (const o in val) {
      return false;
    }
    return true;
  } else {
    if (
      val === 'null' ||
      val == null ||
      val === 'undefined' ||
      val === undefined ||
      val === ''
    ) {
      return true;
    }
    return false;
  }
  return false;
}

/**
 * Parameter path formatting
 * @param val a[0].b.c
 * @return string[] (a,0,b,c)
 */
export function pathFormat(val: string): string[] {
  const result: string[] = [];
  if (val.charCodeAt(0) === 46) {
    result.push('');
  }
  val.replace(RE_PROP_NAME,  (match: string, number: string, quote: string, subString: string) => {
    result.push(quote ? subString.replace(/\\(\\)?/g, '$1') : (number || match));
    return '';
  });
  return result;
}

/**
 * Get object value
 * @param object
 * @param path a[0].b.c
 * @param defaultValue
 * @return any
 */
export function get(object: any, path: string, defaultValue: any): any {
  if (validateNull(path)) return object;
  const pathArray = /^\w*$/.test(path) ? [path] : pathFormat(path);
  let index = 0;
  const length = pathArray.length;
  while (object != null && index < length) {
    object = object[pathArray[index++]];
  }
  return object == null ? defaultValue : object;
}


/** Generate a random 8-bit ID */
export function randomId8(): string {
  return random(8)
}

/**
 * Data type formatting
 * @param value data
 * @param value format type
 * @return T
 */
export function dataTypeFormat<T = any>(value: any, type: string): T {
  if (type === 'number') {
    return Number(value) as unknown as T;
  } else if (type === 'string') {
    return String(value) as unknown as T;
  } else {
    return value as T;
  }
}

/**
 * Converting base64 addresses to files
 * @param dataUrl Base64
 * @param filename FileName
 * @return File | null
 */
export function dataURLtoFile(dataUrl: string, filename: string): File | null {
  const arr = dataUrl.split(',');
  // Get the MIME type from the data URL
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    return null;
  }
  const mime = mimeMatch[1];
  // Decode the Base64 data
  const buffStr = atob(arr[1]);
  let n = buffStr.length;
  // Convert binary data to UTF-8
  const utf8Arr = new Uint8Array(n);
  while (n--) {
    utf8Arr[n] = buffStr.charCodeAt(n);
  }
  return new File([utf8Arr], filename, {
    type: mime,
  });
}


/**
 * Get file upload address
 * @param home The root address.
 * @param uri The sub-address.
 * @returns The concatenated URL or an empty string.
 */
export function getFileUrl(home: string, uri: string): string {
  return uri.match(/(^http:\/\/|^https:\/\/|^\/\/|data:image\/)/) ? uri : urlJoin(home, uri);
}

/**
 * Compute byte capacity based on the specified unit.
 * @param fileSize The file size in bytes.
 * @param unit The unit of measurement (KB, MB, GB).
 * @returns The computed byte capacity.
 */
export function byteCapacityCompute(fileSize: number, unit: 'KB' | 'MB' | 'GB'): number {
  switch (unit) {
    case 'KB':
      return fileSize / 1024;
    case 'MB':
      return fileSize / 1024 / 1024;
    case 'GB':
      return fileSize / 1024 / 1024 / 1024;
  }
}

/**
 * Handle url path splicing with or without slash automatically
 * @param base BaseUrl
 * @param url  SubUrl
 * @return string BaseUrlAndSubUrl
 */
export function urlJoin(base: string, url: string): string {
  return `${base.replace(/([\w\W]+)\/$/, '$1')}/${url.replace(/^\/([\w\W]+)$/, '$1')}`
}

/** 获取部件表单默认配置 */
export function getWidgetFormDefaultConfig (): WidgetFormDefaultConfig {
  return deepClone(GlobalConfig.widgetFormDefaultConfig)
}

/** 获取json选项默认配置 */
export function getJsonOptionDefaultConfig (): JsonOptionDefaultConfig {
  return deepClone(GlobalConfig.jsonOptionDefaultConfig)
}

/** 驼峰转下划线 */
export function kebabCase (str) {
  return createCompounder(str, (result, word, index) =>
    result + (index ? '-' : '') + word.toLowerCase())
}

/** 下划线转驼峰 */
export function camelCase (str) {
  return createCompounder(str, (result, word, index) => {
    word = word.toLowerCase()
    return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word)
  })
}

/**
 * 创建字符串单词复合器
 * 字符串先按特定字符串的写法分割
 * 根据组合每个单词的函数进行复合
 *
 * @private
 * @param {string} [string=''] 要检查的字符串.
 * @param {Function} callback 组合每个单词的函数。
 * @returns {Function} 返回新的复合函数。
 * @example
 *
 * (wang xiang)
 * // => ['wang','xiang']
 *
 * ('wangXiang')
 * // => ['wang','Xiang']
 *
 * ('__WANG_XIANG__')
 * // => ['WANG','XIANG']
 */
function createCompounder (string, callback) {
  return arrayReduce(words(deburr(string).replace(RE_APOS, '')), callback, '')
}

/**
 * 数组累加器
 * 使用迭代函数进行迭代累加处理
 * @private
 * @param {Array} [array] 要迭代的数组.
 * @param {Function} iteratee 每次迭代调用的函数.
 * @param {*} [accumulator] 初始值.
 * @param {boolean} [initAccum] 指定使用 `array` 的第一个元素作为初始值.
 * @returns {*} 返回累计值.
 */
function arrayReduce (array, iteratee, accumulator, initAccum) {
  let index = -1
  const length = array == null ? 0 : array.length

  if (initAccum && length) {
    accumulator = array[++index]
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array)
  }
  return accumulator
}

/**
 * 去除字符串中的一些毛刺
 * 带发音符号的拉丁字母,组合变音符号
 *
 * 替换说明:替换那些带发音符号的拉丁字母(á->a)
 * Latin-1补充块: https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table
 * 拉丁语扩展A块.: https://en.wikipedia.org/wiki/Latin_Extended-A
 * 删除说明:删除变音符号
 * 结合变音符号: https://en.wikipedia.org/wiki/Combining_Diacritical_Marks
 * @public
 * @param {string} [string='']  要去毛刺的字符串.
 * @returns {string} 返回去毛刺的字符串.
 * @example
 *
 * deburr('wángxiáng');
 * // => 'wangxiang'
 */
export function deburr (string) {
  string = String(string)
  return string && string.replace(RE_LATIN, (match) => BASIC_LATIN_MAPPING[match]).replace(RE_COMBO_RANGE, '')
}

/**
 * 将字符串拆分为其单词的数组
 *
 * @public
 * @param {string} [string=''] 要检查的字符串.
 * @param {RegExp|string} [pattern] 匹配单词的模式.
 * @returns {Array} 返回 `string` 的单词.
 * @example
 *
 * 分割规则:可以使用(数学运算符,除了字母数字外的符号,常用标点符号,空白,驼峰命名写法,表情符号)分割
 * 具体实现请参考: RE_UNICODE_WORD正则表达式
 * 具体正则分割逻辑:
 * (?=' + [RS_BREAK, RS_UPPER, '$'].join('|')
 * (?=' + [RS_BREAK, RS_UPPER + RS_MISC_LOWER, '$'].join('|')
 *
 * words('wangXiang')
 * // => ['wang', 'Xiang']
 *
 * words('wang&,&xiang')
 * // => ['wang', 'xiang']
 *
 * words('wang&,&xiang', /[^, ]+/g)
 * // => ["'wang&", '&xiang']
 */
export function words (string, pattern) {
  string = String(string)
  if (pattern === undefined) {
    return RE_HAS_UNICODE_WORD.test(string)
      ? string.match(RE_UNICODE_WORD) || []
      : string.match(RE_ASCII_WORD) || []
  }
  return string.match(pattern) || []
}

/** 源组件名称 */
export function originComponentName (name, type = 'config') {
  const str = camelCase(name.replace(type === 'plugin' ? KEY_COMPONENT_NAME : KEY_COMPONENT_CONFIG_NAME, ''))
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** 对象迭代器  */
export function objectEach (obj, iterate, context) {
  if (obj) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        iterate.call(context, obj[key], key, obj)
      }
    }
  }
}

/** 处理递归合并 */
function handleDeepMerge (target, source) {
  const targetType = getObjType(target)
  const sourceType = getObjType(source)
  const toString = Object.prototype.toString
  if (targetType === 'array' && sourceType === 'array') {
    for (let i = 0, len = source.length; i < len; ++i) {
      // 确保源数据类型完全一致性时才能合并
      if (target[i] != null && toString.call(source[i]) !== toString.call(target[i])) continue
      target[i] = handleDeepMerge(target[i], source[i])
    }
    return target
  } else if (targetType === 'object' && sourceType === 'object') {
    for (const key in source) {
      // 确保源数据类型完全一致性时才能合并
      if (target[key] != null && toString.call(source[key]) !== toString.call(target[key])) continue
      target[key] = handleDeepMerge(target[key], source[key])
    }
    return target
  }
  return source
}

/** 将一个或多个源对象合并到目标对象中(递归合并) */
export function merge (target = {}, ...sources) {
  for (let index = 0; index < sources.length; ++index) {
    const source = sources[index]
    source && handleDeepMerge(target, source)
  }
  return target
}

/** 将一个或多个源对象复制到目标对象中 */
export function assign (target = {}, ...sources) {
  const toString = Object.prototype.toString
  for (let index = 0; index < sources.length; ++index) {
    const source = sources[index]
    if (source) {
      const keys = Object.keys(source)
      for (let index = 0, len = keys.length; index < len; ++index) {
        const key = keys[index]
        // 确保源数据类型完全一致性时才能合并
        if (target[key] != null && toString.call(source[key]) !== toString.call(target[key])) continue
        target[key] = deepClone(source[key])
      }
    }
  }
  return target
}

/** 判断是否外部svg地址 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
