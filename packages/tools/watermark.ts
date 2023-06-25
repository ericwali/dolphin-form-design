import { dataURLtoFile, randomId8 } from '../tools'

export interface WaterMarkOption {
  text?: string;
  font?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  textAlign?: 'center' | 'end' | 'left' | 'right' | 'start';
  textStyle?: string;
  degree?: number;
}

/**
 * Large global watermark
 * @param text    Watermark text, default 'BusinessDolphinFormDesign'
 * @param font    Watermark font, default '30px bold'
 * @param canvasWidth    Single watermark container width, default 500
 * @param canvasHeight    Single watermark container height, default 200
 * @param textAlign    Watermark text alignment, default 'center'
 * @param textStyle    Watermark text style, default 'rgba(100,100,100,0.15)'
 * @param degree    Watermark text rotation angle, default -20
 */
export class waterMark {

  private readonly containerId: string;
  private isObserver: boolean;
  private option: WaterMarkOption = {};
  private styleStr: string = '';

  constructor(opt:WaterMarkOption) {
    this.containerId = randomId8()
    this.drawCanvas = this.drawCanvas.bind(this)
    this.parentObserver = this.parentObserver.bind(this)
    this.repaint = this.repaint.bind(this)
    this.isObserver = false
    this.init(opt)
    this.drawCanvas()
    this.parentObserver()
  }

  init(opt: WaterMarkOption) {
    this.option.text = opt.text || 'BusinessDolphinFormDesign'
    this.option.font = opt.font || '30px 黑体'
    this.option.canvasWidth = opt.canvasWidth || 500
    this.option.canvasHeight = opt.canvasHeight || 200
    this.option.textAlign = opt.textAlign || 'center'
    this.option.textStyle = opt.textStyle || 'rgba(100,100,100,0.15)'
    this.option.degree = opt.degree || -20
  }

  drawCanvas() {
    this.isObserver = true
    const divContainer = document.createElement('div')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    divContainer.id = this.containerId
    canvas.width = this.option.canvasWidth!
    canvas.height = this.option.canvasHeight!
    if (context) {
      context.font = this.option.font!
      context.textAlign = this.option.textAlign!
      context.fillStyle = this.option.textStyle!
      context.translate(canvas.width / 2, canvas.height / 2)
      context.rotate(this.option.degree! * Math.PI / 180)
      context.fillText(this.option.text!, 0, 0)
    }
    const backgroundUrl = canvas.toDataURL('image/png')
    this.styleStr = `
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            z-index:9999;
            pointer-events:none;
            background-repeat:repeat;
            background-image:url('${backgroundUrl}')`
    divContainer.setAttribute('style', this.styleStr)
    document.body.appendChild(divContainer)
    this.wmObserver(divContainer)
    this.isObserver = false
  }

  wmObserver(divContainer: HTMLDivElement) {
    const wmConf = { attributes: true, childList: true, characterData: true }
    const wmObserver = new MutationObserver((mo) => {
      if (!this.isObserver) {
        const _obj = mo[0].target as HTMLElement
        _obj.setAttribute('style', this.styleStr)
        _obj.setAttribute('id', this.containerId)
        wmObserver.takeRecords()
      }
    })
    wmObserver.observe(divContainer, wmConf)
  }

  parentObserver() {
    const bodyObserver = new MutationObserver(() => {
      if (!this.isObserver) {
        const __wm = document.querySelector(`#${this.containerId}`)
        if (!__wm) {
          this.drawCanvas()
        } else if (__wm.getAttribute('style') !== this.styleStr) {
          __wm.setAttribute('style', this.styleStr)
        }
      }
    })
    const parentNode = document.querySelector(`#${this.containerId}`)?.parentNode
    parentNode && bodyObserver.observe(parentNode, { childList: true })
  }

  repaint(opt = {}) {
    this.remove()
    this.init(opt)
    this.drawCanvas()
  }

  remove() {
    this.isObserver = true
    const _wm = document.querySelector(`#${this.containerId}`)
    _wm?.parentNode?.removeChild(_wm)
  }
}

export interface WaterMarkOption {
  text?: string;
  fontFamily?: string;
  color?: string;
  fontSize?: number;
  opacity?: number;
  bottom?: number;
  right?: number;
  ratio?: number;
  left?: number;
  top?: number;
}

/** Image watermarking */
export function detailImg (file: File, option:WaterMarkOption = {}) {
  const configDefault = {
    width: 200,
    height: 200
  }
  const config = {
    text: 'BusinessDolphinFormDesign',
    fontFamily: 'microsoft yahei',
    color: '#999',
    fontSize: 16,
    opacity: 100,
    bottom: 10,
    right: 10,
    ratio: 1,
    left: 0,
    top: 0
  }

  let canvas: HTMLCanvasElement | null, ctx: CanvasRenderingContext2D | null;
  return new Promise(function (resolve, reject) {
    const { text, fontFamily, color, fontSize, opacity, bottom, right, ratio } = option
    initParams()
    fileToBase64(file, initImg)

    function initParams () {
      config.text = text || config.text
      config.fontFamily = fontFamily || config.fontFamily
      config.color = color || config.color
      config.fontSize = fontSize || config.fontSize
      config.opacity = opacity || config.opacity
      config.bottom = bottom || config.bottom
      config.right = right || config.right
      config.ratio = ratio || config.ratio
    }

    function initImg (data: string) {
      const img = new Image()
      img.src = data
      img.onload = function () {
        const width = img.width
        const height = img.height
        creteCanvas(width, height)
        ctx?.drawImage(img, 0, 0, width, height)
        setText(width, height)
        const files = dataURLtoFile((document.getElementById('canvas') as HTMLCanvasElement)?.toDataURL(file.type, config.ratio), file.name)
        document.getElementById('canvas')?.remove()
        resolve(Object.assign(files, file))
      }
    }

    function creteCanvas (width: number, height: number) {
      canvas = document.getElementById('canvas') as HTMLCanvasElement
      if (canvas === null) {
        canvas = document.createElement('canvas')
        canvas.id = 'canvas'
        canvas.className = 'loquat-canvas'
        document.body.appendChild(canvas)
      }
      ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
    }

    function setText (width: number, height: number) {
      const txt = config.text
      const param = calcParam(txt, width, height)
      if(ctx) {
        ctx.font = param.fontSize + 'px ' + config.fontFamily
        ctx.fillStyle = config.color
        ctx.globalAlpha = config.opacity / 100
        ctx.fillText(txt, param.x, param.y)
      }
    }

    // Calculation ratio
    function calcParam (txt: string, width: number, height: number) {
      let x, y

      // Proportion of fonts
      const calcFontSize = config.fontSize / configDefault.width
      const fontSize = calcFontSize * width

      if (config.bottom) {
        y = configDefault.height - config.bottom
      } else {
        y = config.top
      }

      if (config.right) {
        x = configDefault.width - config.right
      } else {
        x = config.left
      }
      ctx && (ctx.font = config.fontSize + 'px ' + config.fontFamily)
      const txtWidth = Number(ctx?.measureText(txt).width)

      x = x - txtWidth

      const calcPosX = x / configDefault.width
      const calcPosY = y / configDefault.height

      x = calcPosX * width
      y = calcPosY * height
      return {
        x: x,
        y: y,
        fontSize: fontSize
      }
    }

    // File to base64
    function fileToBase64 (file: File, callback: Function) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        callback(e.target?.result)
      }
    }
  })
}
