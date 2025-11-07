import React, { useState, useEffect } from "react";
import styles from "./Add-material.module.css";
import {useNavigate} from "react-router-dom";
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
  FiUploadCloud,
} from "react-icons/fi";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";
import ReactS3 from "react-s3";
window.Buffer = window.Buffer || require("buffer").Buffer;
const allowedMimeTypes = /application\/(pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-powerpoint)/i;

const AddMaterial = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("addMaterial");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    courseCode: "",
    description: "",
    author: "",
    department: "",
    level: "100",
    fileType: "pdf",
    fileUrl: "",
    tags: "",
  });

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorInfo, setIsErrorInfo] = useState("");
  const [success, setSuccess] = useState(false);

  const { user } = useSelector((state) => state.userAuth);

  // Responsive
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.type.match(allowedMimeTypes)) {
      alert("Only PDF, DOCX, and PPT files are allowed.");
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.courseCode || !formData.author || !file) {
      setIsError(true);
      setIsErrorInfo("Please fill all required fields and upload a file.");
      return;
    }

     setIsLoading(true);
    let fileUrl = "";

    // --- Upload to S3 ---
    const config = {
      dirName: process.env.REACT_APP_DIRNAME,
      bucketName: process.env.REACT_APP_BUCKETNAME,
      region: process.env.REACT_APP_REGION,
      accessKeyId: process.env.REACT_APP_ACCESSKEYID,
      secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY,
    };

    try {
      const response = await ReactS3.uploadFile(file, config);
      if (response.result.status !== 204) {
        throw new Error("Failed to upload file to S3.");
      }
      fileUrl = response.location;
    } catch (err) {
      console.error(err);
      setIsError(true);
      setIsErrorInfo("File upload failed. Please try again.");
      setIsLoading(false);
      return;
    }

    // --- Submit to backend API ---
    try {
      const payload = {
        ...formData,
        fileUrl,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      const res = await fetch("https://learnvault-backend.onrender.com/api/admin/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.status === 201) {
        setSuccess(true);
        setFormData({
          title: "",
          courseCode: "",
          description: "",
          author: "",
          department: "",
          level: "100",
          fileType: "pdf",
          fileUrl: "",
          tags: "",
        });
        setFile(null);
          setIsError(true);
      setIsErrorInfo("Upload was successfull");
      } else {
        setIsError(true);
        setIsErrorInfo(result?.message || "Failed to add material.");
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setIsErrorInfo("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsError(false);
    setIsErrorInfo("");
    setSuccess(false);
  };

  return (
    <>
      {isLoading && <Loader />}
      {isError && <Modal closeModal={closeModal} content={isErrorInfo} />}
      {success && <Modal closeModal={closeModal} content="Material added successfully!" />}

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
              <div className={styles.topTitle}>Add New Learning Material</div>
            </div>

            <div className={styles.topLinks}>
             
              <button className={styles.logoutBtn}>
                <FiLogOut /> <span>Logout</span>
              </button>
            </div>
          </header>

          {/* ====== FORM CONTENT ====== */}
          <section className={styles.formSection}>
            <form className={styles.materialForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div>
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter material title"
                    required
                  />
                </div>

                <div>
                  <label>Course Code *</label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    placeholder="e.g., CSC101"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div>
                  <label>Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter author name"
                    required
                  />
                </div>

                <div>
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter department"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div>
                  <label>Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                  >
                    {["100", "200", "300", "400", "Postgraduate", "Other"].map(
                      (lvl) => (
                        <option key={lvl}>{lvl}</option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label>File Type</label>
                  <select
                    name="fileType"
                    value={formData.fileType}
                    onChange={handleChange}
                  >
                    {["pdf", "docx", "ppt", "video", "link", "other"].map(
                      (t) => (
                        <option key={t}>{t}</option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fullWidth}>
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write a short description"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fullWidth}>
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., algorithms, AI, data structures"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fullWidth}>
                  <label>Upload File *</label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.ppt,.mp4"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <FiUploadCloud /> <span>Upload Material</span>
              </button>
            </form>
          </section>
        </main>
      </div>
    </>
  );
};

export default AddMaterial;

