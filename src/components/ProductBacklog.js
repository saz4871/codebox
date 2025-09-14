import React, { useState, useEffect } from 'react';
import {
  getProjects,
  getProductBacklogs,
  createProductBacklog,
  updateProductBacklog,
  deleteProductBacklog,
} from '../api';
import './Backlog.css';

const priorityOptions = [
  { value: 0, label: 'Low' },
  { value: 1, label: 'Medium' },
  { value: 2, label: 'High' },
];

const statusOptions = ['Pending', 'InProgress', 'Completed'];

const ProductBacklog = () => {
  const [projects, setProjects] = useState([]);
  const [productBacklogItems, setProductBacklogItems] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    description: '',
    priority: 0,
    status: 'Pending',
    project: '',
    createdAt: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await getProjects();
        setProjects(projectsResponse.data);
        const backlogResponse = await getProductBacklogs(); // Assuming API can fetch all backlogs without a project ID
        setProductBacklogItems(backlogResponse.data);
      } catch {
        setError('Failed to load data');
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value) : value,
    }));
  };

  const showAddForm = () => {
    setFormMode('add');
    setFormData({
      _id: '',
      title: '',
      description: '',
      priority: 0,
      status: 'Pending',
      project: projects.length > 0 ? projects[0]._id : '', // Automatically select the first project
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setFormVisible(true);
  };

  const showEditForm = (item) => {
    setFormMode('edit');
    setFormData({
      _id: item._id,
      title: item.title,
      description: item.description,
      priority: item.priority,
      status: item.status,
      project: item.project,
      createdAt: item.createdAt?.slice(0, 10) || '',
    });
    setFormVisible(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { _id, title, description, priority, status, project, createdAt } = formData;

    if (!title || !description || !project || !createdAt) {
      setError('Title, Description, Project, and Created At are required');
      return;
    }
    
    if (formMode === 'add' && !_id) {
        setError('Backlog ID is required for a new item');
        return;
    }
    if (formMode === 'edit' && !_id) {
        setError('Backlog ID is missing for editing');
        return;
    }

    const payload = {
      _id,
      title,
      description,
      priority,
      status,
      project,
      createdAt,
    };

    try {
      if (formMode === 'add') {
        const res = await createProductBacklog(project, payload);
        setProductBacklogItems(prev => [...prev, res.data]);
      } else {
        const res = await updateProductBacklog(project, _id, payload);
        setProductBacklogItems(prev =>
          prev.map(item => (item._id === _id ? res.data : item))
        );
      }
      setFormVisible(false);
      setError(null);
    } catch {
      setError('Failed to save backlog item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteProductBacklog(formData.project, id);
      setProductBacklogItems(prev => prev.filter(item => item._id !== id));
    } catch {
      setError('Failed to delete item');
    }
  };

  const openBacklogCount = productBacklogItems.filter(item => item.status !== 'Completed').length;
  const highPriorityCount = productBacklogItems.filter(item => item.priority === 2).length;

  return (
    <div className="backlog-container">
      <div className="summary-cards">
        <div className="card open-backlog">
          <div className="card-title">Open Backlog Items</div>
          <div className="card-value">{openBacklogCount}</div>
        </div>
        <div className="card high-priority">
          <div className="card-title">High Priority Items</div>
          <div className="card-value">{highPriorityCount}</div>
        </div>
        <div className="card in-progress">
          <div className="card-title">In Progress</div>
          <div className="card-value">{productBacklogItems.filter(item => item.status === 'InProgress').length}</div>
        </div>
        <div className="card planned-sprints">
          <div className="card-title">Total Items</div>
          <div className="card-value">{productBacklogItems.length}</div>
        </div>
      </div>
      
      <div className="top-actions">
        <button className="new-item-btn" onClick={showAddForm}>
          + Add New Item
        </button>
      </div>

      <div className={`backlog-form-wrapper ${formVisible ? 'visible' : ''}`}>
        <form className="backlog-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="_id"
            placeholder="Backlog ID"
            value={formData._id}
            onChange={handleInputChange}
            required
            disabled={formMode === 'edit'}
            className="form-input"
          />
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
          <select name="priority" value={formData.priority} onChange={handleInputChange} className="form-select">
            {priorityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select name="status" value={formData.status} onChange={handleInputChange} className="form-select">
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select name="project" value={formData.project} onChange={handleInputChange} required className="form-select">
            <option value="">--- Select Project ---</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>{project.title}</option>
            ))}
          </select>
          <input
            type="date"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleInputChange}
            required
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

      <table className="backlog-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Project</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productBacklogItems.map(item => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{priorityOptions.find(p => p.value === item.priority)?.label}</td>
              <td>{item.status}</td>
              <td>{projects.find(p => p._id === item.project)?.title || item.project}</td>
              <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
              <td>
                <div className="action-buttons">
                  <button className="action-btn edit-btn" onClick={() => showEditForm(item)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductBacklog;