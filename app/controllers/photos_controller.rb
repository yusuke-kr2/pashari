require "zip"

class PhotosController < ApplicationController
  before_action :set_group

  def index
    @developed_photos = @group.photos.visible.order(taken_at: :desc)
    @developing_photos = @group.photos.developing.order(:visible_at)
  end

  def download
    @photo = @group.photos.visible.find(params[:id])
    redirect_to rails_blob_path(@photo.image, disposition: "attachment")
  end

  def download_all
    photos = @group.photos.visible.with_attached_image
    return redirect_to group_photos_path(@group), alert: t(".no_photos") if photos.empty?

    zip_data = Zip::OutputStream.write_buffer do |zip|
      photos.each_with_index do |photo, i|
        ext = File.extname(photo.image.filename.to_s).presence || ".jpg"
        filename = "photo_#{i + 1}#{ext}"
        zip.put_next_entry(filename)
        zip.write(photo.image.download)
      end
    end

    send_data zip_data.string,
      filename: "#{@group.name}_photos.zip",
      type: "application/zip",
      disposition: "attachment"
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
