import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScrumDashboard.css';
import { getProjects, getSprints, getTasks, createSprint } from '../api';
import TaskBoard from './TaskBoard';

// Import the external components
import ProductBacklog from './ProductBacklog';
import SprintBacklog from './SprintBacklog';
import Project from './Project';
import Chat from './chat'; // Fixed the import to use lowercase 'chat'

// SVG icons for the sidebar, styled to match the theme
const DashboardIcon = () => (<svg className="sidebar-svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>);
const ProjectsIcon = () => (<svg className="sidebar-svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 2.11L2.12 10.29a2.41 2.41 0 0 0 0 3.42l8.17 8.17a2.41 2.41 0 0 0 3.42 0l8.17-8.17a2.41 2.41 0 0 0 0-3.42L13.71 2.11a2.41 2.41 0 0 0-3.42 0z"/><path d="M8.5 8.5L15.5 15.5"/><path d="M8.5 15.5L15.5 8.5"/></svg>);
const ProductBacklogIcon = () => (<svg className="sidebar-svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>);
const SprintBacklogIcon = () => (<svg className="sidebar-svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.61"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const ChatIcon = () => (<svg className="sidebar-svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>);
const SettingsIcon = () => (<svg className="sidebar-svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09z"></path></svg>);
const LogoutIcon = () => (<svg className="sidebar-svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3H3v18h7M16 17l5-5-5-5M21 12H9"/></svg>);

const SidebarButton = ({ icon, text, onClick, isActive, isLogout }) => (
    <button onClick={onClick} className={`${isActive ? 'active' : ''} ${isLogout ? 'logout' : ''}`}>
        <span className="sidebar-icon">{icon}</span>
        <span className="sidebar-text">{text}</span>
    </button>
);

// DashboardContent component is kept as it is for the dashboard view
const DashboardContent = ({ projects, sprints, tasks, error, setError, loading, selectedTab, setSelectedTab, selectedProject, setSelectedProject, selectedPeriod, setSelectedPeriod, handleApplyFilters, openSprintsCount, storyPointsInBacklogs, handleCreateSprint, creatingSprint, navigate }) => {
    return (
        <>
            <nav className="scrum-tabs">
                <button className={selectedTab === 'overview-sp' ? 'active' : ''} onClick={() => setSelectedTab('overview-sp')}>CodeBox overview - SP</button>
                <button className={selectedTab === 'overview-estimate' ? 'active' : ''} onClick={() => setSelectedTab('overview-estimate')}>CodeBox overview - Estimate</button>
                <button className={selectedTab === 'sprint-detail' ? 'active' : ''} onClick={() => setSelectedTab('sprint-detail')}>Sprint detail</button>
                <button className={selectedTab === 'programmer' ? 'active' : ''} onClick={() => setSelectedTab('programmer')}>Programmer</button>
                <button className={selectedTab === 'dev-price' ? 'active' : ''} onClick={() => setSelectedTab('dev-price')}>Development price calculator</button>
            </nav>

            {error && (
                <div className="error-message">
                    <span>{error}</span>
                    <button className="close-btn" onClick={() => setError(null)}>&times;</button>
                </div>
            )}

            {loading ? (
                <div className="loading-message">Loading data...</div>
            ) : (
                <>
                    <div className="summary-cards">
                        <div className="card open-sprints">
                            <div className="card-title">Open Sprints</div>
                            <div className="card-value">{openSprintsCount}</div>
                            <div className="card-subtitle">total open sprints</div>
                        </div>
                        <div className="card story-points-backlogs">
                            <div className="card-title">Story Points in Backlogs</div>
                            <div className="card-value">{storyPointsInBacklogs}</div>
                            <div className="card-subtitle">in all open sprints</div>
                        </div>
                        <div className="card velocity">
                            <div className="card-title">Team Velocity</div>
                            <div className="card-value">25.5</div>
                            <div className="card-subtitle">avg story points/sprint</div>
                        </div>
                        <div className="card story-points-sprint">
                            <div className="card-title">Current Sprint Progress</div>
                            <div className="card-value">12 / 20</div>
                            <div className="card-subtitle">story points closed</div>
                        </div>
                    </div>

                    {/* Filters moved here */}
                    <div className="filter-controls">
                        <label>
                            Project
                            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                                <option value="">--- Select ---</option>
                                {projects.map(project => (
                                    <option key={project._id} value={project._id}>{project.name}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Period
                            <select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
                                <option value="last 90 days">last 90 days</option>
                                <option value="last 30 days">last 30 days</option>
                                <option value="last 7 days">last 7 days</option>
                            </select>
                        </label>
                        <button className="apply-btn" onClick={handleApplyFilters}>Apply ✓</button>
                    </div>

                    <div className="sprint-table-container">
                        <h3>Open sprints by project ({openSprintsCount})</h3>
                        <table className="sprint-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Project</th>
                                    <th>Milestone</th>
                                    <th>Due Date</th>
                                    <th>Capacity</th>
                                    <th>Story Points</th>
                                    <th>Closed SP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sprints.map(sprint => {
                                    const project = projects.find(p => p._id === sprint.projectId);
                                    return (
                                        <tr key={sprint._id}>
                                            <td><button className="expand-btn">+</button></td>
                                            <td>{project ? project.name : 'Unknown'}</td>
                                            <td>{sprint.milestone}</td>
                                            <td>{sprint.dueDate}</td>
                                            <td>{sprint.capacity}</td>
                                            <td>{sprint.storyPoints}</td>
                                            <td>{sprint.storyPointsClosed}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="actions">
                        <button className="new-sprint-btn" onClick={handleCreateSprint} disabled={creatingSprint || !selectedProject}>
                            {creatingSprint ? 'Creating...' : '+ NEW SPRINT'}
                        </button>
                    </div>

                    {tasks.length > 0 && (
                        <div className="task-board-container">
                            <h3>Tasks for selected project</h3>
                            <TaskBoard tasks={tasks} />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

const ScrumDashboard = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('dashboard');
    const [selectedTab, setSelectedTab] = useState('overview-sp');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('last 90 days');
    const [projects, setProjects] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [creatingSprint, setCreatingSprint] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Removed isSidebarExpanded state and toggleSidebar function

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                setProjects(response.data);
                if (response.data.length > 0) {
                    setSelectedProject(response.data[0]._id);
                }
            } catch (err) {
                setError('Failed to load projects. Please try again.');
            }
        };
        fetchProjects();
    }, []);

    const fetchData = async (projectId) => {
        if (!projectId) {
            setSprints([]);
            setTasks([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const [sprintsResponse, tasksResponse] = await Promise.all([
                getSprints(projectId),
                getTasks(projectId),
            ]);
            setSprints(sprintsResponse.data);
            setTasks(tasksResponse.data);
        } catch (err) {
            setError('Failed to load sprints or tasks. Check your connection or project ID.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeView === 'dashboard') {
            fetchData(selectedProject);
        }
    }, [selectedProject, activeView]);

    const handleApplyFilters = () => {
        fetchData(selectedProject);
    };

    const handleCreateSprint = async () => {
        if (!selectedProject) {
            setError('Please select a project before creating a sprint.');
            return;
        }
        setCreatingSprint(true);
        setError(null);
        try {
            const newSprintData = {
                milestone: `Sprint #${sprints.length + 1}`,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                capacity: 20,
                storyPoints: 0,
                storyPointsClosed: 0,
                projectId: selectedProject,
            };
            await createSprint(selectedProject, newSprintData);
            await fetchData(selectedProject);
        } catch (err) {
            setError('Failed to create sprint. Please check your project settings.');
        } finally {
            setCreatingSprint(false);
        }
    };

    const openSprintsCount = sprints.length;
    const storyPointsInBacklogs = sprints.reduce((acc, sprint) => acc + sprint.storyPoints, 0);

    const handleLogout = () => {
        navigate('/');
    };

    // The switch statement is updated to render the imported components
    const renderMainContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <DashboardContent
                        projects={projects}
                        sprints={sprints}
                        tasks={tasks}
                        error={error}
                        setError={setError}
                        loading={loading}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        selectedProject={selectedProject}
                        setSelectedProject={setSelectedProject}
                        selectedPeriod={selectedPeriod}
                        setSelectedPeriod={setSelectedPeriod}
                        handleApplyFilters={handleApplyFilters}
                        openSprintsCount={openSprintsCount}
                        storyPointsInBacklogs={storyPointsInBacklogs}
                        handleCreateSprint={handleCreateSprint}
                        creatingSprint={creatingSprint}
                        navigate={navigate}
                    />
                );
            case 'projects':
                return <Project />;
            case 'product-backlog':
                return <ProductBacklog />;
            case 'sprint-backlog':
                return <SprintBacklog />;
            case 'chat':
                return <Chat />;
            default:
                return (
                    <DashboardContent
                        projects={projects}
                        sprints={sprints}
                        tasks={tasks}
                        error={error}
                        setError={setError}
                        loading={loading}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        selectedProject={selectedProject}
                        setSelectedProject={setSelectedProject}
                        selectedPeriod={selectedPeriod}
                        setSelectedPeriod={setSelectedPeriod}
                        handleApplyFilters={handleApplyFilters}
                        openSprintsCount={openSprintsCount}
                        storyPointsInBacklogs={storyPointsInBacklogs}
                        handleCreateSprint={handleCreateSprint}
                        creatingSprint={creatingSprint}
                        navigate={navigate}
                    />
                );
        }
    };

    return (
        <div className={`scrum-dashboard`}>
            <header className="scrum-header">
                <div className="logo">CodeBox</div>
                <div className="header-right">
                    {/* User button removed */}
                </div>
            </header>

            <aside className="sidebar">
                <div className="sidebar-top">
                    <SidebarButton
                        icon={<DashboardIcon />}
                        text="Dashboard"
                        onClick={() => setActiveView('dashboard')}
                        isActive={activeView === 'dashboard'}
                    />
                    <SidebarButton
                        icon={<ProjectsIcon />}
                        text="Projects"
                        onClick={() => setActiveView('projects')}
                        isActive={activeView === 'projects'}
                    />
                    <SidebarButton
                        icon={<ProductBacklogIcon />}
                        text="Product Backlog"
                        onClick={() => setActiveView('product-backlog')}
                        isActive={activeView === 'product-backlog'}
                    />
                    <SidebarButton
                        icon={<SprintBacklogIcon />}
                        text="Sprint Backlog"
                        onClick={() => setActiveView('sprint-backlog')}
                        isActive={activeView === 'sprint-backlog'}
                    />
                    <SidebarButton
                        icon={<ChatIcon />}
                        text="Chat"
                        onClick={() => setActiveView('chat')}
                        isActive={activeView === 'chat'}
                    />
                    <SidebarButton icon={<SettingsIcon />} text="Settings" />
                </div>
                <SidebarButton
                    icon={<LogoutIcon />}
                    text="Logout"
                    onClick={handleLogout}
                    isLogout
                />
            </aside>

            <main>
                <div key={activeView} className="main-content-wrapper">
                    {activeView === 'dashboard' && <h2 className="page-heading">Dashboard</h2>}
                    {activeView === 'projects' && <h2 className="page-heading">Projects</h2>}
                    {activeView === 'product-backlog' && <h2 className="page-heading">Product Backlog</h2>}
                    {activeView === 'sprint-backlog' && <h2 className="page-heading">Sprint Backlog</h2>}
                    {activeView === 'chat' && <h2 className="page-heading">Chat</h2>}
                    {renderMainContent()}
                </div>
            </main>
        </div>
    );
};

export default ScrumDashboard;