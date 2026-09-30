class PhotoCommentsController < ApplicationController
  before_action :set_group
  before_action :set_photo

  def create
    @comment = @photo.photo_comments.build(comment_params.merge(user: current_user))
    if @comment.save
      redirect_to group_photo_path(@group, @photo), notice: t(".success")
    else
      redirect_to group_photo_path(@group, @photo), alert: t(".failure")
    end
  end

  def destroy
    @comment = @photo.photo_comments.find(params[:id])
    @comment.destroy if @comment.user == current_user
    redirect_to group_photo_path(@group, @photo)
  end

  private

  def set_group
    @group = current_user.groups.find(params[:group_id])
  end

  def set_photo
    @photo = @group.photos.visible.find(params[:photo_id])
  end

  def comment_params
    params.require(:photo_comment).permit(:body)
  end
end
