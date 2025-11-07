import React, { useEffect, useState, useMemo } from "react";
import styles from "./StudentDashboard.module.css"; // reuse styling
import {
  FiHome,
  FiFolder,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiTrash2,
  FiInfo,
  FiPhone,
} from "react-icons/fi";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("materials");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
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
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userAuth);

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

  // 🧩 Fetch materials
  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://learnvault-backend.onrender.com/api/admin/materials", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      const result = await response.json();
      const res = result?.response;

      if (response.status === 200 && Array.isArray(res)) {
        setMaterials(res);
      } else {
        setIsError(true);
        setIsErrorInfo(res?.message || "Unable to load materials.");
      }

    } catch (err) {
      console.error("Error loading materials:", err);
      setIsError(true);
      setIsErrorInfo("Network error while loading materials.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const closeModal = () => {
    setIsError(false);
    setIsErrorInfo("");
  };

  // 🧹 Delete material
  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch(`https://learnvault-backend.onrender.com/api/admin/materials/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      const result = await response.json();

      if (response.status === 200) {
        setMaterials((prev) => prev.filter((m) => m._id !== id));
      } else {
        alert(result?.response?.message || "Failed to delete material.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error while deleting material.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔍 Filters
  const courses = useMemo(() => ["All", ...new Set(materials.map((m) => m.courseCode))], [materials]);
  const authors = useMemo(() => ["All", ...new Set(materials.map((m) => m.author))], [materials]);
  const levels = useMemo(() => ["All", ...new Set(materials.map((m) => m.level))], [materials]);
  const dateOptions = ["All", "Newest", "Oldest"];

  const filteredMaterials = useMemo(() => {
    let filtered = [...materials];
    if (filters.date === "Newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (filters.date === "Oldest") filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (filters.course !== "All") filtered = filtered.filter((m) => m.courseCode === filters.course);
    if (filters.author !== "All") filtered = filtered.filter((m) => m.author === filters.author);
    if (filters.level !== "All") filtered = filtered.filter((m) => m.level === filters.level);
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

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSearch = (e) => setFilters({ ...filters, search: e.target.value });

  return (
    <>
      {isLoading && <Loader />}
      {isError && <Modal closeModal={closeModal} content={isErrorInfo} />}

      <div className={styles.page}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen || !isMobile ? styles.open : ""}`}>
          <div className={styles.brandRow}>
            <div className={styles.brand}>
              <span className={styles.logo}>LearnVault Admin</span>
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
              {user ? user.name || "Admin" : "Admin"}
            </div>
          </div>

          <nav className={styles.nav}>
            {[
              { key: "admin-dashboard", icon: <FiFolder />, label: "All Materials" },
              { key: "add-material", icon: <FiUser />, label: "Add Materials" },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                className={`${styles.navItem} ${activeMenu === key ? styles.active : ""}`}
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
            className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
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
              <div className={styles.topTitle}>Manage Course Materials</div>
            </div>

            <div className={styles.topLinks}>
              <button className={styles.logoutBtn}>
                <FiLogOut /> <span>Logout</span>
              </button>
            </div>
          </header>

          {/* Filters (reuse from student version) */}
          <section className={styles.filtersWrap}>
            <div className={styles.filters}>
              {[
                { id: "date", label: "Sort by Date", options: dateOptions },
                { id: "course", label: "Course", options: courses },
                { id: "author", label: "Author", options: authors },
                { id: "level", label: "Level", options: levels },
              ].map(({ id, label, options }) => (
                <div key={id} className={styles.filterGroup}>
                  <label htmlFor={id} className={styles.filterLabel}>
                    {label}
                  </label>
                  <select
                    id={id}
                    name={id}
                    className={styles.select}
                    value={filters[id]}
                    onChange={handleFilterChange}
                  >
                    {options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}

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
                <article key={idx} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{c.title}</h3>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(c._id, c.title)}
                      title="Delete material"
                    >
                      <FiTrash2 />
                    </button>
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
                <p>No materials found.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
