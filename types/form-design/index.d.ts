import type { DolphinFieldsGroupProps, WidgetFormDefaultConfig, JsonOptionDefaultConfig, DataSource } from 'setup'

export interface FormDesignReactData {
  formId: string
  adapter: 'pc' | 'pad' | 'mobile'
  fields: DolphinFieldsGroupProps[]
  formCallbackHooks: string[]
  widgetForm: WidgetFormDefaultConfig
  configTab: string
  widgetFormSelect: { [key:string]: any }
  widgetFormDraggable: { [key:string]: any }
  widgetFormPreview: { [key:string]: any }
  previewVisible: boolean
  importJsonVisible: boolean
  generateJsonVisible: boolean
  styleSheetsVisible: boolean
  actionSettingsVisible: boolean
  widgetModels: { [key:string]: any }
  importJson: string
  generateJson: string
  history: {
    index: number
    maxStep: number
    steps: { [key:string]: any }[ ]
  }
  jsonOption: JsonOptionDefaultConfig
  styleSheetsArray: string[]
  actionForm: {
    key?: string
    name?: string
    func?: string
  }
  actionMenuActive: string
  actionMenuItemDisabled: boolean
  actionMainContainerVisible: boolean
  eventSelect: string
  dataSourceSettingsVisible: boolean
  dataSourceMenuActive: string
  dataSourceForm: DataSource
  dataSourceMenuItemDisabled: boolean
  dataSourceMainContainerVisible: boolean
  styleSheets: string
  previewDisableSwitch: boolean
  cascadeOptionVisible: boolean
  cascadeOption: string
  childFormModelVisible: boolean
}

export interface CustomFieldsProps {
  title: string
  list: {
    title: string
    type: string
    component: string
    icon: string
    label: string
    propExclude: boolean
    labelWidth: number
    params?: string
    events?: string
  }[]
}
