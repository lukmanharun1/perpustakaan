module.exports = (Sequelize, field = {}) => ({
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
  },
  ...field,
  created_at: {
    type: Sequelize.DATE,
  },
  updated_at: {
    type: Sequelize.DATE,
  },
  deleted_at: {
    type: Sequelize.DATE,
  },
});
