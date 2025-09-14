import React, { useState, useEffect } from 'react';
import {
  getProjects,
  getSprints,
  createSprint,
  updateSprint,
  deleteSprint,
} from '../api';
import './Backlog.css';

const SprintBacklog = () => {
  const [projects, setProjects] = useState([]);
  const [sprintItems, setSprintItems] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    startDate: '',
    endDate: '',
    status: 'Planned',
    project: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await getProjects();
        setProjects(projectsResponse.data);
      } catch (err) {
        setError('Failed to load projects');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const fetchSprints = async () => {
        try {
          const sprintsResponse = await getSprints(selectedProject);
          setSprintItems(sprintsResponse.data);
        } catch (err) {
          setError('Failed to load sprints for the selected project');
        }
      };
      fetchSprints();
    } else {
      setSprintItems([]); // Clear sprints when no project is selected
    }
  }, [selectedProject]);

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showAddForm = () => {
    if (!selectedProject) {
        setError('Please select a project first.');
        return;
    }
    setFormMode('add');
    setFormData({
      _id: '',
      name: '',
      startDate: '',
      endDate: '',
      status: 'Planned',
      project: selectedProject,
    });
    setFormVisible(true);
  };

  const showEditForm = (item) => {
    setFormMode('edit');
    setFormData({
      _id: item._id,
      name: item.name,
      startDate: item.startDate?.slice(0, 10) || '',
      endDate: item.endDate?.slice(0, 10) || '',
      status: item.status,
      project: item.project,
    });
    setFormVisible(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { _id, name, startDate, endDate, status, project } = formData;
    if (!name || !startDate || !endDate || !project) {
      setError('Name, Start Date, and End Date are required');
      return;
    }

    const payload = {
      _id,
      name,
      startDate,
      endDate,
      status,
      project,
    };

    try {
      if (formMode === 'add') {
        const res = await createSprint(project, payload);
        setSprintItems(prev => [...prev, res.data]);
      } else {
        const res = await updateSprint(project, _id, payload);
        setSprintItems(prev =>
          prev.map(item => (item._id === _id ? res.data : item))
        );
      }
      setFormVisible(false);
      setError(null);
    } catch {
      setError('Failed to save sprint item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteSprint(selectedProject, id);
      setSprintItems(prev => prev.filter(item => item._id !== id));
    } catch {
      setError('Failed to delete item');
    }
  };
  
  const currentSprints = sprintItems.filter(item => item.status === 'InProgress').length;
  const completedSprints = sprintItems.filter(item => item.status === 'Completed').length;
  const totalSprints = sprintItems.length;

  return (
    <div className="sprint-backlog-container">
      <div className="summary-cards">
        <div className="card open-backlog">
          <div className="card-title">Total Sprints</div>
          <div className="card-value">{totalSprints}</div>
        </div>
        <div className="card high-priority">
          <div className="card-title">Completed</div>
          <div className="card-value">{completedSprints}</div>
        </div>
        <div className="card in-progress">
          <div className="card-title">In Progress</div>
          <div className="card-value">{currentSprints}</div>
        </div>
        <div className="card planned-sprints">
          <div className="card-title">Planned</div>
          <div className="card-value">{totalSprints - completedSprints - currentSprints}</div>
        </div>
      </div>

      <div className="top-actions">
        <div className="filters">
          <label className="form-label">
            Project:
            <select className="form-select" value={selectedProject} onChange={handleProjectChange}>
              <option value="">--- Select Project ---</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.title}</option>
              ))}
            </select>
          </label>
        </div>
        <button className="new-item-btn" onClick={showAddForm}>
          + Add New Sprint
        </button>
      </div>

      <div className={`backlog-form-wrapper ${formVisible ? 'visible' : ''}`}>
        <form className="backlog-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="_id"
            placeholder="Sprint ID"
            value={formData._id}
            onChange={handleInputChange}
            required
            disabled={formMode === 'edit'}
            className="form-input"
          />
          <input
            type="text"
            name="name"
            placeholder="Sprint Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <select name="status" value={formData.status} onChange={handleInputChange} className="form-select">
            <option value="Planned">Planned</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
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
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sprintItems.map(item => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.startDate ? new Date(item.startDate).toLocaleDateString() : '-'}</td>
              <td>{item.endDate ? new Date(item.endDate).toLocaleDateString() : '-'}</td>
              <td>{item.status}</td>
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

export default SprintBacklog;