import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { vapidPublicKey: String }

  async connect() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return

    const registration = await navigator.serviceWorker.ready
    const existing = await registration.pushManager.getSubscription()
    if (existing) return

    const permission = await Notification.requestPermission()
    if (permission !== "granted") return

    await this.subscribe(registration)
  }

  async subscribe(registration) {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKeyValue)
    })

    const { endpoint, keys } = subscription.toJSON()
    await fetch("/push_subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        subscription: {
          endpoint,
          p256dh_key: keys.p256dh,
          auth_key: keys.auth
        }
      })
    })
  }

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
  }
}
