module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn('restaurants', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'files',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    }),

  down: async (queryInterface) =>
    queryInterface.removeColumn('restaurants', 'avatar_id'),
};
