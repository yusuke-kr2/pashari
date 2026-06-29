class Group < ApplicationRecord
  belongs_to :owner, class_name: "User"

  has_many :group_memberships, dependent: :destroy
  has_many :members, through: :group_memberships, source: :user
  has_many :photos, dependent: :destroy

  validates :name, presence: true
  validates :photo_limit, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
end
