class Photo < ApplicationRecord
  DEVELOPING_PERIOD = 24.hours

  belongs_to :user
  belongs_to :group

  has_one_attached :image

  scope :visible, -> { where("visible_at <= ?", Time.current) }
  scope :developing, -> { where("visible_at > ?", Time.current) }

  before_validation :set_visible_at, on: :create

  def developed?
    visible_at.present? && visible_at <= Time.current
  end

  private

  def set_visible_at
    self.visible_at ||= (taken_at || Time.current) + DEVELOPING_PERIOD
  end
end
