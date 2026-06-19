import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Code, Database, ShieldAlert, Activity, Mail, X, Save, RefreshCw, GraduationCap, Trash2, Plus, Globe, Network, Award, Eye, EyeOff, User, Upload, Download } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ORBIT_ICONS } from '../../data/OrbitIcons';
import { CERT_ICONS } from './CertificationsWall';
import { SOCIAL_ICONS } from './ContactStation';
import { auth, storage } from '../../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { pdfjs } from 'react-pdf';
import Cropper from 'react-easy-crop';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function VisualGridPicker({ localCertifications, currentSlot, onSelectSlot, onClose }) {
  const HEX_R = 25;
  const HEX_A = HEX_R * Math.sqrt(3) / 2;
  const hexElements = [];
  let slotIndex = 1;

  for (let r = 3; r >= -3; r--) {
    for (let c = -4; c <= 4; c++) {
      const x = c * (1.5 * HEX_R);
      const y = -r * 2 * HEX_A - (Math.abs(c) % 2 === 1 ? HEX_A : 0);

      const thisSlot = String(slotIndex);
      const isTakenByOther = localCertifications.some(cert => String(cert.slot || '32') === thisSlot) && thisSlot !== String(currentSlot);
      const isCurrent = thisSlot === String(currentSlot);

      let fill = 'rgba(0, 255, 255, 0.05)';
      let stroke = 'rgba(0, 255, 255, 0.2)';
      if (isCurrent) {
        fill = 'rgba(0, 255, 255, 0.5)';
        stroke = '#00f3ff';
      } else if (isTakenByOther) {
        fill = 'rgba(255, 0, 85, 0.2)';
        stroke = '#ff0055';
      }

      const currentIdx = slotIndex;

      const points = [
        [x - HEX_R, y],
        [x - HEX_R / 2, y - HEX_A],
        [x + HEX_R / 2, y - HEX_A],
        [x + HEX_R, y],
        [x + HEX_R / 2, y + HEX_A],
        [x - HEX_R / 2, y + HEX_A]
      ].map(p => p.join(',')).join(' ');

      hexElements.push(
        <g
          key={`slot-${c}-${r}`}
          onClick={() => { if (!isTakenByOther) onSelectSlot(String(currentIdx)); }}
          style={{ cursor: isTakenByOther ? 'not-allowed' : 'pointer' }}
          className={!isTakenByOther && !isCurrent ? "hex-hover" : ""}
        >
          <polygon
            points={points}
            fill={fill}
            stroke={stroke}
            strokeWidth="1"
            style={{ transition: 'all 0.2s' }}
          />
          <text x={x} y={y + 1} fill="#fff" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: 'none' }}>
            {thisSlot}
          </text>
        </g>
      );
      slotIndex++;
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.8)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <style>{`
        .hex-hover:hover polygon {
          fill: rgba(0, 255, 255, 0.3) !important;
          stroke: #00f3ff !important;
        }
      `}</style>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: '#0a0f1e', padding: '20px', borderRadius: '8px', border: '1px solid #00f3ff', position: 'relative',
          width: '800px', height: '600px', display: 'flex', flexDirection: 'column'
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: '#ff00ff', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        <h2 style={{ color: '#00f3ff', fontFamily: 'var(--font-mono)', textAlign: 'center', marginTop: 0 }}>CHOOSE GRID SLOT</h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fff' }}><div style={{ width: 12, height: 12, background: 'rgba(0, 255, 255, 0.5)' }}></div> Current Selection</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fff' }}><div style={{ width: 12, height: 12, background: 'rgba(0, 255, 255, 0.05)', border: '1px solid rgba(0, 255, 255, 0.2)' }}></div> Available</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fff' }}><div style={{ width: 12, height: 12, background: 'rgba(255, 0, 85, 0.2)' }}></div> Occupied</div>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg viewBox="-250 -150 520 280" style={{ width: '100%', height: '100%' }}>
            {hexElements}
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminDashboard({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('Core Skills');
  const { coreSkills, setCoreSkills, featuredProjects, setFeaturedProjects, showcaseProjects, setShowcaseProjects, orbitSkills, setOrbitSkills, educationData, setEducationData, certifications, setCertifications, messages, setMessages, socialLinks, setSocialLinks, aboutMe, setAboutMe, resetToDefault, saveAllData } = usePortfolio();

  const [localSkills, setLocalSkills] = useState([]);
  const [localProjects, setLocalProjects] = useState([]);
  const [localShowcaseProjects, setLocalShowcaseProjects] = useState([]);
  const [localOrbitSkills, setLocalOrbitSkills] = useState({ inner: [], middle: [], outer: [] });
  const [localEducation, setLocalEducation] = useState([]);
  const [localCertifications, setLocalCertifications] = useState([]);
  const [localSocialLinks, setLocalSocialLinks] = useState([]);
  const [localAboutMe, setLocalAboutMe] = useState({});

  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Form states for new orbit skill
  const [newOrbitSkill, setNewOrbitSkill] = useState('');
  const [newOrbitLevel, setNewOrbitLevel] = useState('outer');

  const [gridPickerCertIdx, setGridPickerCertIdx] = useState(null);
  const [autoSave, setAutoSave] = useState(false);

  // Cropper states
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (!autoSave || !isAuthenticated || !isOpen) return;

    const timeout = setTimeout(async () => {
      const btn = document.getElementById('save-btn');
      if (btn) {
        btn.innerText = 'AUTO-SAVING...';
        btn.style.opacity = '0.7';
        btn.style.pointerEvents = 'none';
      }

      setAboutMe(localAboutMe);
      setCoreSkills(localSkills);
      setFeaturedProjects(localProjects);
      setShowcaseProjects(localShowcaseProjects);
      setOrbitSkills(localOrbitSkills);
      setEducationData(localEducation);
      setCertifications(localCertifications);
      setSocialLinks(localSocialLinks);

      try {
        await saveAllData({
          coreSkills: localSkills,
          featuredProjects: localProjects,
          showcaseProjects: localShowcaseProjects,
          orbitSkills: localOrbitSkills,
          aboutMe: localAboutMe,
          educationData: localEducation,
          certifications: localCertifications,
          socialLinks: localSocialLinks
        });

        if (btn) {
          btn.innerText = 'SAVED!';
          btn.style.background = '#00ff88';
          btn.style.color = '#000';
          btn.style.opacity = '1';
          setTimeout(() => {
            btn.innerText = 'SAVE TO DATABASE';
            btn.style.background = '#00f3ff';
            btn.style.pointerEvents = 'auto';
          }, 1500);
        }
      } catch (err) {
        if (btn) {
          btn.innerText = 'SAVE FAILED!';
          btn.style.background = '#ff0033';
          btn.style.color = '#fff';
          btn.style.opacity = '1';
          setTimeout(() => {
            btn.innerText = 'SAVE TO DATABASE';
            btn.style.background = '#00f3ff';
            btn.style.pointerEvents = 'auto';
          }, 3000);
        }
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [
    autoSave, isAuthenticated, isOpen,
    localSkills, localProjects, localShowcaseProjects,
    localOrbitSkills, localEducation, localCertifications,
    localSocialLinks, localAboutMe
  ]);

  useEffect(() => {
    if (isOpen) {
      setLocalSkills([...coreSkills]);
      setLocalProjects([...featuredProjects]);
      setLocalShowcaseProjects([...showcaseProjects]);
      setLocalOrbitSkills({
        inner: [...(orbitSkills.inner || [])],
        middle: [...(orbitSkills.middle || [])],
        outer: [...(orbitSkills.outer || [])]
      });
      setLocalEducation([...educationData]);
      setLocalCertifications([...certifications]);
      setLocalSocialLinks([...(socialLinks || [])]);
      setLocalAboutMe({ ...aboutMe });
    } else {
      // Reset auth state when closed
      setIsAuthenticated(false);
      setUsernameInput('');
      setPasswordInput('');
      setLoginError('');
      signOut(auth).catch(console.error);
    }
  }, [isOpen, coreSkills, featuredProjects, showcaseProjects, orbitSkills, educationData, certifications, socialLinks, aboutMe]);

  const tabs = [
    { name: 'About Me', icon: <User size={18} /> },
    { name: 'Core Skills', icon: <Activity size={18} /> },
    { name: 'Featured Projects', icon: <Database size={18} /> },
    { name: '3D Project Cards', icon: <Code size={18} /> },
    { name: 'Orbit Skills', icon: <Network size={18} /> },
    { name: 'Certifications', icon: <Award size={18} /> },
    { name: 'Journey Timeline', icon: <GraduationCap size={18} /> },
    { name: 'Contact Links', icon: <Globe size={18} /> },
    { name: 'Messages', icon: <Mail size={18} /> },
    { name: 'System Reset', icon: <Settings size={18} /> },
  ];

  const updateSkill = (index, field, value) => {
    const updated = [...localSkills];
    updated[index] = { ...updated[index], [field]: field === 'percent' ? Number(value) : value };
    setLocalSkills(updated);
  };

  const updateProject = (index, field, value) => {
    const updated = [...localProjects];
    updated[index] = { ...updated[index], [field]: field === 'percent' ? Number(value) : value };
    setLocalProjects(updated);
  };

  const updateShowcaseProject = (index, field, value) => {
    setLocalShowcaseProjects(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateEducation = (index, field, value) => {
    setLocalEducation(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addProject = () => {
    setLocalProjects([...localProjects, { id: Date.now().toString(), title: 'NEW PROJECT', desc: 'Project description here...', percent: 50 }]);
  };

  const deleteProject = (index) => {
    setLocalProjects(localProjects.filter((_, i) => i !== index));
  };

  const addShowcaseProject = () => {
    setLocalShowcaseProjects([...localShowcaseProjects, { id: Date.now().toString(), title: 'NEW SHOWCASE', desc: 'Detailed description here...', viewProjectLink: 'https://github.com', techStack: 'React, Three.js' }]);
  };

  const deleteShowcaseProject = (index) => {
    setLocalShowcaseProjects(localShowcaseProjects.filter((_, i) => i !== index));
  };

  const addOrbitSkill = () => {
    if (!newOrbitSkill || !ORBIT_ICONS[newOrbitSkill]) return; // Only add valid predefined skills
    const updated = { ...localOrbitSkills };
    updated[newOrbitLevel] = [...updated[newOrbitLevel], newOrbitSkill];
    setLocalOrbitSkills(updated);
    setNewOrbitSkill(''); // clear input
  };

  const deleteOrbitSkill = (level, index) => {
    const updated = { ...localOrbitSkills };
    updated[level] = updated[level].filter((_, i) => i !== index);
    setLocalOrbitSkills(updated);
  };

  const addEducation = () => {
    setLocalEducation([...localEducation, { id: Date.now(), type: 'education', year: 'YYYY', institution: 'New Institution', degree: 'Degree or Role', roleText: 'Role', details: 'Description of your experience.' }]);
  };

  const deleteEducation = (index) => {
    setLocalEducation(localEducation.filter((_, i) => i !== index));
  };

  const updateCert = (index, field, value) => {
    const updated = [...localCertifications];
    updated[index] = { ...updated[index], [field]: value };
    setLocalCertifications(updated);
  };

  const addCert = () => {
    const usedSlots = new Set(localCertifications.map(c => c.slot));
    let newSlot = '32'; // Default starting point (center)

    // If 32 is used, find the next available slot
    if (usedSlots.has(newSlot)) {
      for (let i = 1; i <= 63; i++) {
        if (!usedSlots.has(String(i))) {
          newSlot = String(i);
          break;
        }
      }
    }

    setLocalCertifications([...localCertifications, { id: Date.now(), name: 'New Certificate', issuer: 'Issuer', status: 'ACTIVE', level: '01', icon: 'Award', slot: newSlot }]);
  };

  const deleteCert = (index) => {
    setLocalCertifications(localCertifications.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index, field, value) => {
    const updated = [...localSocialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setLocalSocialLinks(updated);
  };

  const addSocialLink = () => {
    setLocalSocialLinks([...localSocialLinks, { id: Date.now(), platform: 'Website', url: 'https://example.com', color: '#00ffff' }]);
  };

  const deleteSocialLink = (index) => {
    setLocalSocialLinks(localSocialLinks.filter((_, i) => i !== index));
  };

  const processPdfToImage = async (file, callback) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjs.getDocument({
          data: typedarray,
          standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
          cMapPacked: true,
        }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 }); // 2.0 for high resolution

        const MAX_DIM = 800;
        let finalWidth = viewport.width;
        let finalHeight = viewport.height;
        if (finalWidth > finalHeight && finalWidth > MAX_DIM) {
          finalHeight = finalHeight * (MAX_DIM / finalWidth);
          finalWidth = MAX_DIM;
        } else if (finalHeight >= finalWidth && finalHeight > MAX_DIM) {
          finalWidth = finalWidth * (MAX_DIM / finalHeight);
          finalHeight = MAX_DIM;
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        // Resize down to save space before converting to base64
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = Math.floor(finalWidth);
        resizedCanvas.height = Math.floor(finalHeight);
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCtx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);

        // Convert to highly compressed WEBP
        const dataUrl = resizedCanvas.toDataURL('image/webp', 0.6);
        callback(dataUrl);
      } catch (e) {
        console.error("PDF processing error:", e);
        alert("Failed to process PDF: " + (e.message || "Unknown error"));
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      if (file.size > 30 * 1024 * 1024) {
        alert("PDF is too large! The maximum supported size is 30MB.");
        return;
      }
      const label = event.target.parentElement;
      const originalText = label.innerHTML;
      label.innerText = "PROCESSING PDF...";
      label.style.opacity = "0.7";
      
      processPdfToImage(file, (dataUrl) => {
        updateCert(index, 'imageUrl', dataUrl);
        label.innerHTML = originalText;
        label.style.opacity = "1";
        event.target.value = ''; // Reset input
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/webp', 0.6);
        updateCert(index, 'imageUrl', dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset input
  };

  const handleShowcaseImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/webp', 0.6);
        updateShowcaseProject(index, 'image', dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset input
  };

  const handleEducationImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      if (file.size > 30 * 1024 * 1024) {
        alert("PDF is too large! The maximum supported size is 30MB.");
        return;
      }
      const label = event.target.parentElement;
      const originalText = label.innerHTML;
      label.innerText = "PROCESSING PDF...";
      label.style.opacity = "0.7";
      
      processPdfToImage(file, (dataUrl) => {
        updateEducation(index, 'imageUrl', dataUrl);
        label.innerHTML = originalText;
        label.style.opacity = "1";
        event.target.value = ''; // Reset input
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/webp', 0.6);
        updateEducation(index, 'imageUrl', dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCropImageSrc(e.target.result);
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset input
  };

  const finishCropping = async () => {
    try {
      const croppedImage = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      setLocalAboutMe({ ...localAboutMe, profileImage: croppedImage });
      setCropImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (e) {
      console.error(e);
    }
  };

  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          image,
          pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
          0, 0, pixelCrop.width, pixelCrop.height
        );
        // Resize down if needed to max 400x400 to save space
        const MAX_SIZE = 400;
        if (canvas.width > MAX_SIZE) {
          const resizedCanvas = document.createElement('canvas');
          resizedCanvas.width = MAX_SIZE;
          resizedCanvas.height = MAX_SIZE;
          const resizedCtx = resizedCanvas.getContext('2d');
          resizedCtx.drawImage(canvas, 0, 0, MAX_SIZE, MAX_SIZE);
          resolve(resizedCanvas.toDataURL('image/webp', 0.7));
        } else {
          resolve(canvas.toDataURL('image/webp', 0.7));
        }
      };
      image.onerror = (error) => reject(error);
    });
  };

  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      console.error("File is too large. Maximum size is 20MB.");
      return;
    }

    setIsUploadingResume(true);
    setUploadProgress(0);
    
    // For files under 700KB, we can safely bypass Firebase Storage completely 
    // and just save it as a base64 string directly in the database (since the limit is 1MB).
    if (file.size < 700 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalAboutMe(prev => ({ ...prev, resumeUrl: e.target.result }));
        setIsUploadingResume(false);
        setUploadProgress(100);
      };
      reader.readAsDataURL(file);
      return;
    }

    // For larger files (up to 20MB), we must use Firebase Storage
    try {
      const fileExtension = file.name.split('.').pop();
      const storageRef = ref(storage, `resume/resume_${Date.now()}.${fileExtension}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        }, 
        (error) => {
          console.error("Error uploading resume:", error);
          setIsUploadingResume(false);
          setUploadProgress(0);
        }, 
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setLocalAboutMe(prev => ({ ...prev, resumeUrl: downloadURL }));
          } catch (err) {
            console.error("Error getting download URL:", err);
          } finally {
            setIsUploadingResume(false);
            setUploadProgress(0);
          }
        }
      );
    } catch (error) {
      console.error("Error initiating upload:", error);
      setIsUploadingResume(false);
      setUploadProgress(0);
    }
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0, 255, 255, 0.3)',
    color: '#00f3ff', padding: '8px', borderRadius: '4px', fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem', outline: 'none', width: '100%', boxSizing: 'border-box'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center',
            background: 'rgba(2, 6, 12, 0.6)',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
            style={{
              width: '1100px', maxWidth: '98vw', height: '90vh', maxHeight: '900px', background: 'rgba(10, 15, 30, 0.8)',
              border: '1px solid rgba(0, 255, 255, 0.3)', borderRadius: '16px',
              boxShadow: '0 0 50px rgba(0, 255, 255, 0.1)', display: 'flex', overflow: 'hidden', position: 'relative'
            }}
          >
            {!isAuthenticated ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'var(--font-mono)' }}>
                <ShieldAlert size={64} color="#ff00ff" style={{ marginBottom: '20px', filter: 'drop-shadow(0 0 10px #ff00ff)' }} />
                <h2 style={{ color: '#00f3ff', fontSize: '2rem', marginBottom: '10px', textShadow: '0 0 10px #00f3ff' }}>SECURE ACCESS</h2>
                <p style={{ color: '#888', marginBottom: '30px' }}>Enter credentials to access Admin Panel</p>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await signInWithEmailAndPassword(auth, usernameInput, passwordInput);
                    setIsAuthenticated(true);
                    setLoginError('');
                  } catch (error) {
                    setLoginError('ACCESS DENIED: Invalid credentials');
                    console.error("Auth Error:", error);
                  }
                }} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
                  <input
                    type="email"
                    placeholder="ADMIN EMAIL"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    style={{ ...inputStyle, padding: '12px', fontSize: '1rem' }}
                    autoFocus
                  />
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="PASSWORD"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      style={{ ...inputStyle, padding: '12px', fontSize: '1rem', paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', color: '#00f3ff', cursor: 'pointer', padding: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {loginError && <div style={{ color: '#ff0055', fontSize: '0.8rem', textAlign: 'center' }}>{loginError}</div>}

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 243, 255, 0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    style={{ background: 'transparent', border: '1px solid #00f3ff', color: '#00f3ff', padding: '12px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 'bold', letterSpacing: '2px', borderRadius: '4px', marginTop: '10px' }}
                  >
                    AUTHENTICATE
                  </motion.button>
                </form>

                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.2, rotate: 90, filter: 'drop-shadow(0 0 15px #ff00ff)' }}
                  whileTap={{ scale: 0.9 }}
                  style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#ff00ff', cursor: 'pointer', filter: 'drop-shadow(0 0 8px #ff00ff)', zIndex: 100 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
            ) : (
              <>
                {/* Sidebar */}
                <div style={{ width: '250px', background: 'rgba(0, 0, 0, 0.4)', borderRight: '1px solid rgba(0, 255, 255, 0.1)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', color: '#00f3ff' }}>
                    <ShieldAlert size={24} />
                    <h2 style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '1.2rem', letterSpacing: '2px' }}>ADMIN_SYS</h2>
                  </div>

                  {tabs.map(tab => (
                    <motion.button
                      whileHover={{ x: 5, backgroundColor: 'rgba(0, 255, 255, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                        background: activeTab === tab.name ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                        border: 'none', borderLeft: activeTab === tab.name ? '3px solid #00f3ff' : '3px solid transparent',
                        color: activeTab === tab.name ? '#00f3ff' : '#888',
                        fontFamily: 'var(--font-mono)', fontSize: '0.9rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {tab.icon} {tab.name}
                    </motion.button>
                  ))}
                </div>

                {/* Main Content Area */}
                <div style={{ flex: 1, padding: '3rem', position: 'relative', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h1 style={{ color: '#fff', margin: 0, fontFamily: 'var(--font-header)', fontSize: '2rem' }}>
                      {activeTab.toUpperCase()}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                      {(activeTab === 'About Me' || activeTab === 'Core Skills' || activeTab === 'Featured Projects' || activeTab === '3D Project Cards' || activeTab === 'Orbit Skills' || activeTab === 'Certifications' || activeTab === 'Journey Timeline' || activeTab === 'Contact Links') && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: '0 0 15px #ff00ff' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const backupData = {
                              coreSkills: localSkills,
                              featuredProjects: localProjects,
                              showcaseProjects: localShowcaseProjects,
                              orbitSkills: localOrbitSkills,
                              aboutMe: localAboutMe,
                              educationData: localEducation,
                              certifications: localCertifications,
                              socialLinks: localSocialLinks,
                              exportDate: new Date().toISOString()
                            };
                            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `portfolio_backup_${Date.now()}.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          style={{ background: 'transparent', color: '#ff00ff', border: '1px solid #ff00ff', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', transition: 'all 0.3s' }}
                        >
                          <Download size={16} /> EXPORT BACKUP
                        </motion.button>

                        <label style={{ cursor: 'pointer' }}>
                          <input 
                            type="file" 
                            accept=".json"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                try {
                                  const data = JSON.parse(event.target.result);
                                  if (data.coreSkills) setLocalSkills(data.coreSkills);
                                  if (data.featuredProjects) setLocalProjects(data.featuredProjects);
                                  if (data.showcaseProjects) setLocalShowcaseProjects(data.showcaseProjects);
                                  if (data.orbitSkills) setLocalOrbitSkills(data.orbitSkills);
                                  if (data.aboutMe) setLocalAboutMe(data.aboutMe);
                                  if (data.educationData) setLocalEducation(data.educationData);
                                  if (data.certifications) setLocalCertifications(data.certifications);
                                  if (data.socialLinks) setLocalSocialLinks(data.socialLinks);
                                  alert("Backup loaded successfully! Click 'SAVE TO DATABASE' to apply changes permanently.");
                                } catch (error) {
                                  alert("Failed to parse backup file. Please ensure it is a valid JSON backup.");
                                }
                              };
                              reader.readAsText(file);
                              e.target.value = '';
                            }}
                          />
                          <motion.div
                            whileHover={{ scale: 1.05, boxShadow: '0 0 15px #ffff00' }}
                            whileTap={{ scale: 0.95 }}
                            style={{ background: 'transparent', color: '#ffff00', border: '1px solid #ffff00', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', transition: 'all 0.3s' }}
                          >
                            <Upload size={16} /> IMPORT BACKUP
                          </motion.div>
                        </label>
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        {(activeTab === 'About Me' || activeTab === 'Core Skills' || activeTab === 'Featured Projects' || activeTab === '3D Project Cards' || activeTab === 'Orbit Skills' || activeTab === 'Certifications' || activeTab === 'Journey Timeline' || activeTab === 'Contact Links') && (
                          <motion.button
                          id="save-btn"
                        whileHover={{ scale: 1.05, boxShadow: '0 0 15px #00f3ff' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                          const btn = document.getElementById('save-btn');
                          if (btn) {
                            btn.innerText = 'SAVING...';
                            btn.style.opacity = '0.7';
                            btn.style.pointerEvents = 'none';
                          }

                          // 1. Update Context State
                          if (activeTab === 'About Me' || activeTab === 'Contact Links') setAboutMe(localAboutMe);
                          if (activeTab === 'Core Skills') setCoreSkills(localSkills);
                          if (activeTab === 'Featured Projects') setFeaturedProjects(localProjects);
                          if (activeTab === '3D Project Cards') setShowcaseProjects(localShowcaseProjects);
                          if (activeTab === 'Orbit Skills') setOrbitSkills(localOrbitSkills);
                          setEducationData(localEducation);
                          setCertifications(localCertifications);
                          setSocialLinks(localSocialLinks);

                          // 2. Await Database Save (using local state directly to avoid waiting for context re-render)
                          try {
                            await saveAllData({
                              coreSkills: activeTab === 'Core Skills' ? localSkills : undefined,
                              featuredProjects: activeTab === 'Featured Projects' ? localProjects : undefined,
                              showcaseProjects: activeTab === '3D Project Cards' ? localShowcaseProjects : undefined,
                              orbitSkills: activeTab === 'Orbit Skills' ? localOrbitSkills : undefined,
                              aboutMe: (activeTab === 'About Me' || activeTab === 'Contact Links') ? localAboutMe : undefined,
                              educationData: localEducation,
                              certifications: localCertifications,
                              socialLinks: localSocialLinks
                            });

                            // 3. Show success feedback
                            if (btn) {
                              btn.innerText = 'SAVED!';
                              btn.style.background = '#00ff88';
                              btn.style.color = '#000';
                              btn.style.opacity = '1';
                              setTimeout(() => {
                                btn.innerText = 'SAVE TO DATABASE';
                                btn.style.background = '#00f3ff';
                                btn.style.pointerEvents = 'auto';
                              }, 2000);
                            }
                          } catch (err) {
                            if (btn) {
                              btn.innerText = 'SAVE FAILED!';
                              btn.style.background = '#ff0033';
                              btn.style.color = '#fff';
                              btn.style.opacity = '1';
                              setTimeout(() => {
                                btn.innerText = 'SAVE TO DATABASE';
                                btn.style.background = '#00f3ff';
                                btn.style.pointerEvents = 'auto';
                              }, 3000);
                            }
                            alert('Save failed! Document size limit may be exceeded.');
                          }
                        }}
                        style={{ background: '#00f3ff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', transition: 'background 0.3s' }}
                      >
                        <Save size={16} /> <span id="save-btn-text">SAVE TO DATABASE</span>
                        </motion.button>
                        )}
                        <label 
                          onClick={() => setAutoSave(!autoSave)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', color: autoSave ? '#00f3ff' : '#888', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
                        >
                          <div style={{
                            width: '40px', height: '20px', borderRadius: '10px',
                            background: autoSave ? '#00f3ff' : '#333',
                            position: 'relative', transition: 'background 0.3s'
                          }}>
                            <div style={{
                              width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                              position: 'absolute', top: '2px', left: autoSave ? '22px' : '2px',
                              transition: 'left 0.3s'
                            }} />
                          </div>
                          AUTO SAVE
                        </label>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: '50px', height: '3px', background: '#00f3ff', marginBottom: '30px', boxShadow: '0 0 10px #00f3ff' }} />

                  {/* ABOUT ME EDITOR */}
                  {activeTab === 'About Me' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {cropImageSrc && (
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 10, 20, 0.95)', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <h2 style={{ color: '#00f3ff', fontFamily: 'var(--font-mono)', marginBottom: '20px' }}>POSITION & RESIZE PHOTO</h2>
                          <div style={{ width: '400px', height: '400px', position: 'relative', background: '#000', borderRadius: '8px', overflow: 'hidden', border: '2px solid #00f3ff', boxShadow: '0 0 30px rgba(0,255,255,0.2)' }}>
                            <Cropper
                              image={cropImageSrc}
                              crop={crop}
                              zoom={zoom}
                              aspect={1}
                              cropShape="round"
                              onCropChange={setCrop}
                              onZoomChange={setZoom}
                              onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                              style={{ containerStyle: { background: 'transparent' } }}
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px', width: '400px' }}>
                            <input 
                              type="range" 
                              min={1} 
                              max={3} 
                              step={0.1} 
                              value={zoom} 
                              onChange={(e) => setZoom(e.target.value)}
                              style={{ width: '100%', cursor: 'pointer' }} 
                            />
                            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                              <motion.button onClick={() => { setCropImageSrc(null); setZoom(1); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: 1, padding: '12px 20px', background: 'transparent', color: '#ff0055', border: '1px solid #ff0055', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>CANCEL</motion.button>
                              <motion.button onClick={finishCropping} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: 1, padding: '12px 20px', background: '#00f3ff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>SAVE CROP</motion.button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#00f3ff', fontFamily: 'var(--font-mono)' }}>Profile Image</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                          {localAboutMe.profileImage && (
                            <img src={localAboutMe.profileImage} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00f3ff' }} />
                          )}
                          <div>
                            <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.8rem' }}>UPLOAD SQUARE PHOTO</label>
                            <label style={{
                              background: '#0a0f1e', border: '1px solid #00f3ff', color: '#00f3ff', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 255, 0.1)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#0a0f1e'; }}
                            >
                              <Upload size={16} /> CHOOSE FILE
                              <input type="file" accept="image/*" onChange={handleProfileImageUpload} style={{ display: 'none' }} />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#00f3ff', fontFamily: 'var(--font-mono)' }}>Hero Section</h3>
                        <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.8rem' }}>MAIN NAME</label>
                        <input style={{ ...inputStyle, marginBottom: '15px' }} value={localAboutMe.heroName || ''} onChange={(e) => setLocalAboutMe({ ...localAboutMe, heroName: e.target.value })} />

                        <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.8rem' }}>SUBTITLE</label>
                        <input style={{ ...inputStyle, marginBottom: '15px' }} value={localAboutMe.heroTitle || ''} onChange={(e) => setLocalAboutMe({ ...localAboutMe, heroTitle: e.target.value })} />

                        <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.8rem' }}>DESCRIPTION PARAGRAPH 1</label>
                        <textarea style={{ ...inputStyle, marginBottom: '15px', height: '80px', resize: 'vertical' }} value={localAboutMe.description1 || ''} onChange={(e) => setLocalAboutMe({ ...localAboutMe, description1: e.target.value })} />

                        <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.8rem' }}>DESCRIPTION PARAGRAPH 2</label>
                        <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={localAboutMe.description2 || ''} onChange={(e) => setLocalAboutMe({ ...localAboutMe, description2: e.target.value })} />
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#00f3ff', fontFamily: 'var(--font-mono)' }}>Top Navigation</h3>
                        <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.8rem' }}>NAV NAME</label>
                        <input style={{ ...inputStyle, marginBottom: '15px' }} value={localAboutMe.navName || ''} onChange={(e) => setLocalAboutMe({ ...localAboutMe, navName: e.target.value })} />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.8rem' }}>NAV TITLE LINE 1</label>
                            <input style={inputStyle} value={localAboutMe.navTitle1 || ''} onChange={(e) => setLocalAboutMe({ ...localAboutMe, navTitle1: e.target.value })} />
                          </div>
                          <div>
                            <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.8rem' }}>NAV TITLE LINE 2</label>
                            <input style={inputStyle} value={localAboutMe.navTitle2 || ''} onChange={(e) => setLocalAboutMe({ ...localAboutMe, navTitle2: e.target.value })} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CORE SKILLS EDITOR */}
                  {activeTab === 'Core Skills' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <datalist id="icon-suggestions">
                        {/* Languages */}
                        <option value="FaPython" />
                        <option value="FaJava" />
                        <option value="SiC" />
                        <option value="SiCplusplus" />
                        <option value="SiJavascript" />
                        <option value="SiTypescript" />
                        {/* Frameworks & Web */}
                        <option value="FaReact" />
                        <option value="FaNodeJs" />
                        <option value="SiNextdotjs" />
                        <option value="FaAngular" />
                        <option value="SiTailwindcss" />
                        <option value="FaHtml5" />
                        <option value="FaCss3Alt" />
                        {/* Databases */}
                        <option value="SiMysql" />
                        <option value="SiMongodb" />
                        <option value="SiFirebase" />
                        {/* Tools & Infra */}
                        <option value="FaGitAlt" />
                        <option value="FaGithub" />
                        <option value="SiPostman" />
                        <option value="SiVercel" />
                        <option value="SiRender" />
                        <option value="SiClerk" />
                        <option value="SiRailway" />
                        <option value="SiStreamlit" />
                        <option value="SiStackblitz" />
                        <option value="SiCodesandbox" />
                        {/* AI & Concepts (Lucide Icons) */}
                        <option value="Brain" label="LLM / AI" />
                        <option value="Database" label="RAG / Data" />
                        <option value="Search" label="Vector Search" />
                        <option value="Binary" label="DSA" />
                        <option value="Box" label="OOP" />
                        <option value="Layout" label="System Design" />
                        <option value="Key" label="JWT Auth" />
                        <option value="Shield" label="Security" />
                        <option value="Layers" label="MVC" />
                        <option value="Cable" label="WebSockets" />
                        <option value="Code" label="Programming" />
                        <option value="Server" label="Backend" />
                        <option value="Network" label="API" />
                      </datalist>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', color: '#888', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        <span>SKILL NAME</span>
                        <span>ICON (Lucide/Fa/Si)</span>
                        <span>PERCENT %</span>
                      </div>
                      {localSkills.map((skill, idx) => (
                        <div key={skill.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                          <input style={inputStyle} value={skill.name} onChange={(e) => updateSkill(idx, 'name', e.target.value)} />
                          <input style={inputStyle} value={skill.icon} onChange={(e) => updateSkill(idx, 'icon', e.target.value)} list="icon-suggestions" />
                          <input type="number" style={inputStyle} value={skill.percent} onChange={(e) => updateSkill(idx, 'percent', e.target.value)} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* FEATURED PROJECTS EDITOR */}
                  {activeTab === 'Featured Projects' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {localProjects.map((proj, idx) => (
                        <div key={proj.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,0,255,0.2)', position: 'relative' }}>
                          <motion.button whileHover={{ scale: 1.15, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={() => deleteProject(idx)} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff0055', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', cursor: 'pointer', zIndex: 10 }}>
                            <Trash2 size={14} />
                          </motion.button>
                          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <input style={inputStyle} value={proj.title} onChange={(e) => updateProject(idx, 'title', e.target.value)} placeholder="Project Title" />
                            <input type="number" style={inputStyle} value={proj.percent} onChange={(e) => updateProject(idx, 'percent', e.target.value)} placeholder="Progress %" />
                          </div>
                          <input style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} value={proj.desc} onChange={(e) => updateProject(idx, 'desc', e.target.value)} placeholder="Short Description" />
                        </div>
                      ))}
                      <motion.button whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,0,255,0.1)' }} whileTap={{ scale: 0.98 }} onClick={addProject} style={{ background: 'transparent', border: '1px dashed #ff00ff', color: '#ff00ff', padding: '15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)' }}>
                        <Plus size={18} /> ADD DASHBOARD PROJECT
                      </motion.button>
                    </div>
                  )}

                  {/* 3D PROJECT CARDS EDITOR */}
                  {activeTab === '3D Project Cards' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {localShowcaseProjects.map((proj, idx) => (
                        <div key={proj.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)', position: 'relative' }}>
                          <motion.button whileHover={{ scale: 1.15, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={() => deleteShowcaseProject(idx)} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff0055', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', cursor: 'pointer', zIndex: 10 }}>
                            <Trash2 size={14} />
                          </motion.button>
                          <input style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', marginBottom: '10px' }} value={proj.title} onChange={(e) => updateShowcaseProject(idx, 'title', e.target.value)} placeholder="Card Header Title" />

                          <textarea style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', height: '80px', resize: 'vertical', marginBottom: '10px' }} value={proj.desc} onChange={(e) => updateShowcaseProject(idx, 'desc', e.target.value)} placeholder="Detailed Description" />
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '10px' }}>
                            <select style={{ ...inputStyle, cursor: 'pointer' }} value={proj.urlType || 'View Project'} onChange={(e) => updateShowcaseProject(idx, 'urlType', e.target.value)}>
                              <option value="View Project" style={{ background: '#0a0f1e' }}>View Project</option>
                              <option value="Git Link" style={{ background: '#0a0f1e' }}>Git Link</option>
                            </select>
                            <input style={inputStyle} value={proj.viewProjectLink || ''} onChange={(e) => updateShowcaseProject(idx, 'viewProjectLink', e.target.value)} placeholder="URL Link" />
                            <input style={inputStyle} value={proj.techStack || ''} onChange={(e) => updateShowcaseProject(idx, 'techStack', e.target.value)} placeholder="Tech Stack (comma separated)" />
                          </div>

                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                              <label style={{ ...inputStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', background: 'rgba(0,255,255,0.05)' }}>
                                <Upload size={16} style={{ marginRight: '8px' }} /> {proj.image ? 'UPDATE PROJECT SCREENSHOT' : 'UPLOAD SCREENSHOT (.jpg, .png)'}
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleShowcaseImageUpload(idx, e)} />
                              </label>
                            </div>
                            {proj.image && (
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <motion.button
                                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,0,85,0.1)' }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => updateShowcaseProject(idx, 'image', null)}
                                  style={{ background: 'transparent', border: '1px solid #ff0055', color: '#ff0055', padding: '0 15px', height: '40px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)' }}
                                >
                                  <Trash2 size={16} /> REMOVE
                                </motion.button>
                                <img src={proj.image} alt="Preview" style={{ height: '40px', width: 'auto', borderRadius: '4px', border: '1px solid #00f3ff' }} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <motion.button whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,255,255,0.1)' }} whileTap={{ scale: 0.98 }} onClick={addShowcaseProject} style={{ background: 'transparent', border: '1px dashed #00f3ff', color: '#00f3ff', padding: '15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)' }}>
                        <Plus size={18} /> ADD 3D SHOWCASE CARD
                      </motion.button>
                    </div>
                  )}

                  {/* ORBIT SKILLS EDITOR */}
                  {activeTab === 'Orbit Skills' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <datalist id="orbit-icons-list">
                        {Object.keys(ORBIT_ICONS).map(iconName => (
                          <option key={iconName} value={iconName} />
                        ))}
                      </datalist>

                      <div style={{ background: 'rgba(0,255,255,0.05)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.3)', display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '10px' }}>
                        <input
                          style={inputStyle}
                          value={newOrbitSkill}
                          onChange={(e) => setNewOrbitSkill(e.target.value)}
                          placeholder="Start typing skill name (e.g. Python)"
                          list="orbit-icons-list"
                        />
                        <select style={{ ...inputStyle, cursor: 'pointer' }} value={newOrbitLevel} onChange={(e) => setNewOrbitLevel(e.target.value)}>
                          <option value="inner" style={{ background: '#0a0f1e' }}>Inner Ring</option>
                          <option value="middle" style={{ background: '#0a0f1e' }}>Middle Ring</option>
                          <option value="outer" style={{ background: '#0a0f1e' }}>Outer Ring</option>
                        </select>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={addOrbitSkill}
                          style={{ background: '#00f3ff', border: 'none', borderRadius: '4px', padding: '0 15px', color: '#000', fontFamily: 'var(--font-mono)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Plus size={16} /> ADD
                        </motion.button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '10px' }}>
                        {['inner', 'middle', 'outer'].map((level) => (
                          <div key={level} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,0,255,0.2)' }}>
                            <h3 style={{ color: '#ff00ff', margin: '0 0 15px 0', fontSize: '0.9rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{level} Ring</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {(localOrbitSkills[level] || []).map((skill, idx) => {
                                const IconCmp = ORBIT_ICONS[skill];
                                return (
                                  <div key={`${skill}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,255,255,0.05)', padding: '8px 12px', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                                      {IconCmp && <IconCmp size={16} color="#00f3ff" />}
                                      {skill}
                                    </div>
                                    <motion.button whileHover={{ scale: 1.2, color: '#ff0055' }} whileTap={{ scale: 0.9 }} onClick={() => deleteOrbitSkill(level, idx)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 0 }}>
                                      <X size={16} />
                                    </motion.button>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CERTIFICATIONS EDITOR */}
                  {activeTab === 'Certifications' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {localCertifications.map((cert, idx) => (
                        <div key={cert.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)', position: 'relative' }}>
                          <motion.button whileHover={{ scale: 1.15, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={() => deleteCert(idx)} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff0055', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', cursor: 'pointer', zIndex: 10 }}>
                            <Trash2 size={14} />
                          </motion.button>
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <input style={inputStyle} value={cert.name} onChange={(e) => updateCert(idx, 'name', e.target.value)} placeholder="Header Name (e.g. Certified Developer)" />
                            <input style={inputStyle} value={cert.issuer} onChange={(e) => updateCert(idx, 'issuer', e.target.value)} placeholder="Issuer (e.g. Amazon)" />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 255, 255, 0.2)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setGridPickerCertIdx(idx)}
                                style={{ flex: 1, background: 'rgba(0,255,255,0.05)', border: '1px solid #00f3ff', color: '#00f3ff', padding: '0 10px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                              >
                                CHOOSE POSITION (SLOT {cert.slot || '32'})
                              </motion.button>
                            </div>
                            <select
                              style={{ ...inputStyle, cursor: 'pointer' }}
                              value={cert.icon || 'Cloud'}
                              onChange={(e) => updateCert(idx, 'icon', e.target.value)}
                            >
                              {Object.keys(CERT_ICONS).map(iconKey => (
                                <option key={iconKey} value={iconKey} style={{ background: '#0a0f1e' }}>{iconKey}</option>
                              ))}
                            </select>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <input style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} value={cert.imageUrl || ''} onChange={(e) => updateCert(idx, 'imageUrl', e.target.value)} placeholder="Certificate Image/PDF URL (e.g. https://domain.com/cert.pdf)" />
                            <label style={{
                              background: '#0a0f1e', border: '1px solid #00f3ff', color: '#00f3ff', padding: '0 15px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: '0.85rem'
                            }}>
                              UPLOAD
                              <input type="file" accept="image/*,application/pdf" onChange={(e) => handleImageUpload(idx, e)} style={{ display: 'none' }} />
                            </label>
                          </div>
                        </div>
                      ))}
                      <motion.button whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,255,255,0.1)' }} whileTap={{ scale: 0.98 }} onClick={addCert} style={{ background: 'transparent', border: '1px dashed #00f3ff', color: '#00f3ff', padding: '15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)' }}>
                        <Plus size={18} /> ADD NEW CERTIFICATE CARD
                      </motion.button>
                    </div>
                  )}
                  {activeTab === 'Journey Timeline' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {localEducation.map((edu, idx) => (
                        <div key={edu.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)', position: 'relative' }}>
                          <motion.button whileHover={{ scale: 1.15, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={() => deleteEducation(idx)} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff0055', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', cursor: 'pointer', zIndex: 10 }}>
                            <Trash2 size={14} />
                          </motion.button>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                            <input style={inputStyle} value={edu.year} onChange={(e) => updateEducation(idx, 'year', e.target.value)} placeholder="Year (e.g. 2020 - 2024)" />
                            <input style={inputStyle} value={edu.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} placeholder="Institution / Company Name" />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                            <select
                              style={{ ...inputStyle, cursor: 'pointer' }}
                              value={edu.type || 'education'}
                              onChange={(e) => updateEducation(idx, 'type', e.target.value)}
                            >
                              <option value="education" style={{ background: '#0a0f1e' }}>Education (Cap Icon)</option>
                              <option value="work" style={{ background: '#0a0f1e' }}>Work/Company (Building Icon)</option>
                            </select>
                            <input style={inputStyle} value={edu.roleText || ''} onChange={(e) => updateEducation(idx, 'roleText', e.target.value)} placeholder="Role (e.g. Intern, Student)" />
                            <input style={inputStyle} value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} placeholder="Degree / Role Title" />
                          </div>
                          <textarea style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', height: '60px', resize: 'none' }} value={edu.details} onChange={(e) => updateEducation(idx, 'details', e.target.value)} placeholder="Description Details" />
                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <input style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} value={edu.imageUrl || ''} onChange={(e) => updateEducation(idx, 'imageUrl', e.target.value)} placeholder="Certificate Image URL (e.g. https://domain.com/cert.png)" />
                            {edu.imageUrl && (
                              <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,0,85,0.1)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateEducation(idx, 'imageUrl', '')}
                                style={{ background: 'transparent', border: '1px solid #ff0055', color: '#ff0055', padding: '0 15px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)' }}
                              >
                                <Trash2 size={16} /> REMOVE
                              </motion.button>
                            )}
                            <label style={{
                              background: '#0a0f1e', border: '1px solid #00f3ff', color: '#00f3ff', padding: '0 15px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: '0.85rem'
                            }}>
                              UPLOAD
                              <input type="file" accept="image/*,application/pdf,.pdf" onChange={(e) => handleEducationImageUpload(idx, e)} style={{ display: 'none' }} />
                            </label>
                          </div>
                        </div>
                      ))}
                      <motion.button whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,255,255,0.1)' }} whileTap={{ scale: 0.98 }} onClick={addEducation} style={{ background: 'transparent', border: '1px dashed #00f3ff', color: '#00f3ff', padding: '15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)' }}>
                        <Plus size={18} /> ADD NEW TIMELINE CARD
                      </motion.button>
                    </div>
                  )}

                  {activeTab === 'Contact Links' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {localSocialLinks.map((link, idx) => (
                        <div key={link.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)', position: 'relative' }}>
                          <motion.button whileHover={{ scale: 1.15, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={() => deleteSocialLink(idx)} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff0055', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', cursor: 'pointer', zIndex: 10 }}>
                            <Trash2 size={14} />
                          </motion.button>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <select style={{ ...inputStyle, cursor: 'pointer' }} value={link.platform} onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}>
                              {Object.keys(SOCIAL_ICONS).map(iconName => (
                                <option key={iconName} value={iconName} style={{ background: '#0a0f1e' }}>{iconName}</option>
                              ))}
                            </select>
                            <input style={inputStyle} value={link.url} onChange={(e) => updateSocialLink(idx, 'url', e.target.value)} placeholder="URL or mailto:" />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,255,255,0.3)', borderRadius: '4px', padding: '0 8px' }}>
                              <span style={{ color: '#888', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>Color:</span>
                              <input type="color" value={link.color} onChange={(e) => updateSocialLink(idx, 'color', e.target.value)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '30px', height: '30px', padding: 0 }} />
                            </div>
                          </div>
                        </div>
                      ))}
                      <motion.button whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,255,255,0.1)' }} whileTap={{ scale: 0.98 }} onClick={addSocialLink} style={{ background: 'transparent', border: '1px dashed #00f3ff', color: '#00f3ff', padding: '15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)' }}>
                        <Plus size={18} /> ADD NEW SOCIAL LINK
                      </motion.button>
                      
                      <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(0,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.3)' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#00f3ff', fontFamily: 'var(--font-mono)' }}>Resume Document</h3>
                        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '15px', fontFamily: 'var(--font-mono)' }}>Upload a PDF or Image of your resume (Max 20MB). This will be available for download in the public Contact section.</p>
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <label style={{
                            background: isUploadingResume ? 'rgba(85,85,85,0.5)' : '#00f3ff', 
                            color: '#000', padding: '10px 20px', borderRadius: '4px', cursor: isUploadingResume ? 'not-allowed' : 'pointer', 
                            display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontWeight: 'bold'
                          }}>
                            {isUploadingResume ? <RefreshCw size={18} className="spin-anim" /> : <Upload size={18} />}
                            {isUploadingResume ? `UPLOADING... ${uploadProgress}%` : 'UPLOAD RESUME'}
                            <input type="file" accept="image/*,application/pdf" onChange={handleResumeUpload} style={{ display: 'none' }} disabled={isUploadingResume} />
                          </label>
                          
                          {localAboutMe.resumeUrl && (
                            <div style={{ color: '#00ff00', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <ShieldAlert size={14} /> Resume active on server
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Messages' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {messages && messages.length > 0 ? messages.map((msg, idx) => (
                        <div key={msg.id || idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)', position: 'relative' }}>
                          <motion.button
                            whileHover={{ scale: 1.15, rotate: 10 }} whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const updated = messages.filter((_, i) => i !== idx);
                              setMessages(updated);
                            }}
                            style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff0055', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', cursor: 'pointer', zIndex: 10 }}
                          >
                            <Trash2 size={14} />
                          </motion.button>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid rgba(0,255,255,0.2)', paddingBottom: '10px' }}>
                            <span style={{ color: '#00f3ff', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>ORIGIN: {msg.name}</span>
                            <span style={{ color: '#888', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{new Date(msg.timestamp).toLocaleString()}</span>
                          </div>
                          <div style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)', marginBottom: '15px', fontSize: '0.9rem' }}>
                            VECTOR: {msg.email}
                          </div>
                          <p style={{ color: '#ccc', fontFamily: 'var(--font-mono)', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0 }}>
                            {msg.message}
                          </p>
                        </div>
                      )) : (
                        <div style={{ color: '#888', fontFamily: 'var(--font-mono)' }}>[ NO NEW MESSAGES ENCRYPTED IN STREAM ]</div>
                      )}
                    </div>
                  )}

                  {activeTab === 'System Reset' && (
                    <div>
                      <p style={{ color: '#aaa', fontFamily: 'var(--font-mono)', marginBottom: '20px' }}>WARNING: This will wipe all local storage databases and factory reset your portfolio data to the hardcoded defaults.</p>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,0,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => resetToDefault()}
                        style={{ background: 'transparent', color: '#ff00ff', border: '1px solid #ff00ff', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)' }}
                      >
                        <RefreshCw size={16} /> FACTORY RESET DATA
                      </motion.button>
                    </div>
                  )}

                  {/* Decorative Corner accents */}
                  <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '20px', height: '20px', borderBottom: '2px solid #00f3ff', borderRight: '2px solid #00f3ff' }} />
                </div>

                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.2, rotate: 90, filter: 'drop-shadow(0 0 15px #ff00ff)' }}
                  whileTap={{ scale: 0.9 }}
                  style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#ff00ff', cursor: 'pointer', filter: 'drop-shadow(0 0 8px #ff00ff)', zIndex: 100 }}
                >
                  <X size={24} />
                </motion.button>

                {/* Visual Grid Picker Modal */}
                <AnimatePresence>
                  {gridPickerCertIdx !== null && (
                    <VisualGridPicker
                      localCertifications={localCertifications}
                      currentSlot={localCertifications[gridPickerCertIdx]?.slot || '32'}
                      onSelectSlot={(slot) => {
                        updateCert(gridPickerCertIdx, 'slot', slot);
                        setGridPickerCertIdx(null);
                      }}
                      onClose={() => setGridPickerCertIdx(null)}
                    />
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
