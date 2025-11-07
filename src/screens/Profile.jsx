import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import {
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiMail,
  FiEdit,
} from "react-icons/fi";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StudentProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("profile");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  // Data state
  const [student, setStudent] = useState(null);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userAuth);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Disable scroll when sidebar is open (mobile)
  useEffect(() => {
    document.body.style.overflow = sidebarOpen && isMobile ? "hidden" : "";
  }, [sidebarOpen, isMobile]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?._id) return;
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://learnvault-backend.onrender.com/api/admin/users/${user._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            },
          }
        );

        const data = await res.json();

        if (res.status === 200) {
          // Backend response likely structured as { response: user }
          setStudent(data.response || data);
        } else {
          setIsError(true);
          setErrorInfo(data?.message || "Unable to load user profile.");
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setIsError(true);
        setErrorInfo("Network error while fetching user profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const closeModal = () => {
    setIsError(false);
    setErrorInfo("");
  };

  return (
    <>
      {isLoading && <Loader />}
      {isError && <Modal closeModal={closeModal} content={errorInfo} />}

      <div className={styles.page}>
        {/* Sidebar */}
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen || !isMobile ? styles.open : ""
          }`}
        >
          <div className={styles.brandRow}>
            <span className={styles.logo}>MyStudy</span>
            {isMobile && (
              <button className={styles.closeBtn} onClick={closeSidebar}>
                <FiX />
              </button>
            )}
          </div>

          <div className={styles.profile}>
            <div className={styles.avatar}></div>
            <div className={styles.profileName}>
              {student?.name || "Student"}
            </div>
          </div>

          <nav className={styles.nav}>
            {[
              { key: "dashboard", icon: <FiUser />, label: "Dashboard" },
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
                  navigate(`/${key}`);
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

        {/* Main Content */}
        <main className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.leftControls}>
              {isMobile && (
                <button className={styles.menuBtn} onClick={toggleSidebar}>
                  <FiMenu />
                </button>
              )}
              <div className={styles.topTitle}>Student Profile</div>
            </div>

            <button className={styles.logoutBtn}>
              <FiLogOut /> <span>Logout</span>
            </button>
          </header>

          {/* Profile Section */}
          <section className={styles.profileContainer}>
            {student ? (
              <>
                <div className={styles.profileHeader}>
                  <div className={styles.avatarLarge}></div>
                  <div className={styles.headerInfo}>
                    <h2 className={styles.studentName}>{student.name}</h2>
                    <p className={styles.studentID}>ID: {student._id}</p>
                    <button className={styles.editBtn}>
                      <FiEdit /> Edit Profile
                    </button>
                  </div>
                </div>

                <div className={styles.infoGrid}>
                  <div>
                    <FiMail /> {student.email}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>Loading your profile...</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default StudentProfile;
