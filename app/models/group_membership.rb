class GroupMembership < ApplicationRecord
  belongs_to :user
  belongs_to :group

  enum :role, { member: 0, admin: 1 }
end
