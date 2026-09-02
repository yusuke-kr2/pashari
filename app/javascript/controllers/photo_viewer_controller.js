import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "image", "name", "date"]

  connect() {
    this.photos = []
    this.currentIndex = 0
    this.touchStartX = 0

    document.addEventListener("keydown", this.handleKeydown.bind(this))
    this.modalTarget.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: true })
    this.modalTarget.addEventListener("touchend", this.handleTouchEnd.bind(this), { passive: true })
  }

  disconnect() {
    document.removeEventListener("keydown", this.handleKeydown.bind(this))
  }

  open(event) {
    const card = event.currentTarget
    this.photos = JSON.parse(this.element.dataset.photoviewerPhotosValue)
    this.currentIndex = parseInt(card.dataset.photoviewerIndex)
    this.show()
    this.modalTarget.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  close() {
    this.modalTarget.classList.remove("active")
    document.body.style.overflow = ""
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--
      this.show()
    }
  }

  next() {
    if (this.currentIndex < this.photos.length - 1) {
      this.currentIndex++
      this.show()
    }
  }

  show() {
    const photo = this.photos[this.currentIndex]
    this.imageTarget.src = photo.url
    this.nameTarget.textContent = photo.name
    this.dateTarget.textContent = photo.date
  }

  handleKeydown(event) {
    if (!this.modalTarget.classList.contains("active")) return
    if (event.key === "ArrowLeft") this.prev()
    if (event.key === "ArrowRight") this.next()
    if (event.key === "Escape") this.close()
  }

  handleTouchStart(event) {
    this.touchStartX = event.changedTouches[0].screenX
  }

  handleTouchEnd(event) {
    const diff = this.touchStartX - event.changedTouches[0].screenX
    if (Math.abs(diff) < 50) return
    if (diff > 0) {
      this.next()
    } else {
      this.prev()
    }
  }

  closeOnBackdrop(event) {
    if (event.target === this.modalTarget) this.close()
  }

  noop(event) {
    event.stopPropagation()
  }
}
