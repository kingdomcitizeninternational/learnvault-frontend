import React, { useEffect, useState, useMemo } from "react";
import styles from "./StudentDashboard.module.css";
import {
  FiHome,
  FiFolder,
  FiMessageSquare,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiInfo,
  FiPhone,
} from "react-icons/fi";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("materials");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const navigate = useNavigate();
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorInfo, setIsErrorInfo] = useState("");
  const [materials, setMaterials] = useState([]);
  const [filters, setFilters] = useState({
    date: "All",
    course: "All",
    author: "All",
    level: "All",
    search: "",
  });

  const { user } = useSelector((state) => state.userAuth);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen && isMobile ? "hidden" : "";
  }, [sidebarOpen, isMobile]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Fetch materials
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://learnvault-backend.onrender.com/api/user/materials", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        });

        const result = await response.json();
        console.log("Materials result:", result);

        const res = result?.response;
        if (response.status === 200 && Array.isArray(res?.materials)) {
          setMaterials(res.materials);
        } else {
          setIsError(true);
          const msg =
            typeof res?.message === "string"
              ? res.message
              : "Unable to load materials.";
          setIsErrorInfo(msg);
        }
      } catch (err) {
        console.error("Error loading materials:", err);
        setIsError(true);
        setIsErrorInfo("Network error while loading materials.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const closeModal = () => {
    setIsError(false);
    setIsErrorInfo("");
  };

  // 🔍 Unique options for filters
  const courses = useMemo(() => {
    return ["All", ...new Set(materials.map((m) => m.courseCode))];
  }, [materials]);

  const authors = useMemo(() => {
    return ["All", ...new Set(materials.map((m) => m.author))];
  }, [materials]);

  const levels = useMemo(() => {
    return ["All", ...new Set(materials.map((m) => m.level))];
  }, [materials]);

  const dateOptions = ["All", "Newest", "Oldest"];

  // 🧠 Filtering logic
  const filteredMaterials = useMemo(() => {
    let filtered = [...materials];

    // Date filter
    if (filters.date === "Newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.date === "Oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    // Course filter
    if (filters.course !== "All") {
      filtered = filtered.filter((m) => m.courseCode === filters.course);
    }

    // Author filter
    if (filters.author !== "All") {
      filtered = filtered.filter((m) => m.author === filters.author);
    }

    // Level filter
    if (filters.level !== "All") {
      filtered = filtered.filter((m) => m.level === filters.level);
    }

    // Search filter (title + tags)
    if (filters.search.trim() !== "") {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          (m.tags && m.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    return filtered;
  }, [materials, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <>
      {isLoading && <Loader />}
      {isError && <Modal closeModal={closeModal} content={isErrorInfo} />}

      <div className={styles.page}>
        {/* Sidebar */}
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen || !isMobile ? styles.open : ""
          }`}
        >
          <div className={styles.brandRow}>
            <div className={styles.brand}>
              <span className={styles.logo}>LearnVault</span>
            </div>
            {isMobile && (
              <button className={styles.closeBtn} onClick={closeSidebar}>
                <FiX />
              </button>
            )}
          </div>

          <div className={styles.profile}>
            <div className={styles.avatar}></div>
            <div className={styles.profileName}>
              {user ? user.name || "Student" : "Student"}
            </div>
          </div>

          <nav className={styles.nav}>
            {[
                         
                          { key: "dashboard", icon: <FiFolder />, label: "All Materials" },
                         
                          { key: "profile", icon: <FiUser />, label: "Profile" },
                        ].map(({ key, icon, label }) => (
              <button
                key={key}
                className={`${styles.navItem} ${
                  activeMenu === key ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveMenu(key);
                  if (isMobile) closeSidebar();
                    navigate(`/${key}`)
                }}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <button className={styles.logoutSmall}>
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {isMobile && (
          <div
            className={`${styles.overlay} ${
              sidebarOpen ? styles.overlayVisible : ""
            }`}
            onClick={closeSidebar}
          ></div>
        )}

        {/* Main content */}
        <main className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.leftControls}>
              {isMobile && (
                <button
                  className={styles.menuBtn}
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                >
                  <FiMenu />
                </button>
              )}
              <div className={styles.topTitle}>Find Course Materials</div>
            </div>

            <div className={styles.topLinks}>
             
              <button className={styles.logoutBtn}>
                <FiLogOut /> <span>Logout</span>
              </button>
            </div>
          </header>

          {/* Filters */}
<section className={styles.filtersWrap}>
  <div className={styles.filters}>
    <div className={styles.filterGroup}>
      <label htmlFor="date" className={styles.filterLabel}>
        Sort by Date
      </label>
      <select
        id="date"
        name="date"
        className={styles.select}
        value={filters.date}
        onChange={handleFilterChange}
      >
        {dateOptions.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>

    <div className={styles.filterGroup}>
      <label htmlFor="course" className={styles.filterLabel}>
        Course
      </label>
      <select
        id="course"
        name="course"
        className={styles.select}
        value={filters.course}
        onChange={handleFilterChange}
      >
        {courses.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>

    <div className={styles.filterGroup}>
      <label htmlFor="author" className={styles.filterLabel}>
        Author
      </label>
      <select
        id="author"
        name="author"
        className={styles.select}
        value={filters.author}
        onChange={handleFilterChange}
      >
        {authors.map((a) => (
          <option key={a}>{a}</option>
        ))}
      </select>
    </div>

    <div className={styles.filterGroup}>
      <label htmlFor="level" className={styles.filterLabel}>
        Level
      </label>
      <select
        id="level"
        name="level"
        className={styles.select}
        value={filters.level}
        onChange={handleFilterChange}
      >
        {levels.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
    </div>

    <div className={styles.filterGroup}>
      <label htmlFor="search" className={styles.filterLabel}>
        Search
      </label>
      <input
        id="search"
        className={styles.search}
        type="search"
        name="search"
        value={filters.search}
        onChange={handleSearch}
        placeholder="Search by title or keyword"
      />
    </div>
  </div>
</section>


          {/* Course cards */}
          <section className={styles.cardGrid}>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((c, idx) => (
                <article key={idx} className={styles.card} onClick={() => {navigate(`/course-detail/${c._id}`)}}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{c.title}</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.code}>{c.courseCode}</p>
                    <p className={styles.author}>By {c.author}</p>
                    <p className={styles.level}>Level: {c.level}</p>
                    <p className={styles.date}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                    <a
                      href={c.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadLink}
                    >
                      View / Download
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No materials match your filters.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default StudentDashboard;









