class CreatePhotoComments < ActiveRecord::Migration[8.1]
  def change
    create_table :photo_comments do |t|
      t.references :photo, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :body, null: false

      t.timestamps
    end
  end
end
