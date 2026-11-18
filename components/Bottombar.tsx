'use client';

import { useState, useEffect } from 'react';
import {
  VscSourceControl,
  VscCheck,
  VscSync,
} from 'react-icons/vsc';
import { profile } from '@/portfolio.config';
import styles from '@/styles/Bottombar.module.css';

interface BottombarProps {
  onTerminalToggle: () => void;
  isTerminalOpen: boolean;
}

const Bottombar = ({ onTerminalToggle, isTerminalOpen }: BottombarProps) => {
  const [petalsOn, setPetalsOn] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sakura_enabled');
      if (stored !== null) setPetalsOn(stored === 'true');
    } catch {}

    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const togglePetals = () => {
    const next = !petalsOn;
    setPetalsOn(next);
    try {
      localStorage.setItem('sakura_enabled', String(next));
    } catch {}
    window.dispatchEvent(new CustomEvent('sakura:toggle', { detail: { enabled: next } }));
  };

  return (
    <footer className={styles.bottomBar}>
      {/* Left side */}
      <div className={styles.container}>
        <a
          href={profile.repository}
          target="_blank"
          rel="noreferrer noopener"
          className={styles.section}
        >
          <VscSourceControl className={styles.icon} />
          <span>main</span>
        </a>

        <div className={styles.section}>
          <VscSync className={styles.icon} />
          <span>↑1 ↓3</span>
        </div>

        <div className={styles.section}>
          <span>Durgesh&apos;s Portfolio 🌸</span>
        </div>

        <div className={styles.section}>
          <span>System Online · {currentTime}</span>
        </div>
      </div>

      {/* Right side */}
      <div className={styles.container}>
        <div className={styles.section}>
          <span>TypeScript React</span>
        </div>

        <div className={styles.section}>
          <span>UTF-8</span>
        </div>

        <div className={styles.section}>
          <VscCheck className={styles.icon} />
          <span>Prettier</span>
        </div>

        {/* Petals toggle button */}
        <button
          type="button"
          onClick={togglePetals}
          className={`${styles.section} ${styles.petalsButton}`}
          title="Toggle Sakura Falling Petals"
        >
          <span>🌸 Petals: {petalsOn ? 'ON' : 'OFF'}</span>
        </button>

        <a href="/settings" className={styles.section}>
          <span>Durgesh Dark 🌸</span>
        </a>
      </div>
    </footer>
  );
};

export default Bottombar;
