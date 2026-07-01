import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["label"]
  static values = { text: String }

  async copy() {
    try {
      await navigator.clipboard.writeText(this.textValue)
      const original = this.labelTarget.textContent
      this.labelTarget.textContent = "コピーしました"
      setTimeout(() => {
        this.labelTarget.textContent = original
      }, 2000)
    } catch (error) {
      console.error("コピーに失敗しました:", error)
    }
  }
}
