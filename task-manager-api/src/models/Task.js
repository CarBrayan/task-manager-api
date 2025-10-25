const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./User');
const { TASK_STATUSES } = require('../utils/constants');

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM,
      values: TASK_STATUSES,
      defaultValue: 'pending'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Task',
    timestamps: true
  }
);

// Relaciones
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { Task };