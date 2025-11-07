import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { BookOpen, Upload, Clock, UserCircle, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuOpen(false);
    if (link === "home") navigate("/");
    if (link === "repository") navigate("/course-detail");
  };

  return (
    <div className={styles.container}>
      <header className={`${styles.navbar} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <div className={styles.logoSection}>
            <div className={styles.logoTextGroup}>
              <h1 className={styles.logoText} onClick={() => navigate("/")}>
                LearnVault
              </h1>
            </div>
          </div>

          
          <div className={styles.navActions}>
            <button
              className={styles.loginBtn}
              onClick={() => navigate("/login")}
            >
              Login / Register
            </button>
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <section className={styles.heroSection} id="home">
        <div className={styles.heroContent}>
          <h2>Your Digital Gateway to Academic Resources</h2>
          <p>
            Access, upload, and share learning materials anytime, anywhere with
            LearnVault.
          </p>
          <div className={styles.heroButtons}>
            <button
              className={styles.primaryBtn}
              onClick={() => navigate("/dashboard")}
            >
              Browse Materials
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className={styles.aboutSection} id="about">
        <div className={styles.aboutContent}>
          <div className={styles.textBlock}>
            <h3>What is LearnVault?</h3>
            <p>
              LearnVault is a digital repository that allows students and
              lecturers to upload, store, and access course materials online.
              Our goal is to make learning resources accessible to every student
              — anytime, anywhere.
            </p>
          </div>
          <div className={styles.imageBlock}>
            <img src="student reading.png" alt="Student reading" />
          </div>
        </div>
      </section>

      <section className={styles.latestSection} id="repository">
        <h3>Latest Uploaded Materials</h3>
        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <h4>Physics Notes</h4>
            <p>Course: Physics 101</p>
            <p>Uploaded by: Dr. Smith</p>
            <p>Uploaded: May 12, 2024</p>
          </div>
          <div className={styles.card}>
            <h4>Sociology Lecture</h4>
            <p>Course: Sociology 102</p>
            <p>Uploaded by: Dr. Johnson</p>
            <p>Uploaded: May 11, 2024</p>
          </div>
          <div className={styles.card}>
            <h4>Calculus Assignment</h4>
            <p>Course: Calculus I</p>
            <p>Uploaded by: Prof. Williams</p>
            <p>Uploaded: May 10, 2024</p>
          </div>
        </div>
        <button
          className={styles.viewAllBtn}
          onClick={() => navigate("/course-detail")}
        >
          View All Materials
        </button>
      </section>

      <section className={styles.howSection}>
        <h3>How It Works</h3>
        <div className={styles.howGrid}>
          <div className={styles.howCard}>
            <UserCircle className={styles.icon} />
            <h4>Register or Login</h4>
            <p>Create an account as a student or lecturer to access resources.</p>
          </div>
          <div className={styles.howCard}>
            <Upload className={styles.icon} />
            <h4>Upload or Browse</h4>
            <p>Lecturers can upload materials while students browse and download.</p>
          </div>
          <div className={styles.howCard}>
            <Clock className={styles.icon} />
            <h4>Access Anytime</h4>
            <p>Enjoy 24/7 access to all uploaded learning materials from any device.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} LearnVault. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;




