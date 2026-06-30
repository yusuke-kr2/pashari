import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["display"]
  static values = { deadline: String }

  connect() {
    this.update()
    this.timer = setInterval(() => this.update(), 60000)
  }

  disconnect() {
    if (this.timer) clearInterval(this.timer)
  }

  update() {
    const deadline = new Date(this.deadlineValue)
    const now = new Date()
    const diff = deadline - now

    if (diff <= 0) {
      this.displayTarget.textContent = "現像完了！"
      clearInterval(this.timer)
      return
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      this.displayTarget.textContent = `あと ${hours}時間${minutes}分`
    } else {
      this.displayTarget.textContent = `あと ${minutes}分`
    }
  }
}
