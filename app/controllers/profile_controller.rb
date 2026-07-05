class ProfileController < ApplicationController
  def show
    @groups = current_user.groups
    @photo_count = current_user.photos.count
  end
end
