class PhotosController < ApplicationController
  before_action :set_group

  def index
    @developed_photos = @group.photos.visible.order(taken_at: :desc)
    @developing_photos = @group.photos.developing.order(:visible_at)
  end

  def new
    @remaining = remaining_photos
  end

  def create
    if remaining_photos <= 0
      redirect_to new_group_photo_path(@group), alert: t(".limit_reached")
      return
    end

    @photo = @group.photos.build(user: current_user, taken_at: Time.current)
    @photo.image.attach(params[:image])

    if @photo.save
      redirect_to new_group_photo_path(@group), notice: t(".success")
    else
      redirect_to new_group_photo_path(@group), alert: t(".failure")
    end
  end

  private

  def set_group
    @group = current_user.groups.find(params[:group_id])
  end

  def remaining_photos
    return Float::INFINITY unless @group.photo_limit
    @group.photo_limit - @group.photos.count
  end
end
