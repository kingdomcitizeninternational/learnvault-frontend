import React, { useEffect, useState } from "react";
import styles from "./CourseDetail.module.css";
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
  FiDownload,
  FiFileText,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Modal from "../components/Modal";

const CourseDetail = () => {
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("materials");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  // New states for backend data & modal handling
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorInfo, setIsErrorInfo] = useState("");

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
  const closeModal = () => {
    setIsError(false);
    setIsErrorInfo("");
  };

  // ✅ Fetch single course
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://learnvault-backend.onrender.com/api/user/materials/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        });

        const result = await response.json();
        const res = result?.response;

        if (response.status === 200 && res?.material) {
          setCourse(res.material);
        } else {
          setIsError(true);
          const msg =
            typeof res?.message === "string"
              ? res.message
              : "Unable to load course details.";
          setIsErrorInfo(msg);
        }
      } catch (err) {
        console.error("Error loading course:", err);
        setIsError(true);
        setIsErrorInfo("Network error while loading course details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ===== UI render =====
  return (
    <>
      {isLoading && <Loader />}
      {isError && <Modal closeModal={closeModal} content={isErrorInfo} />}

      <div className={styles.page}>
        {/* ===== SIDEBAR ===== */}
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen || !isMobile ? styles.open : ""
          }`}
        >
          <div className={styles.brandRow}>
            <div className={styles.brand}>
              <span className={styles.logo}>MyStudy</span>
            </div>
            {isMobile && (
              <button className={styles.closeBtn} onClick={closeSidebar}>
                <FiX />
              </button>
            )}
          </div>

          <div className={styles.profile}>
            <div className={styles.avatar}></div>
            <div className={styles.profileName}>Student</div>
          </div>

          <nav className={styles.nav}>
            {[
              { key: "home", icon: <FiHome />, label: "Home" },
              { key: "materials", icon: <FiFolder />, label: "Find Materials" },
              { key: "discussion", icon: <FiMessageSquare />, label: "Discussion" },
              { key: "account", icon: <FiUser />, label: "Account" },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                className={`${styles.navItem} ${
                  activeMenu === key ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveMenu(key);
                  if (isMobile) closeSidebar();
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

        {/* Overlay for mobile */}
        {isMobile && (
          <div
            className={`${styles.overlay} ${
              sidebarOpen ? styles.overlayVisible : ""
            }`}
            onClick={closeSidebar}
          ></div>
        )}

        {/* ===== MAIN CONTENT ===== */}
        <main className={styles.main}>
          {/* Topbar */}
          <header className={styles.topbar}>
            <div className={styles.leftControls}>
              {isMobile && (
                <button className={styles.menuBtn} onClick={toggleSidebar}>
                  <FiMenu />
                </button>
              )}
              <div className={styles.topTitle}>Course Details</div>
            </div>

            <div className={styles.topLinks}>
              <a href="#home" className={styles.topLink}>
                <FiHome /> Home
              </a>
              <a href="#about" className={styles.topLink}>
                <FiInfo /> About
              </a>
              <a href="#contact" className={styles.topLink}>
                <FiPhone /> Contact
              </a>
              <button className={styles.logoutBtn}>
                <FiLogOut /> Logout
              </button>
            </div>
          </header>

          {/* ===== COURSE DETAILS ===== */}
          {course && (
            <section className={styles.detailContainer}>
              <h1 className={styles.detailTitle}>{course.title}</h1>

              <div className={styles.metaGrid}>
                <div>
                  <strong>Course Code:</strong> {course.courseCode}
                </div>
                <div>
                  <strong>Department:</strong> {course.department || "N/A"}
                </div>
                <div>
                  <strong>Course Level:</strong> {course.level}
                </div>
                <div>
                  <strong>Uploaded:</strong>{" "}
                  {new Date(course.createdAt).toDateString()}
                </div>
                <div>
                  <strong>Author:</strong> {course.author}
                </div>
              </div>

              <p className={styles.detailBody}>{course.description}</p>

              {/* FILE CARD */}
              <div className={styles.fileCard}>
                <div className={styles.fileHeader}>
                  <div className={styles.fileInfo}>
                    <FiFileText size={20} color="#004aad" />
                    <span>{course.title}</span>
                  </div>
                  <a
                    href={course.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadBtn}
                  >
                    <FiDownload /> Download Material
                  </a>
                </div>

                <div className={styles.fileDetails}>
                  <p>
                    <strong>File Type:</strong> {course.fileType || "PDF"}
                  </p>
                  <p>
                    <strong>File Size:</strong> {course.fileSize || "N/A"}
                  </p>
                  <p>
                    <strong>Pages:</strong> {course.pages || "N/A"}
                  </p>
                  <p>
                    <strong>Tags:</strong> {course.tags?.join(", ") || "None"}
                  </p>
                  <p>
                    <strong>Downloads:</strong> {course.downloads || 0}
                  </p>
                </div>
              </div>

              <div className={styles.accessBox}>
                <strong>Access Control:</strong> Students can view and download
                materials.
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default CourseDetail;


