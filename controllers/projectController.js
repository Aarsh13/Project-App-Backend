import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js'; // Make sure to import the Task model

export const getProjects = async (req, res) => {
  const projects = await Project.find({
    '$or': [
      { 'collaborators': { $in: req.user } },
      { 'creator': { $in: req.user } },
    ]
  }).populate({ path: 'tasks', select: 'isCompleted' });

  res.json(projects);
}

export const createProject = async (req, res) => {

  const newProject = new Project(req.body);
  newProject.creator = req.user._id;

  try {
    const project = await newProject.save();
    return res.status(201).json({ message: 'Project created successfully.', project });
  } catch (error) {
    const { message } = new Error('Error creating the project.');
    return res.status(500).json({ message });
  }
}

export const getProject = async (req, res) => {
  const id = req.params.id;

  try {
    const project = await Project.findById(id)
      .populate({ path: 'tasks', populate: { path: 'completedBy', select: 'name' } })
      .populate('collaborators', 'name email');

    if (project.creator.toString() !== req.user._id.toString() && !project.collaborators.some((collaborator => collaborator._id.toString() === req.user._id.toString()))) {
      const { message } = new Error('You do not have access to this project.');
      return res.status(401).json({ message });
    }

    res.json(project);

  } catch (error) {
    if (error.kind === 'ObjectId') {
      const { message } = new Error('Project not found.');
      return res.status(404).json({ message });
    } else {
      const { message } = new Error('Error retrieving the project.');
      return res.status(500).json({ message, error });
    }
  }
}

export const updateProject = async (req, res) => {
  const id = req.params.id;

  try {
    const project = await Project.findById(id);
    if (project.creator.toString() !== req.user._id.toString()) {
      const { message } = new Error('You do not have access to this project.');
      return res.status(401).json({ message });
    }

    const projectUpdated = await Project.findOneAndUpdate(project, req.body, { new: true });
    res.json(projectUpdated);

  } catch (error) {
    const { message } = new Error('Project not found or there was an error updating.');
    return res.status(404).json({ message });
  }
}

export const deleteProject = async (req, res) => {
  const id = req.params.id;

  try {
    const project = await Project.findById(id);
    if (project.creator.toString() !== req.user._id.toString()) {
      const { message } = new Error('You do not have access to this project.');
      return res.status(401).json({ message });
    }

    await Task.deleteMany({ _id: { $in: project.tasks } });
    await project.deleteOne();
    res.json({ message: 'Project deleted.' });

  } catch (error) {
    const { message } = new Error('Project not found or there was an error deleting.');
    return res.status(404).json({ message });
  }
}

export const searchCollaborator = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email }).select(['email', 'name']);

  if (!user) {
    const { message } = new Error('User not found.');
    return res.status(404).json({ message });
  }

  res.json(user);
}

export const addCollaborator = async (req, res) => {
  const id = req.params.id;
  const email = req.body.email;

  try {
    const project = await Project.findById(id);

    if (project.creator.toString() !== req.user._id.toString()) {
      const { message } = new Error('You do not have access to this project.');
      return res.status(401).json({ message });
    }

    const user = await User.findOne({ email });

    if (!user) {
      const { message } = new Error('User not found.');
      return res.status(404).json({ message });
    }

    if (project.creator.toString() === user._id.toString()) {
      const { message } = new Error('The creator of the project cannot be a collaborator.');
      return res.status(400).json({ message });
    }

    if (project.collaborators.includes(user._id)) {
      const { message } = new Error('This user is already a collaborator on the project.');
      return res.status(400).json({ message });
    }

    project.collaborators.push(user._id);
    await project.save();

    res.json({ message: 'Collaborator successfully added.' });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      const { message } = new Error('Project not found.');
      return res.status(404).json({ message });
    } else {
      const { message } = new Error('Error adding the collaborator.');
      return res.status(500).json({ message, error });
    }
  }
}

export const removeCollaborator = async (req, res) => {
  const idProject = req.params.id;
  const idCollaborator = req.body.id;

  try {
    const project = await Project.findById(idProject);

    if (project.creator.toString() !== req.user._id.toString()) {
      const { message } = new Error('You do not have access to this project.');
      return res.status(401).json({ message });
    }

    project.collaborators.pull(idCollaborator);
    await project.save();

    res.json({ message: 'Collaborator successfully removed.' });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      const { message } = new Error('Project not found.');
      return res.status(404).json({ message });
    } else {
      const { message } = new Error('Error removing the collaborator.');
      return res.status(500).json({ message, error });
    }
  }
}
