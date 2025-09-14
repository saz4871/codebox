import React from 'react';
import TaskCard from './TaskCard';

const icons = {
  'To Do': '📊',
  'In Progress': '⏰',
  'Done': '👨‍💻',
};

const descriptions = {
  'To Do': 'Display skills with visual badges and hierarchical levels across domains.',
  'In Progress': 'Build a shareable, time-based portfolio of your achievements.',
  'Done': 'Communicate with peers, assign tasks, and share screens — all-in-one place.',
};

const TaskColumn = ({ title, tasks }) => (
  <div className="task-column dark-card">
    <div className="column-header">
      <span className="icon">{icons[title]}</span>
      <h2>{title}</h2>
    </div>
    <p className="description">{descriptions[title]}</p>
    {tasks && tasks.length > 0 ? (
      tasks.map(task => <TaskCard key={task.id} title={task.title} />)
    ) : (
      <p className="no-tasks">No tasks</p>
    )}
  </div>
);

export default TaskColumn;
