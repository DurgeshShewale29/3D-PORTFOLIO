'use client';

import { VscSearch, VscLayoutSidebarRight } from 'react-icons/vsc';
import styles from '@/styles/Titlebar.module.css';

interface TitlebarProps {
  onOpenCommandPalette?: () => void;
  onToggleCopilot?: () => void;
  isCopilotOpen?: boolean;
}

const Titlebar = ({ onOpenCommandPalette, onToggleCopilot, isCopilotOpen }: TitlebarProps) => {
  return (
    <section className={styles.titlebar}>
      {/* Left Column: Mac controls + Menu items */}
      <div className={styles.leftSection}>
        <div className={styles.macControls}>
          <span className={styles.macClose} title="Close" />
          <span className={styles.macMinimize} title="Minimize" />
          <span className={styles.macMaximize} title="Maximize" />
        </div>

        <div className={styles.menuItems}>
          <button type="button" className={styles.menuItem}>File</button>
          <button type="button" className={styles.menuItem}>Edit</button>
          <button type="button" className={styles.menuItem} onClick={onOpenCommandPalette}>View</button>
          <button type="button" className={styles.menuItem}>Go</button>
          <button type="button" className={styles.menuItem}>Run</button>
          <button type="button" className={styles.menuItem}>Terminal</button>
          <button type="button" className={styles.menuItem}>Help</button>
        </div>
      </div>

      {/* Center Column: Centered Command Capsule */}
      <div className={styles.centerSection}>
        <button
          type="button"
          className={styles.searchCapsule}
          onClick={onOpenCommandPalette}
          title="Open Command Palette (Ctrl+P)"
        >
          <VscSearch size={13} className={styles.searchIcon} />
          <span className={styles.searchText}>DurgeshShewale29 : portfolio</span>
          <span className={styles.shortcutKey}>Ctrl P</span>
        </button>
      </div>

      {/* Right Column: VS Code Secondary Sidebar Toggle Button */}
      <div className={styles.rightSection}>
        <button 
          type="button" 
          className={`${styles.quickCopilotBtn} ${isCopilotOpen ? styles.quickCopilotBtnActive : ''}`}
          onClick={onToggleCopilot}
          title={isCopilotOpen ? "Close Copilot (Secondary Side Bar)" : "Open Copilot (Secondary Side Bar)"}
          aria-expanded={isCopilotOpen}
        >
          <VscLayoutSidebarRight size={14} className={styles.copilotBtnIcon} />
          <span>Ask Copilot</span>
        </button>
      </div>
    </section>
  );
};

export default Titlebar;
