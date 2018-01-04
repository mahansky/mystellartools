export const info = {
  text: 'Stellar',
  value: 'wallet2',
  credit: 'Based on /u/C-Storm\'s design',
}

export function draw(data) {
  return new Promise((r) => {
    // Background

    let bg = new Image
    bg.src = '/img/paperwallet/stellar1.png'
    bg.onload = () => {
      console.log('LASDASDAIOSDUAOSIDUASD')
      data.ctx.drawImage(bg, 400, 250)

      // Public key

      data.ctx.font = '700 26pt Roboto-Bold'
      data.ctx.fillText('PUBLIC KEY', 200, 250)
      data.ctx.font = '56pt Roboto'

      let full = data.publicKey
      data.ctx.fillText(full.slice(0, 30), 200, 350)
      data.ctx.fillText(full.slice(30), 200, 420)

      data.ctx.drawImage(data.publicQR, 1980, 200, 300, 300)

      // Secret key

      if (data.isSecret) {
        data.ctx.font = '700 26pt Roboto-Bold'
        data.ctx.fillText('SECRET KEY', 200, 650)
        data.ctx.font = '56pt Roboto'

        let full = data.secretKey
        data.ctx.fillText(full.slice(0, 30), 200, 750)
        data.ctx.fillText(full.slice(30), 200, 820)

        data.ctx.drawImage(data.secretQR, 1980, 600, 300, 300)
      }

      r()
    }
  })
}