'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VscFolder, VscAccount, VscMail } from 'react-icons/vsc';
import { profile } from '@/portfolio.config';
import styles from '@/styles/HomePage.module.css';

const TAGLINES = [
  'Building autonomous AI agents & in-browser IDEs with StackBlitz 🧠',
  'Architecting offline industrial document digitization platforms ⚡',
  'Engineering Bronze-Silver-Gold Lakehouse pipelines with Delta Lake 📊',
  'Developing enterprise full-stack systems in Spring Boot & Angular 🛡️',
  'Zero-Shot OCR extraction and conversational AI agents with spaCy 📄',
];

export default function HomePage() {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIndex(prev => (prev + 1) % TAGLINES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Hero Identity Section */}
        <div className={styles.identitySection}>
          <div className={styles.nameBlock}>
            <p className={styles.commentCode}>
              // Welcome to my portfolio
            </p>
            <h1 className={styles.titleFirstName}>Durgesh</h1>
            <h1 className={styles.titleLastName}>
              Shewale
              <span className={styles.underlineGlow} />
            </h1>
          </div>

          <div className={styles.avatarWrapper}>
            <div className={styles.avatarRing}>
              <div className={styles.avatarRingInner}>
                DS
              </div>
            </div>
          </div>
        </div>

        {/* Badges Row */}
        <div className={styles.badgeRow}>
          <div className={styles.pillBadge}>
            <span className={styles.badgeDot} style={{ background: '#38bdf8' }} />
            <span>Full Stack Developer</span>
          </div>
          <div className={styles.pillBadge}>
            <span className={styles.badgeDot} style={{ background: '#a855f7' }} />
            <span>AI Agents, RAG & LLMs</span>
          </div>
          <div className={styles.pillBadge}>
            <span className={styles.badgeDot} style={{ background: '#f59e0b' }} />
            <span>Python & FastAPI</span>
          </div>
          <div className={styles.rowBreak} />
          <div className={styles.pillBadge}>
            <span className={styles.badgeDot} style={{ background: '#ff6fd8' }} />
            <span>Lakehouse & Delta Lake</span>
          </div>
          <div className={styles.pillBadge} style={{ borderColor: 'rgba(168, 85, 247, 0.4)' }}>
            <span className={styles.badgeDot} style={{ background: '#a855f7' }} />
            <span>Computer Engineering @ Sanjivani</span>
          </div>
        </div>

        {/* Sub-badge */}
        <div>
          <div className={styles.craftsmanBadge}>
            <span>⚡</span>
            <span>Multi-Modal AI Systems & Enterprise Full-Stack Architecture</span>
          </div>
        </div>

        {/* Dynamic Tagline */}
        <div className={styles.tagline}>
          <span>{TAGLINES[taglineIndex]}</span>
        </div>

        {/* Bio Description */}
        <p className={styles.bioDescription}>
          Computer Engineering student and <span className={styles.highlight}>Full Stack Developer</span> experienced in <span className={styles.highlight}>Spring Boot, Angular, React, Python, and Next.js</span>, with additional skills in <span className={styles.highlight}>LLM integration, RAG, Vector Search, and OCR</span>. Seeking a role to build scalable, secure, user-focused software.
        </p>

        {/* Action Buttons */}
        <div className={styles.actionRow}>
          <Link href="/projects" className={styles.primaryBtn}>
            <VscFolder size={18} />
            <span>Projects</span>
          </Link>
          <Link href="/about" className={styles.secondaryBtn}>
            <VscAccount size={18} />
            <span>About Me</span>
          </Link>
          <Link href="/contact" className={styles.secondaryBtn}>
            <VscMail size={18} />
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
