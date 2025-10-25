const { Task } = require('../models/Task');

async function createTask(userId, { title, description, status, dueDate }) {
  const task = await Task.create({
    title,
    description,
    status,
    dueDate,
    userId
  });
  return task;
}

async function getTasks(userId) {
  const tasks = await Task.findAll({ where: { userId } });
  return tasks;
}

async function getTaskById(userId, id) {
  const task = await Task.findOne({ where: { id, userId } });
  return task;
}

async function updateTask(userId, id, updates) {
  const task = await getTaskById(userId, id);
  if (!task) {
    return null;
  }
  await task.update(updates);
  return task;
}

async function deleteTask(userId, id) {
  const task = await getTaskById(userId, id);
  if (!task) {
    return null;
  }
  await task.destroy();
  return true;
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};