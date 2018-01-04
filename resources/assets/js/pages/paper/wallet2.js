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
      data.ctx.drawImage(bg, 200, 250)

      // Public key
      data.ctx.font = '14pt Roboto'
      data.ctx.fillText(data.publicKey, 235, 308)
      data.ctx.drawImage(data.publicQR, 230, 355, 190, 190)

      // Secret key
      if (data.secretKey) {
        let size = data.ctx.measureText(data.secretKey)

        data.ctx.fillText(data.secretKey, 2160 - size.width, 807)
        data.ctx.drawImage(data.secretQR, 1978, 556, 190, 190)
      }

      r()
    }
  })
}