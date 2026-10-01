class PhotoComment < ApplicationRecord
  belongs_to :photo
  belongs_to :user

  validates :body, presence: true, length: { maximum: 200 }
end
