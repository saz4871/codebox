import React from 'react';

const ScrumProcess = () => {
  const steps = [
    { icon: '📦', title: 'Product Backlog' },
    { icon: '📋', title: 'Sprint Planning' },
    { icon: '📥', title: 'Sprint Backlog' },
    { icon: '⚙️', title: 'Sprint (2-4 Weeks)' },
    { icon: '⏰', title: 'Daily Scrum' },
    { icon: '🧪', title: 'Review' },
    { icon: '✅', title: 'Finished Work' },
  ];

  return (
    <div className="scrum-process">
      <h2>Process</h2>
      <div className="process-steps">
        {steps.map((step, i) => (
          <div className="step" key={i}>
            <div className="icon">{step.icon}</div>
            <div className="title">{step.title}</div>
            {i !== steps.length - 1 && <div className="arrow">➡️</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrumProcess;
