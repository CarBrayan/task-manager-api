const taskService = require('../services/taskService');

async function createTask(req, res, next) {
  try {
    const userId = req.user.id;
    const task = await taskService.createTask(userId, req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

async function listTasks(req, res, next) {
  try {
    const userId = req.user.id;
    const tasks = await taskService.getTasks(userId);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

async function getTask(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await taskService.getTaskById(userId, id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await taskService.updateTask(userId, id, req.body);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const success = await taskService.deleteTask(userId, id);
    if (!success) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask
};