import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  const { project } = req.body;

  try {
    const projectAssigned = await Project.findById(project);

    if (projectAssigned.creator.toString() !== req.user._id.toString()) {
      const { message } = new Error('You do not have access to this project.');
      return res.status(403).json({ message });
    }

    const newTask = new Task(req.body);

    const task = await newTask.save();

    projectAssigned.tasks.push(task._id);
    await projectAssigned.save();
    return res.json(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      const { message } = new Error('The assigned project is incorrect.');
      return res.status(404).json({ message });
    } else {
      const { message } = new Error('Error creating the task.');
      return res.status(500).json({ message, error });
    }
  }
}

export const getTask = async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findById(id).populate('project');
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const { message } = new Error('You are not authorized to view this task.');
      return res.status(403).json({ message });
    }
    res.json(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      const { message } = new Error('Task not found.');
      return res.status(404).json({ message });
    }
  }
}

export const updateTask = async (req, res) => {
  const id = req.params.id;
  const { name, description, dueDate, priority } = req.body;

  try {
    const task = await Task.findById(id).populate('project');
    if (!task) {
      const { message } = new Error('Task not found.');
      return res.status(404).json({ message });
    }
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const { message } = new Error('You are not authorized to edit this task.');
      return res.status(403).json({ message });
    }

    const taskUpdated = await Task.findOneAndUpdate(
      task,
      { name, description, dueDate, priority },
      { new: true }
    );

    res.json(taskUpdated);

  } catch (error) {
    const { message } = new Error('Error updating task.');
    return res.status(500).json({ message });
  }
}

export const deleteTask = async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findById(id).populate('project');
    if (!task) {
      const { message } = new Error('Task not found.');
      return res.status(404).json({ message });
    }
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const { message } = new Error('You are not authorized to delete this task.');
      return res.status(403).json({ message });
    }
    const project = await Project.findById(task.project);
    project.tasks.pull(task._id);

    await Promise.allSettled([await project.save(), await task.deleteOne()]);
    res.json({ message: 'Task deleted' });

  } catch (error) {
    const { message } = new Error('Error deleting the task.');
    return res.status(500).json({ message });
  }
}

export const toggleTask = async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findById(id).populate('project');
    if (!task) {
      const { message } = new Error('Task not found.');
      return res.status(404).json({ message });
    }

    if (task.project.creator.toString() !== req.user._id.toString() && !task.project.collaborators.some((collaborator => collaborator._id.toString() === req.user._id.toString()))) {
      const { message } = new Error('You are not authorized to perform this action.');
      return res.status(403).json({ message });
    }

    task.isCompleted = !task.isCompleted;
    task.completedBy = req.user._id;

    await task.save();

    const taskSaved = await Task.findById(id)
      .populate('project')
      .populate('completedBy');

    res.json(taskSaved);

  } catch (error) {
    const { message } = new Error('An error occurred.');
    return res.status(500).json({ message });
  }
}
