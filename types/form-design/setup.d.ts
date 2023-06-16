import { SizeType } from '../component'
import { js_beautify } from 'js-beautify'

export interface DolphinFormDesignSetupOptions {
  axiosInstance?: () => any,
  qiniu?: {
    up: string,
    bucket: string,
    ak: string,
    sk: string,
    deadline: number
  },
  eventsDic?: {
    change: string,
    focus: string,
    blur: string,
    uploadSuccess: string,
    uploadError: string,
    uploadRemove: string,
    'row-add': string,
    'row-del': string
  }
  formExecuteCallbackHooks?: string[],
  jsonOptionDefaultConfig?: {
    space: number,
    dropQuotesOnKeys: boolean,
    dropQuotesOnNumbers: boolean,
    inlineShortArrays: boolean,
    inlineShortArraysDepth: number,
    quoteType: string,
    minify: boolean,
  },
  formDefaultConfig?: {
    enter: boolean,
    size: SizeType,
    labelWidth: number,
    labelPosition: string,
    styleSheets: string,
    column: { [key:string]: any }[],
    customClass: string[],
    eventScript: {
      key: string,
      name: string,
      func: string,
    }[],
    dataSource: {
      key: string,
      name: string,
      url: string,
      method: string,
      auto: boolean,
      thirdPartyAxios: boolean,
      headers: { [key:string]: any },
      params: { [key:string]: any },
      requestFunc: string,
      responseFunc: string,
      errorFunc: string
    }[]
  },
  beautifierDefaultsConf?: js_beautify,
  defaultRemoteFunc?: {
    funcDefault(): {
      value: any
      label: any
    }[],
    funcGetToken(): string
  },
  [key: string]: any
}

export interface WidgetFormDefaultConfig {
  enter: boolean,
  size: SizeType,
  labelWidth: number,
  labelPosition: string,
  styleSheets: string,
  column: { [key:string]: any }[],
  customClass: string[],
  eventScript: {
    key: string,
    name: string,
    func: string,
  }[],
  dataSource: DataSource[]
}

export interface DataSource {
  key: string,
  name: string,
  url: string,
  method: string,
  auto: boolean,
  thirdPartyAxios: boolean,
  headers: { [key:string]: any },
  params: { [key:string]: any },
  requestFunc: string,
  responseFunc: string,
  errorFunc: string
}

export interface JsonOptionDefaultConfig {
  space: number,
  dropQuotesOnKeys: boolean,
  dropQuotesOnNumbers: boolean,
  inlineShortArrays: boolean,
  inlineShortArraysDepth: number,
  quoteType: string,
  minify: boolean,
}

export interface DolphinFormDesignGlobalConfig extends DolphinFormDesignSetupOptions {
  axiosInstance: () => any,
  qiniu: {
    up: string,
    bucket: string,
    ak: string,
    sk: string,
    deadline: number
  },
  eventsDic: {
    change: string,
    focus: string,
    blur: string,
    uploadSuccess: string,
    uploadError: string,
    uploadRemove: string,
    'row-add': string,
    'row-del': string
  }
  formExecuteCallbackHooks: string[],
  jsonOptionDefaultConfig: JsonOptionDefaultConfig,
  widgetFormDefaultConfig: WidgetFormDefaultConfig,
  beautifierDefaultsConf: js_beautify,
  defaultRemoteFunc: {
    funcDefault(): {
      value: any
      label: any
    }[],
    funcGetToken(): string
  },
  [key: string]: any
}

export type DolphinFieldsGroupProps = {
  title: string,
  list: DolphinFieldsProps[]
}

export interface DolphinFieldsProps {
  type: string,
  label: string,
  icon: string,
  labelWidth: string,
  hide: boolean,
  remote?: boolean,
  dicData?: { value: any,label: any }[],
  remoteType?: string,
  remoteOption?: string,
  remoteFunc?: string,
  remoteDataSource?: string,
  hideLabel: boolean,
  customClass: string[],
  validateConfig: { [key: string]: any },
  events: {
    change: string,
    focus: string,
    blur: string,
    [key: string]: any
  },
  plugin: { [key: string]: any }
}

export type DolphinFormDesignGlobalSetup = (options?: DolphinFormDesignSetupOptions) => DolphinFormDesignGlobalConfig
