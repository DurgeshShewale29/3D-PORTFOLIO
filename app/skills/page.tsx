import { Metadata } from 'next';
import { VscJson, VscTools } from 'react-icons/vsc';
import { extensions, skills } from '@/portfolio.config';
import ExtensionIcon from '@/components/ExtensionIcon';
import styles from '@/styles/ProjectsPage.module.css';

export const metadata: Metadata = {
  title: 'Skills',
};

export default function SkillsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.iconWrapper}>
              <VscJson className={styles.icon} size={24} />
            </div>
            <div className={styles.meta}>
              <span className={styles.count}>{extensions.length} Technologies</span>
            </div>
          </div>

          <div className={styles.headerContent}>
            <h1 className={styles.title}>Technical Arsenal</h1>
            <p className={styles.subtitle}>
              Core languages, frameworks, cloud tooling, and systems utilities I use to build scalable products.
            </p>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '2rem' }}>
          {extensions.map(ext => (
            <div
              key={ext.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <ExtensionIcon extension={ext} size={32} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0, fontFamily: 'var(--font-mono)' }}>{ext.name}</h3>
                  <span style={{ fontSize: '0.7rem', color: '#ff6fd8', background: 'rgba(255,111,216,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                    {ext.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '6px 0 0', lineHeight: 1.4 }}>
                  {ext.description}
                </p>
                {ext.experience && (
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
                    Experience: {ext.experience}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
