import { Controller } from "@hotwired/stimulus"
import jsQR from "jsqr"

export default class extends Controller {
  static targets = ["video", "canvas", "status"]

  connect() {
    this.scanning = true
    this.startCamera()
  }

  disconnect() {
    this.scanning = false
    this.stopCamera()
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      })
      this.videoTarget.srcObject = this.stream
      this.videoTarget.addEventListener("playing", () => this.scan())
    } catch (error) {
      this.statusTarget.textContent = "カメラを起動できませんでした"
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
  }

  scan() {
    if (!this.scanning) return

    const video = this.videoTarget
    const canvas = this.canvasTarget
    const ctx = canvas.getContext("2d")

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code && code.data.includes("/invites/")) {
        this.scanning = false
        this.stopCamera()
        window.location.href = code.data
        return
      }
    }

    requestAnimationFrame(() => this.scan())
  }
}
