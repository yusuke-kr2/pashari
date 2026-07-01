class InvitesController < ApplicationController
  def show
    @group = Group.find_by!(invite_token: params[:token])

    if @group.members.include?(current_user)
      redirect_to group_path(@group), notice: t(".already_member")
    else
      @group.group_memberships.create!(user: current_user, role: :member)
      redirect_to group_path(@group), notice: t(".success", group: @group.name)
    end
  end
end
