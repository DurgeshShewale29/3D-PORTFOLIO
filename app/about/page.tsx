import { VscGithub, VscMail, VscLinkExternal } from 'react-icons/vsc';
import Link from 'next/link';

import {
  profile,
  experience,
  skills,
  education,
  certifications,
  writing,
  getSocial,
} from '@/portfolio.config';

import styles from '@/styles/AboutPage.module.css';

const AboutPage = () => {
  const github = getSocial('github');

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1 className={styles.name}>{profile.name}</h1>
              <p className={styles.role}>{profile.currentPosition}</p>
              <div className={styles.location}>
                <span className={styles.dot} />
                {profile.location}
              </div>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            {github && (
              <a
                href={github.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconButton}
                aria-label="GitHub"
              >
                <VscGithub size={20} />
              </a>
            )}
            <Link href="/contact" className={styles.iconButton} aria-label="Contact">
              <VscMail size={20} />
            </Link>
          </div>
        </header>

        <div className={styles.content}>
          {/* Bio Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>01</span>
              <h2 className={styles.sectionTitle}>About</h2>
            </div>
            
            <div className={styles.sectionBody}>
              {profile.bio.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>02</span>
              <h2 className={styles.sectionTitle}>Experience & Internships</h2>
            </div>
            
            <div className={styles.sectionBody}>
              {experience.map((exp) => (
                <div key={`${exp.role}-${exp.period}`} className={styles.experienceCard}>
                  <div className={styles.expMeta}>
                    <span className={styles.expPeriod}>{exp.period}</span>
                    {exp.location && <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '8px' }}>· {exp.location}</span>}
                  </div>
                  <h3 className={styles.expRole}>{exp.role}</h3>
                  {exp.company && (
                    <p className={styles.expCompany}>{exp.company}</p>
                  )}
                  {exp.highlights && (
                    <ul className={styles.expList}>
                      {exp.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {exp.description && (
                    <p className={styles.expDesc}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>03</span>
              <h2 className={styles.sectionTitle}>Technical Skills</h2>
            </div>
            
            <div className={styles.sectionBody}>
              <div className={styles.skillsGrid}>
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category} className={styles.skillCategory}>
                    <h4 className={styles.skillTitle}>{category}</h4>
                    <div className={styles.skillTags}>
                      {items.map((skill) => (
                        <span key={skill} className={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Education Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>04</span>
              <h2 className={styles.sectionTitle}>Education</h2>
            </div>
            
            <div className={styles.sectionBody}>
              {education.map((edu) => (
                <div key={edu.institution} className={styles.experienceCard}>
                  <div className={styles.expMeta}>
                    <span className={styles.expPeriod}>{edu.period}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '8px' }}>· {edu.location}</span>
                  </div>
                  <h3 className={styles.expRole}>{edu.degree}</h3>
                  <p className={styles.expCompany}>{edu.institution}</p>
                  <p style={{ color: '#4ec9b0', fontSize: '0.85rem', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                    {edu.score}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications & Achievements Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>05</span>
              <h2 className={styles.sectionTitle}>Certifications & Achievements</h2>
            </div>
            
            <div className={styles.sectionBody}>
              {certifications.map((cert) => (
                <div key={cert.title} className={styles.experienceCard}>
                  <div className={styles.expMeta}>
                    <span className={styles.expPeriod}>{cert.year}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '8px' }}>· {cert.issuer}</span>
                  </div>
                  <h3 className={styles.expRole}>{cert.title}</h3>
                  {cert.description && (
                    <p className={styles.expDesc}>{cert.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Research & Writing Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>06</span>
              <h2 className={styles.sectionTitle}>Research & Highlights</h2>
            </div>
            
            <div className={styles.sectionBody}>
              <div className={styles.writingLinks}>
                {writing.map((pub) => (
                  <a
                    key={pub.name}
                    href={pub.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.writingLink}
                  >
                    <span>{pub.name}</span>
                    <VscLinkExternal size={14} className={styles.externalIcon} />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Beyond Code Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>07</span>
              <h2 className={styles.sectionTitle}>Beyond Code</h2>
            </div>
            
            <div className={styles.sectionBody}>
              <p className={styles.paragraph}>{profile.beyondCode}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
