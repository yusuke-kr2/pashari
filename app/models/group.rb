class Group < ApplicationRecord
  belongs_to :owner, class_name: "User"

  has_many :group_memberships, dependent: :destroy
  has_many :members, through: :group_memberships, source: :user
  has_many :photos, dependent: :destroy

  validates :name, presence: true
  validates :photo_limit, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true

  before_create :generate_invite_token

  private

  def generate_invite_token
    self.invite_token ||= SecureRandom.urlsafe_base64(16)
  end
end
