Rails.application.routes.draw do
  devise_for :users
  get "home/index"
  resources :groups, only: [ :index, :show, :new, :create, :destroy ] do
    resources :photos, only: [ :index, :new, :create ]
    resource :membership, only: [ :destroy ], controller: "group_memberships"
  end
  get "invites/:token", to: "invites#show", as: :invite
  get "scan", to: "qr_scanner#show", as: :qr_scanner
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
  root "home#index"
end
