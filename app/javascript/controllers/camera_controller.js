import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["video", "canvas", "shutter"]
  static values = { url: String, token: String }

  connect() {
    this.startCamera()
  }

  disconnect() {
    this.stopCamera()
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      })
      this.videoTarget.srcObject = this.stream
    } catch (error) {
      console.error("カメラの起動に失敗しました:", error)
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
  }

  async capture() {
    this.shutterTarget.disabled = true

    const video = this.videoTarget
    const canvas = this.canvasTarget
    const ctx = canvas.getContext("2d")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    this.applyFilmFilter(ctx, canvas.width, canvas.height)

    canvas.toBlob(async (blob) => {
      const formData = new FormData()
      formData.append("image", blob, "photo.jpg")

      try {
        const response = await fetch(this.urlValue, {
          method: "POST",
          headers: {
            "X-CSRF-Token": this.tokenValue
          },
          body: formData
        })

        if (response.redirected) {
          window.location.href = response.url
        }
      } catch (error) {
        console.error("送信に失敗しました:", error)
        this.shutterTarget.disabled = false
      }
    }, "image/jpeg", 0.85)
  }

  applyFilmFilter(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]

      // 暖色シフト（写ルンですの温かみ）
      r = Math.min(255, r + 12)
      g = Math.min(255, g + 6)
      b = Math.max(0, b - 10)

      // コントラストを少し下げる
      const factor = 0.9
      r = Math.round(((r / 255 - 0.5) * factor + 0.5) * 255)
      g = Math.round(((g / 255 - 0.5) * factor + 0.5) * 255)
      b = Math.round(((b / 255 - 0.5) * factor + 0.5) * 255)

      // 粒子感（軽いノイズ）
      const noise = (Math.random() - 0.5) * 18
      r = Math.min(255, Math.max(0, r + noise))
      g = Math.min(255, Math.max(0, g + noise))
      b = Math.min(255, Math.max(0, b + noise))

      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
    }

    ctx.putImageData(imageData, 0, 0)

    // 周辺減光（ビネット効果）
    const cx = width / 2
    const cy = height / 2
    const radius = Math.sqrt(cx * cx + cy * cy)
    const gradient = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius)
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)")
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.35)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
}
