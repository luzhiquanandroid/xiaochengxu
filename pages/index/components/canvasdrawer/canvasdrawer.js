/* global Component wx */

Component({
  properties: {
    painting: {
      type: Object,
      value: {view: []},
      observer (newVal, oldVal) {
        if (!this.data.isPainting) {
          if (newVal.width && newVal.height) {
            this.setData({
                showCanvas: true,
                isPainting: true
            })
            this.readyPigment()
          }
        }
      }
    }
  },
  data: {
    showCanvas: false,
    width: 100,
    height: 100,
    index: 0,
    imageList: [],
    tempFileList: [],
    isPainting: false
  },
  ctx: null,
  cache: {},
  ready () {
    wx.removeStorageSync('canvasdrawer_pic_cache')
    this.cache = wx.getStorageSync('canvasdrawer_pic_cache') || {}
    this.cache = {}
    this.ctx = wx.createCanvasContext('canvasdrawer', this)
  },
  methods: {
    readyPigment () {
      const { width, height, views } = this.data.painting
      this.setData({
        width,
        height
      })
      const inter = setInterval(() => {
        if (this.ctx) {
          clearInterval(inter)
          this.getImageList(views)
          this.downLoadImages(0)
        }
      }, 100)
    },
    getImageList (views) {
      const imageList = []
      for (let i = 0; i < views.length; i++) {
        if (views[i].type === 'image') {
          imageList.push(views[i].url)
        }
      }
      this.setData({
        imageList
      })
    },
    downLoadImages (index) {
      const { imageList, tempFileList } = this.data
      if (index < imageList.length) {
        this.getImageInfo(imageList[index]).then(file => {

          tempFileList.push(file)
          this.setData({
            tempFileList
          })
          this.downLoadImages(index + 1)
        })
      } else {
        this.startPainting()
      }
    },
    startPainting () {
      const { tempFileList, painting: { views } } = this.data
      for (let i = 0, imageIndex = 0; i < views.length; i++) {
        if (views[i].type === 'image') {
          this.drawImage({
            ...views[i],
            url: tempFileList[imageIndex]
          })
          imageIndex++
        } else if (views[i].type === 'text') {
          if (!this.ctx.measureText) {
            wx.showModal({
              title: '提示',
              content: '当前微信版本过低，无法使用 measureText 功能，请升级到最新微信版本后重试。'
            })
          } else {
            this.drawText(views[i])
          }
        } else if (views[i].type === 'rect') {
          this.drawRect(views[i])
        }
      }
      this.ctx.draw(true, () => {
        wx.setStorageSync('canvasdrawer_pic_cache', this.cache)
        this.saveImageToLocal()
      })
    },
    drawImage (params) {
      const { url, top = 0, left = 0, width = 0, height = 0 } = params
      this.ctx.drawImage(url, left, top, width, height)
    },
    drawText (params) {
      const { 
        MaxLineNumber = 2, 
        breakWord = false, 
        color = 'transparent', 
        content = '',
        textBefore = '',
        textAfter = '',
        textBeforeFont = 16,
        textAfterFont = 16,
        fontSize = 16, 
        top = 0, 
        left = 0, 
        lineHeight = 20, 
        textAlign = 'left', 
        width, 
        bolder = false,
        textDecoration = 'none'
      } = params

      this.ctx.setTextBaseline('top')
      this.ctx.setTextAlign(textAlign)
      this.ctx.setFillStyle(color)
      this.ctx.setFontSize(fontSize)
      if (!breakWord) {
        var textLeftWidth = left;
        let textbeforestring = String(textBefore)
        if (textbeforestring){
          this.ctx.setFontSize(textBeforeFont)
          let widthBefore = this.ctx.measureText(textbeforestring);
          var wid = 0;
          let textAft = String(textAfter)
            if (textAft && textAft != undefined){
              this.ctx.setFontSize(textAfterFont)
              wid = this.ctx.measureText(textAft).width;
          }
            textLeftWidth = left + widthBefore.width + wid;
          this.ctx.setFontSize(fontSize)
        }
        if (left < 0) {
            let contentString = String(content)
            let widthContent = this.ctx.measureText(contentString);
            textLeftWidth = 750 - widthContent.width + left;
        }
        this.ctx.fillText(content, textLeftWidth, top)
        // this.drawTextLine(left, top, textDecoration, color, fontSize, content)
      } else {
        let fillText = ''
        let fillTop = top
        let lineNum = 1
        for (let i = 0; i < content.length; i++) {
          fillText += [content[i]]
          if (this.ctx.measureText(fillText).width > width) {
            if (lineNum === MaxLineNumber) {
              if (i !== content.length) {
                fillText = fillText.substring(0, fillText.length - 1) + '...'
                this.ctx.fillText(fillText, left, fillTop)
                this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
                fillText = ''
                break
              }
            }
            this.ctx.fillText(fillText, left, fillTop)
            this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
            fillText = ''
            fillTop += lineHeight
            lineNum ++
          }
        }
        this.ctx.fillText(fillText, left, fillTop)
        this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
      }
      if (bolder) {
        this.drawText({
          ...params,
          left: left + 0.3,
          top: top + 0.3,
          bolder: false,
          textDecoration: 'none' 
        })
      }
    },
    drawTextLine (left, top, textDecoration, color, fontSize, content) {
      if (textDecoration === 'underline') {
        this.drawRect({
          background: color,
          top: top + fontSize * 1.2,
          left: left - 1,
          width: this.ctx.measureText(content).width + 3,
          height: 1
        })
      } else if (textDecoration === 'line-through') {
        this.drawRect({
          background: color,
          top: top + fontSize * 0.6,
          left: left - 1,
          width: this.ctx.measureText(content).width + 3,
          height: 1
        })
      }
    },
    drawRect (params) {
      const { background, top = 0, left = 0, width = 0, height = 0 } = params
      this.ctx.setFillStyle(background)
      this.ctx.fillRect(left, top, width, height)
    },
    getImageInfo (url) {
      return new Promise((resolve, reject) => {
        /* 获得要在画布上绘制的图片 */
        if (this.cache[url]) {
          resolve(this.cache[url])
        } else {
          const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
          if (objExp.test(url)) {
            wx.getImageInfo({
              src: url,
              complete: res => {
                if (res.errMsg === 'getImageInfo:ok') {
                  this.cache[url] = res.path
                  resolve(res.path)
                } else {
                  reject(new Error('getImageInfo fail'))
                }
              }
            })
          } else {
            this.cache[url] = url
            resolve(url)
          }
        }
      })
    },
    saveImageToLocal () {
      const { width, height } = this.data
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width,
        height,
        canvasId: 'canvasdrawer',
        success: res => {
          if (res.errMsg === 'canvasToTempFilePath:ok') {
            this.setData({
              showCanvas: false,
              isPainting: false,
              imageList: [],
              tempFileList: []
            })
            this.triggerEvent('getImage', {tempFilePath: res.tempFilePath})
          }
        },
        fail: res => {

        } 
      }, this)
    }
  }
})
