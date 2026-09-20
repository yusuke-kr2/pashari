class DevelopmentCompleteJob < ApplicationJob
  queue_as :default

  def perform(group_id)
    group = Group.find_by(id: group_id)
    return unless group

    message = {
      title: "📷 現像が完了しました！",
      options: {
        body: "#{group.name}のみんなの写真を見てみよう",
        icon: "/icon.png",
        badge: "/icon.png",
        data: { path: "/groups/#{group_id}/photos" }
      }
    }

    group.members.includes(:push_subscriptions).each do |member|
      member.push_subscriptions.each do |sub|
        Webpush.payload_send(
          message: message.to_json,
          endpoint: sub.endpoint,
          p256dh: sub.p256dh_key,
          auth: sub.auth_key,
          vapid: {
            subject: "mailto:#{Rails.application.credentials.dig(:webpush, :vapid_subject) || "pashari@example.com"}",
            public_key: Rails.application.credentials.dig(:webpush, :vapid_public_key),
            private_key: Rails.application.credentials.dig(:webpush, :vapid_private_key)
          }
        )
      rescue Webpush::InvalidSubscription, Webpush::ExpiredSubscription
        sub.destroy
      end
    end
  end
end
