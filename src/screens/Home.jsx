import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Menu, X, BookOpen, Upload, Clock, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { title: "Physics Notes", course: "PHY 101", author: "Dr. Smith", date: "May 12, 2025" },
  { title: "Sociology Lecture", course: "SOC 102", author: "Dr. Johnson", date: "May 11, 2025" },
  { title: "Calculus Assignment", course: "MTH 101", author: "Prof. Williams", date: "May 10, 2025" },
];

const TESTIMONIALS = [
  { quote: "Saved my semester — fast and reliable.", author: "Ada, IS 300" },
  { quote: "Perfect for late-night revision sessions.", author: "Ben, Engr 200" },
  { quote: "Lecturers love the versioning & tags.", author: "Chioma, Econ 400" },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (to) => {
    setMenuOpen(false);
    if (to.startsWith("/")) return navigate(to);
    const el = document.querySelector(to);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      {/* NAV */}
      <header className={`${styles.navbar} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <button
            className={styles.brand}
            aria-label="Go to home"
            onClick={() => handleNav("#home")}
          >
            <img src="logo.png" alt="LearnVault" className={styles.logoImg} />
            <span className={styles.brandText}>LearnVault</span>
          </button>

          <nav className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`} aria-label="Main">
            <a onClick={() => handleNav("#home")}>Home</a>
            <a onClick={() => handleNav("#repository")}>Repository</a>
            <a onClick={() => handleNav("#about")}>About</a>
            <a onClick={() => handleNav("#contact")}>Contact</a>
            <button className={styles.mobileLogin} onClick={() => handleNav("/login")}>Login / Register</button>
            <button className={styles.closeMenu} onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X />
            </button>
          </nav>

          <div className={styles.actions}>
            <button className={styles.ctaSecondary} onClick={() => handleNav("/login")}>Login</button>
            <button className={styles.ctaPrimary} onClick={() => handleNav("/signup")}>Get Started</button>
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className={styles.title}>
              <span className={styles.titleAccent}>FUPRE resources</span>
              <br />
              organized for real study flow.
            </h1>
            <p className={styles.lead}>
              Fast search, smart tags, and one-click downloads — built for students who want results, not friction.
            </p>

            <div className={styles.heroActions}>
              <motion.button
                className={styles.primary}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleNav("/dashboard")}
              >
                Browse Materials
              </motion.button>
              <motion.button
                className={styles.ghost}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleNav("/signup")}
              >
                Create Account
              </motion.button>
            </div>

            <ul className={styles.badges} aria-hidden>
              <li><strong>10k+</strong> Materials</li>
              <li><strong>2k+</strong> Universities</li>
              <li><strong>1M+</strong> Downloads</li>
            </ul>
          </motion.div>

          <motion.figure
            className={styles.heroIllustration}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            aria-hidden
          >
            <div className={styles.illustrationCard}>
              <img src="/student reading.png" alt="" draggable="false" />
              <div className={styles.illOverlay} />
            </div>
          </motion.figure>
        </div>

        <div className={styles.heroGlow1} />
        <div className={styles.heroGlow2} />
      </section>

      {/* STATS STRIP */}
      <section className={styles.statsStrip} aria-hidden>
        <div className={styles.statsInner}>
          <div className={styles.stat}><strong>10,345</strong><span>materials</span></div>
          <div className={styles.stat}><strong>2,128</strong><span>universities</span></div>
          <div className={styles.stat}><strong>1M+</strong><span>downloads</span></div>
          <div className={styles.stat}><strong>99.9%</strong><span>uptime</span></div>
        </div>
      </section>

      {/* REPOSITORY / CARDS */}
      <section id="repository" className={styles.repoSection}>
        <div className={styles.sectionHeader}>
          <h2>Featured Materials</h2>
          <p>Curated and trending — hand-picked to help you study smarter.</p>
        </div>

        <div className={styles.controls}>
          <input className={styles.search} placeholder="Search by title, course code or author" aria-label="Search materials" />
          <div className={styles.filterGroup}>
            <select aria-label="Sort by" className={styles.select}>
              <option>Newest</option>
              <option>Most downloaded</option>
            </select>
          </div>
        </div>

        <div className={styles.cardGrid}>
          {CATEGORIES.map((c, idx) => (
            <motion.article
              key={c.title}
              className={styles.materialCard}
              whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(12,18,48,0.12)" }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>{c.title}</span>
                <span className={styles.cardTag}>{c.course}</span>
              </div>

              <p className={styles.cardMeta}>
                <strong>{c.author}</strong> • <time dateTime="2025-05-12">{c.date}</time>
              </p>

              <div className={styles.cardActions}>
                <button className={styles.cardBtn} onClick={() => handleNav(`/login`)}>
                  View
                </button>
                <button className={styles.cardDownload} onClick={() => handleNav(`/login`)}>
                  <BookOpen size={16} />
                  Download
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <div className={styles.repoFooter}>
          <button className={styles.ghostOutline} onClick={() => handleNav("/course-list")}>View all materials</button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.howSection} id="about">
        <div className={styles.sectionHeader}>
          <h2>How it works</h2>
          <p>Get set up in 3 minutes — upload, tag, and share.</p>
        </div>

        <div className={styles.howGrid}>
          <motion.div className={styles.howCard} whileHover={{ y: -6 }}>
            <UserCircle className={styles.howIcon} />
            <h4>Create account</h4>
            <p>Quick signup with email or university SSO.</p>
          </motion.div>

          <motion.div className={styles.howCard} whileHover={{ y: -6 }}>
            <Upload className={styles.howIcon} />
            <h4>Upload & Tag</h4>
            <p>Smart tags make materials instantly discoverable.</p>
          </motion.div>

          <motion.div className={styles.howCard} whileHover={{ y: -6 }}>
            <Clock className={styles.howIcon} />
            <h4>Access anytime</h4>
            <p>Offline-ready viewer and fast downloads.</p>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonialSection} aria-label="Testimonials">
        <div className={styles.sectionHeader}>
          <h2>Students love LearnVault</h2>
          <p>Real feedback from students using the platform daily.</p>
        </div>

        <div className={styles.testimonialGrid}>
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote key={i} className={styles.testimonial} whileHover={{ scale: 1.02 }}>
              <p className={styles.quote}>"{t.quote}"</p>
              <cite className={styles.author}>— {t.author}</cite>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <img src="logo.png" alt="LearnVault" className={styles.footerLogo} />
            <div>
              <strong>LearnVault</strong>
              <div className={styles.small}>Built for students, trusted by universities</div>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <a onClick={() => handleNav("/terms")}>Terms</a>
            <a onClick={() => handleNav("/privacy")}>Privacy</a>
            <a onClick={() => handleNav("#contact")}>Contact</a>
          </div>
        </div>

        <div className={styles.copy}>© {new Date().getFullYear()} LearnVault — All rights reserved</div>
      </footer>
    </div>
  );
}

