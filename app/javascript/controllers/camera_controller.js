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
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d").drawImage(video, 0, 0)

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
}
