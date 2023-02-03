var fs = require('fs')
var Jimp = require('jimp')
var svg2png = require('svg2png')

// 读取svg模版
fs.readFile('./template.svg', 'utf8', function (err, data) {
  if (err) throw err

  // 读取要替换的图片
  Jimp.read('image.png', (err, image) => {
    if (err) throw err

    // 把image转换为base64
    let imageBase64 = image.getBase64(Jimp.MIME_PNG, (err, src) => {
      if (err) throw err

      // 把base64替换到svg中
      let replacedSvg = data.replace('base64_format', src)

      // 生成新的svg文件
      fs.writeFile('./output.svg', replacedSvg, 'utf8', err => {
        if (err) throw err

        // svg转为png
        svg2png(replacedSvg, { width: 800, height: 600 })
          .then(buffer => fs.writeFileSync('output.png', buffer))
          .catch(e => console.log('oops, something went wrong:', e))
      })
    })
  })
})
