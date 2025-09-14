import React from 'react';

const TaskCard = ({ title = 'Sample Task' }) => (
  <div className="task-card">
    <p>{title}</p>
  </div>
);

export default TaskCard;
