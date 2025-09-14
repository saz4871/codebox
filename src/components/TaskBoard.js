import React from 'react';
import TaskColumn from './TaskColumn';

const TaskBoard = ({ tasks }) => {
  // Filter tasks by status for each column
  const toDoTasks = tasks.filter(task => task.status === 'To Do' || task.status === 'Pending');
  const inProgressTasks = tasks.filter(task => task.status === 'InProgress' || task.status === 'In Progress');
  const doneTasks = tasks.filter(task => task.status === 'Done' || task.status === 'Completed');

  return (
    <div className="task-board">
      <TaskColumn title="To Do" tasks={toDoTasks} />
      <TaskColumn title="In Progress" tasks={inProgressTasks} />
      <TaskColumn title="Done" tasks={doneTasks} />
    </div>
  );
};

export default TaskBoard;
