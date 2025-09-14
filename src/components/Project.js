import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../api';
import './Project.css';

// Project.js component with premium design and custom delete confirmation modal
const Project = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    description: '',
    owner: '',
    createdAt: new Date().toISOString(),
  });
  const [error, setError] = useState(null);

  // State for the custom confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);

  useEffect(() => {
    // Function to fetch all projects
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data);
      } catch {
        setError('Failed to fetch projects');
      }
    };
    fetchProjects();
  }, []);

  // Handler for form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Show the form for adding a new project
  const showAddForm = () => {
    setFormMode('add');
    setFormData({
      _id: '',
      title: '',
      description: '',
      owner: '',
      createdAt: new Date().toISOString(),
    });
    setFormVisible(true);
  };

  // Show the form for editing an existing project
  const showEditForm = (project) => {
    setFormMode('edit');
    setFormData({
      _id: project._id,
      title: project.title,
      description: project.description,
      owner: project.owner,
      createdAt: project.createdAt || new Date().toISOString(),
    });
    setFormVisible(true);
  };

  // Handle form submission for both adding and updating a project
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { _id, title, description, owner, createdAt } = formData;

    if (!title || !description || !owner || !createdAt) {
      setError('Title, Description, Owner, and Created At are required');
      return;
    }

    const payload = {
      title,
      description,
      owner,
      createdAt,
    };

    try {
      if (formMode === 'add') {
        const res = await createProject(payload);
        setProjects(prev => [...prev, res.data]);
      } else {
        const res = await updateProject(_id, payload);
        setProjects(prev => prev.map(p => (p._id === _id ? res.data : p)));
      }
      setFormVisible(false);
      setError(null);
    } catch {
      setError('Failed to save project');
    }
  };

  // Handler to show the custom delete confirmation modal
  const showDeleteConfirmation = (id) => {
    setProjectIdToDelete(id);
    setIsModalOpen(true);
  };

  // Handler to perform the actual deletion
  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      setIsModalOpen(false);
      setProjectIdToDelete(null);
      setError(null);
    } catch {
      setError('Failed to delete project');
    }
  };

  return (
    <div className="project-container">
      <div className="actions">
        <button className="new-project-btn" onClick={showAddForm}>
          + New Project
        </button>
      </div>

      <div className={`project-form-wrapper ${formVisible ? 'visible' : ''}`}>
        <form className="project-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            type="text"
            name="owner"
            placeholder="Owner ID"
            value={formData.owner}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            type="datetime-local"
            name="createdAt"
            placeholder="Created At"
            value={formData.createdAt ? new Date(formData.createdAt).toISOString().slice(0, 16) : ''}
            onChange={handleInputChange}
            className="form-input"
          />
          <button type="submit" className="form-button primary-btn">
            {formMode === 'add' ? 'Save' : 'Update'}
          </button>
          <button type="button" onClick={() => setFormVisible(false)} className="form-button cancel-btn">
            Cancel
          </button>
        </form>
      </div>

      {error && <p className="error-message">{error}</p>}

      <table className="project-table scrum-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Owner</th>
            <th>Team</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(proj => (
            <tr key={proj._id}>
              <td>{proj._id}</td>
              <td>{proj.title}</td>
              <td>{proj.description}</td>
              <td>{proj.owner}</td>
              <td>{proj.team?.join(', ')}</td>
              <td>{proj.createdAt ? new Date(proj.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}</td>
              <td>
                <div className="action-buttons">
                  <button className="action-btn edit-btn" onClick={() => showEditForm(proj)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => showDeleteConfirmation(proj._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Custom Confirmation Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">Confirm Delete</h4>
            <p className="modal-message">Are you sure you want to delete this project?</p>
            <div className="modal-actions">
              <button className="form-button delete-btn" onClick={() => handleDelete(projectIdToDelete)}>
                Delete
              </button>
              <button className="form-button cancel-btn" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;