FactoryBot.define do
  factory :group do
    name { Faker::Team.name }
    photo_limit { 27 }
    association :owner, factory: :user
  end
end
