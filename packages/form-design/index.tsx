import { defineComponent, computed, unref, reactive } from 'vue';
import { FormDesignReactData } from '../../types/form-design'
import GlobalConfig from '../global/config'
import { getWidgetFormDefaultConfig, getJsonOptionDefaultConfig } from '../tools'
import codeBeautifier from 'js-beautify';

export default defineComponent({
  name: 'FormDesign',
  props: {
    options: {
      type: [Object, String],
      default: () => {
        return {
          column: []
        }
      }
    },
    storage: {
      type: Boolean,
      default: false
    },
    asideLeftWidth: {
      type: [String, Number],
      default: '250px'
    },
    asideRightWidth: {
      type: [String, Number],
      default: '300px'
    },
    toolbar: {
      type: Array,
      default: () => {
        return ['import', 'clear', 'preview', 'generate']
      }
    },
    undoRedo: {
      type: Boolean,
      default: true
    },
    includeFields: {
      type: Array,
      default: () => {
       /* const arr = []
        GlobalConfig.fields.forEach(f => {
          f.list.forEach(c => {
            arr.push(c.type)
          })
        })
        return arr*/
      }
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  emits: [],
  setup(props, context) {

    const state = reactive<FormDesignReactData>({
      formId: '',
      adapter: 'pc',
      fields: GlobalConfig.fields,
      formCallbackHooks: GlobalConfig.formExecuteCallbackHooks,
      widgetForm: getWidgetFormDefaultConfig(),
      configTab: 'widget',
      widgetFormSelect: {},
      widgetFormDraggable: {},
      widgetFormPreview: {},
      previewVisible: false,
      importJsonVisible: false,
      generateJsonVisible: false,
      styleSheetsVisible: false,
      actionSettingsVisible: false,
      widgetModels: {},
      importJson: '',
      generateJson: '',
      history: {
        index: 0,
        maxStep: 20,
        steps: []
      },
      jsonOption: getJsonOptionDefaultConfig(),
      styleSheetsArray: [],
      actionForm: {},
      actionMenuActive: '',
      actionMenuItemDisabled: false,
      actionMainContainerVisible: false,
      eventSelect: '',
      dataSourceSettingsVisible: false,
      dataSourceMenuActive: '',
      dataSourceForm: {},
      dataSourceMenuItemDisabled: false,
      dataSourceMainContainerVisible: false,
      styleSheets: '',
      previewDisableSwitch: false,
      cascadeOptionVisible: false,
      cascadeOption: '',
      childFormModelVisible: false
    })

    const plugin = computed(() => state.widgetFormSelect.plugin)

    const leftWidth = computed(() => {
      if (typeof props.asideLeftWidth === 'string') {
        return props.asideLeftWidth
      } else return `${props.asideLeftWidth}px`
    })

    const rightWidth = computed(() => {
      if (typeof props.asideRightWidth === 'string') {
        return props.asideRightWidth
      } else return `${props.asideRightWidth}px`
    })

    const getCustomFields = computed(() => {
      const customFields = deepClone(this.customFields)
      // 处理第三方传入的自定义属性与自定义事件代码美化
      customFields.forEach(item => {
        getObjType(item.list) === 'array' && item.list.forEach(field => {
          !validateNull(field.params)
            ? field.params = codeBeautifier.js(beautifier(field.params), GlobalConfig.beautifierDefaultsConf) : ''
          !validateNull(field.events)
            ? field.events = codeBeautifier.js(beautifier(field.events), GlobalConfig.beautifierDefaultsConf) : ''
        })
      })
      return customFields
    })

    const renderVN = () => (
      <el-container className={['form-designer', state.formId]}>
        <el-main className="widget-form-main">
          <el-container>
            {/*{renderAsideLayout()}*/}
          </el-container>
        </el-main>
      </el-container>
    )

    return renderVN
  }

})
