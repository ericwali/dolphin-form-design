import { LATIN_DIACRITICAL_MAPPING, WIDGET_COMPONENT_NAME_PREFIX, COMPONENT_NAME_PREFIX } from '../form-design/src/constants'
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
    const originObj = obj as unknown as any[]
    for (let i = 0, len = originObj.length; i < len; i++) {
      if (originObj[i]) {
        delete originObj[i].$parent;
      }
      newObj.push(deepClone(originObj[i]));
    }
    return newObj as unknown as T;
  } else if (type === 'object') {
    const newObj: any = {};
    const originObj = obj as unknown as any
    for (const key in originObj) {
      if (originObj.hasOwnProperty(key)) {
        delete originObj[key].$parent;
      }
      newObj[key] = deepClone(originObj[key]);
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

/**
 * Converts a camelCase string to kebab-case.
 * @param {string} str - The input string.
 * @returns {string} - The kebab-case string.
 */
export function kebabCase(str: string): string {
  return createCompounder(str, (result: string, word: string, index: number) =>
    result + (index ? '-' : '') + word.toLowerCase());
}

/**
 * Converts a snake_case string to camelCase.
 * @param {string} str - The input string.
 * @returns {string} - The camelCase string.
 */
export function camelCase(str: string): string {
  return createCompounder(str, (result: string, word: string, index: number) => {
    word = word.toLowerCase();
    return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
  });
}


/**
 * Creates a string compounder by splitting
 * the string based on a specific delimiter
 * and applying a callback function to combine each word
 *
 * @param str The string to be processed
 * @param callback The function to combine each word
 * @returns string String after Compounder
 */
function createCompounder(str: string = '',
                          callback: (accumulator: string, value: string, index: number, array: string[]) => string
): string {
  return arrayReduce(words(deburr(str).replace(RE_APOS, '')), callback, '')
}

/**
 * Array accumulator.
 * Performs iterative accumulation using the provided iteratee function.
 * @param array The array to iterate over.
 * @param iteratee The function called on each iteration.
 * @param accumulator The initial value.
 * @param initAccum Specify whether to use the first element of `array` as the initial value.
 * @returns T The accumulated value.
 */
export function arrayReduce<T>(
  array: T[],
  iteratee: (accumulator: T, value: T, index: number, array: T[]) => T,
  accumulator: T,
  initAccum?: boolean
): T {
  let index = -1;
  const length = array == null ? 0 : array.length;
  if (initAccum && length) {
      accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array)
  }
  return accumulator
}

/**
 * Removes diacritical marks from a string
 *
 * Diacritical marks include accent marks and combining diacritical marks
 * Replacement: Replace Latin characters with diacritical marks (á->a)
 * Latin-1 Supplement Block: https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table
 * Latin Extended-A Block: https://en.wikipedia.org/wiki/Latin_Extended-A
 * Remove combining diacritical marks
 * [Combining Diacritical Marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks)
 *
 * @param str The string to remove diacritical marks from
 * @returns string The string without diacritical marks
 * @example
 *
 * deburr('wángxiáng4');
 * => 'wangxiang4'
 */
export function deburr(str: string): string {
  return str && str.replace(RE_LATIN, (match) => LATIN_DIACRITICAL_MAPPING[match]).replace(RE_COMBO_RANGE, '')
}

/**
 * Splits a string into an array of its words
 * @param str The string to check
 * @param pattern The pattern to match words
 * @returns string[] The array of words from the string
 * @example
 *
 * Splitting rules: The string can be split using mathematical operators, symbols other
 * than alphanumeric characters, common punctuation marks, whitespace, camelCase notation
 * and emoticons.
 *
 * words('fooBar')
 * => ['foo', 'bar']
 *
 * words('foo,bar')
 * => ['foo', 'bar']
 *
 * words('foo&,&bar', /[^, ]+/g)
 * => ["'foo&", '&bar']
 */
export function words(str: string, pattern?: RegExp | string): string[] {
  if (pattern === undefined) {
    return RE_HAS_UNICODE_WORD.test(str)
      ? str.match(RE_UNICODE_WORD) || []
      : str.match(RE_ASCII_WORD) || []
  }
  return str.match(pattern) || []
}

/**
 * Get the component name from a modified name
 *
 * @param name The Splice name
 * @param type The type of the component
 * @returns string The component name
 */
export function componentName(name: string, type: string = 'widget'): string {
  const str = camelCase(name.replace(type === 'component' ? COMPONENT_NAME_PREFIX : WIDGET_COMPONENT_NAME_PREFIX, ''))
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Iterate over the properties of an object.
 *
 * @param obj The object to iterate over.
 * @param iterate The iterate function called for each property.
 * @param void The context to use for the iterate function.
 */
export function objectEach(obj: Record<string, any>, iterate: Function, context?: any): void {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      iterate.call(context, obj[key], key, obj);
    }
  }
}

/** 处理递归合并 */
function handleDeepMerge (target: any, source: any): any {
  const targetType = getObjType(target)
  const sourceType = getObjType(source)
  const toString = Object.prototype.toString
  if (targetType === 'array' && sourceType === 'array') {
    for (let i = 0, len = source.length; i < len; ++i) {
      // Ensures that the source data type matches exactly before merging
      if (target[i] != null && toString.call(source[i]) !== toString.call(target[i])) continue
      target[i] = handleDeepMerge(target[i], source[i])
    }
    return target
  } else if (targetType === 'object' && sourceType === 'object') {
    for (const key in source) {
      // Ensures that the source data type matches exactly before merging
      if (target[key] != null && toString.call(source[key]) !== toString.call(target[key])) continue
      target[key] = handleDeepMerge(target[key], source[key])
    }
    return target
  }
  return source
}

/**
 * Merges multiple objects recursively.
 *
 * @param target - The target object to merge into.
 * @param sources - The source objects to merge.
 * @returns object - The merged object.
 */
export function merge(target: object = {}, ...sources: object[]): object {
  for (let index = 0; index < sources.length; ++index) {
    const source = sources[index];
    source && handleDeepMerge(target, source);
  }
  return target;
}

/**
 * Copies one or more source objects into a target object.
 *
 * @param target - The target object to copy into.
 * @param sources - The source objects to copy.
 * @returns object - The copied object.
 */
export function assign(target: Record<string, any> = {}, ...sources: Record<string, any>[]): object {
  const toString = Object.prototype.toString;
  for (let index = 0; index < sources.length; ++index) {
    const source = sources[index];
    const keys = Object.keys(source);
    for (let index = 0, len = keys.length; index < len; ++index) {
      const key = keys[index];
      // Ensure that the source data type is identical for merging
      if (target[key] != null && toString.call(source[key]) !== toString.call(target[key])) continue;
      target[key] = deepClone(source[key]);
    }
  }
  return target;
}

/**
 * Checks if the path is an external SVG address.
 *
 * @param {string} path - The path to check.
 * @returns {boolean} - `true` if the path is an external SVG address, `false` otherwise.
 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path);
}

