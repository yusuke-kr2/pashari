FactoryBot.define do
  factory :photo do
    association :user
    association :group
    taken_at { Time.current }
  end
end
