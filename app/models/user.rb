class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :name, presence: true, length: { maximum: 30 }

  has_many :owned_groups, class_name: "Group", foreign_key: :owner_id
  has_many :group_memberships, dependent: :destroy
  has_many :groups, through: :group_memberships
  has_many :photos, dependent: :destroy
  has_many :push_subscriptions, dependent: :destroy
end
