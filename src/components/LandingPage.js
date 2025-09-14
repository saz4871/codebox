
  import React, { useEffect } from "react";
  import "./Landingpage.css"; // ✅ Correct filename case
  import AOS from "aos";
  import "aos/dist/aos.css";
  import { Link } from "react-router-dom";

  const LandingPage = () => {
    useEffect(() => {
      AOS.init({ duration: 1000 });
    }, []);

    return (
      <div className="landing-container">
        <header className="landing-header">
          <h1 className="logo">CodeBox</h1>
          <nav className="nav-links">
            <div className="nav-link-row">
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
          </nav>
        </header>

        <section className="hero-section" id="home">
          <div className="hero-content" data-aos="fade-up">
            <h2>Showcase your potential, unlock new opportunities.</h2>
            <p>Track teams work, and collaborate in real-time.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn primary">Get Started</Link>
              <Link to="/login" className="btn secondary">Login</Link>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="feature" data-aos="fade-right">
            <h3>📊 Task Tracking</h3>
            <p>Display skills with visual badges and hierarchical levels across domains.</p>
          </div>
          <div className="feature" data-aos="fade-up">
            <h3>🕒 Timeline Experience</h3>
            <p>Build a shareable, time-based portfolio of your achievements.</p>
          </div>
          <div className="feature" data-aos="fade-left">
            <h3>🧑‍💻 Real-time Collaboration</h3>
            <p>Communicate with peers, assign tasks, and share screens — all-in-one place.</p>
          </div>
        </section>

        <footer className="landing-footer">
          <p>© 2025 CodeBox. Crafted for creators, learners, and collaborators.</p>
        </footer>
      </div>
    );
  };

  export default LandingPage;