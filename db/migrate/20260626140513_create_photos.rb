class CreatePhotos < ActiveRecord::Migration[8.1]
  def change
    create_table :photos do |t|
      t.references :user, null: false, foreign_key: true
      t.references :group, null: false, foreign_key: true
      t.datetime :taken_at
      t.datetime :visible_at

      t.timestamps
    end
  end
end
