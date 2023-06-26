import { DolphinFormDesignGlobalConfig, WidgetFormDefaultConfig } from '../../../../types/form-design/setup'
import fields from '../components/fields'
import getToken from '../../../tools/qiniuOss'

export const GlobalConfig: DolphinFormDesignGlobalConfig = {
  axiosInstance: null,
  fields,
  qiniu: {
    up: 'https://upload.qiniup.com',
    bucket: 'loquat',
    ak: 'z1KE2yt6JzO9zVxqPsnVo5m9AeI-dDTpia_qTb6X',
    sk: 'outhjqeI2PiHZnKsQTZD5DGP3GLzEUf1-w5C0ak6',
    deadline: 1
  },
  eventsDic: {
    change: 'Change',
    focus: 'Focus',
    blur: 'Blur',
    uploadSuccess: 'UploadSuccess',
    uploadError: 'UploadError',
    uploadRemove: 'UploadRemove',
    'row-add': 'RowAdd',
    'row-del': 'RowDel'
  },
  formExecuteCallbackHooks: ['Mounted'],
  jsonOptionDefaultConfig: {
    space: 2,
    dropQuotesOnKeys: false,
    dropQuotesOnNumbers: false,
    inlineShortArrays: false,
    inlineShortArraysDepth: 1,
    quoteType: 'double',
    minify: false
  },
  widgetFormDefaultConfig: {
    enter: true,
    size: 'small',
    labelWidth: 90,
    labelPosition: 'right',
    styleSheets: '',
    column: [],
    customClass: [],
    eventScript: [
      {
        key: 'mounted',
        name: 'mounted',
        func: ''
      }
    ],
    dataSource: [
      {
        key: 'upload',
        name: 'Get Upload Token',
        url: 'http://tools-server.making.link/api/uptoken',
        method: 'GET',
        auto: true,
        thirdPartyAxios: false,
        headers: {},
        params: {},
        requestFunc: 'return widget-config;',
        responseFunc: 'return res.uptoken;',
        errorFunc: ''
      },
      {
        key: 'options',
        name: 'Get Options',
        url: 'http://tools-server.making.link/api/new/options',
        method: 'GET',
        auto: true,
        thirdPartyAxios: false,
        headers: {},
        params: {},
        requestFunc: 'return widget-config;',
        responseFunc: 'return res.data;',
        errorFunc: ''
      }
    ]
  },
  /** More config ref :https://github.com/beautify-web/js-beautify */
  beautifierDefaultsConf: {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 0,
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: 110,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  },
  defaultRemoteOption: {
    optionDefault: [
      { value: 'Foobar1', label: 'Foobar1' },
      { value: 'Foobar2', label: 'Foobar2' },
      { value: 'Foobar3', label: 'Foobar3' }
    ]
  },
  defaultRemoteFunc: {
    funcDefault (): { value: any; label: any; }[] {
      return [
        { value: 'Foobar1', label: 'Foobar1' },
        { value: 'Foobar2', label: 'Foobar2' },
        { value: 'Foobar3', label: 'Foobar3' }
      ]
    },
    funcGetToken (): string {
      const oss = GlobalConfig.qiniu
      return getToken(oss.ak, oss.sk, {
        scope: oss.bucket,
        deadline: new Date().getTime() + (oss.deadline || 1) * 3600
      })
    }
  }
}

export default GlobalConfig
