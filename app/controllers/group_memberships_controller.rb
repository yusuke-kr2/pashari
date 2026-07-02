class GroupMembershipsController < ApplicationController
  def destroy
    @group = current_user.groups.find(params[:group_id])

    if @group.owner == current_user
      redirect_to group_path(@group), alert: t(".owner_cannot_leave")
      return
    end

    membership = @group.group_memberships.find_by!(user: current_user)
    membership.destroy!
    redirect_to groups_path, notice: t(".success", group: @group.name)
  end
end
