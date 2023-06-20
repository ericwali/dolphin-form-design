/**
 * @program: loquat-form-design
 *
 * @description: 对外提供全局配置
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-11-25
 */

import GlobalConfig from '@/global/widget-config'
import { assign } from '@tools'

/**
 * 全局参数设置
 */
export const setup = (options) => {
  return assign(GlobalConfig, options)
}
