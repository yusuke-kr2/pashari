class GroupsController < ApplicationController
  def index
    @groups = current_user.groups
  end

  def show
    @group = current_user.groups.find(params[:id])
  end

  def new
    @group = Group.new
  end

  def create
    @group = current_user.owned_groups.build(group_params)

    if @group.save
      @group.group_memberships.create!(user: current_user, role: :admin)
      redirect_to groups_path, notice: t(".success")
    else
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    @group = current_user.owned_groups.find(params[:id])
    @group.destroy!
    redirect_to groups_path, notice: t(".success")
  end

  private

  def group_params
    params.require(:group).permit(:name, :photo_limit)
  end
end
