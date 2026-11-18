import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  profile,
  socials,
  getSocial,
  projects,
  experience,
  education,
  certifications,
  skills,
  extensions,
  getExtension,
  fileRoutes,
  routes,
} from '../portfolio.config';
import { fuzzyMatch } from '../lib/fuzzy';
import { THEMES, THEME_KEYS } from '../lib/themes';
import { answerQueryLocally, SUGGESTED_CHIPS } from '../lib/copilotKnowledge';

describe('1. Profile Configuration & Social Links', () => {
  it('should verify correct identity for Durgesh Rajendra Shewale', () => {
    assert.equal(profile.name, 'Durgesh Rajendra Shewale');
    assert.ok(profile.role.includes('Full-Stack') || profile.role.includes('AI'));
    assert.equal(profile.location, 'Malegaon, Maharashtra, India');
    assert.equal(profile.email, 'shewaledurgesh29@gmail.com');
    assert.equal(profile.phone, '+91 9975340539');
    assert.equal(profile.repository, 'https://github.com/DurgeshShewale29');
  });

  it('should verify social links and correct LinkedIn/GitHub handles', () => {
    const github = getSocial('github');
    const linkedin = getSocial('linkedin');
    const email = getSocial('email');
    const phone = getSocial('phone');

    assert.ok(github, 'GitHub link must exist');
    assert.equal(github?.href, 'https://github.com/DurgeshShewale29');
    assert.equal(github?.handle, 'DurgeshShewale29');

    assert.ok(linkedin, 'LinkedIn link must exist');
    assert.equal(linkedin?.href, 'https://www.linkedin.com/in/durgesh-shewale-/');
    assert.equal(linkedin?.handle, 'durgesh-shewale-');

    assert.ok(email, 'Email link must exist');
    assert.equal(email?.href, 'mailto:shewaledurgesh29@gmail.com');
    assert.equal(email?.handle, 'shewaledurgesh29@gmail.com');

    assert.ok(phone, 'Phone link must exist');
    assert.equal(phone?.handle, '+91 9975340539');
  });
});

describe('2. Projects Data Integrity', () => {
  it('should contain all major engineering projects with complete metadata', () => {
    assert.ok(projects.length >= 4, 'Should have at least 4 featured projects');

    const sparkAi = projects.find(p => p.title.toLowerCase().includes('spark'));
    assert.ok(sparkAi, 'Spark AI project must exist');
    assert.ok(sparkAi?.link.includes('DurgeshShewale29/Spark-AI-2.0'));
    assert.ok(sparkAi?.description.includes('StackBlitz WebContainers'));

    const tripflow = projects.find(p => p.title.toLowerCase().includes('tripflow'));
    assert.ok(tripflow, 'TripFlow Lakehouse project must exist');
    assert.ok(tripflow?.link.includes('DurgeshShewale29/Tripflow-Lakehouse-Pipeline'));
    assert.ok(tripflow?.description.includes('Delta tables') || tripflow?.description.includes('Bronze'));

    const logDigitizer = projects.find(p => p.title.toLowerCase().includes('logdigitizer'));
    assert.ok(logDigitizer, 'LogDigitizer project must exist');
    assert.ok(logDigitizer?.link.includes('DurgeshShewale29/LogDigitizer-Engine'));
    assert.ok(logDigitizer?.description.includes('FastAPI') || logDigitizer?.description.includes('OCR'));

    const logbook = projects.find(p => p.title.toLowerCase().includes('maintenance'));
    assert.ok(logbook, 'Maintenance Logbook project must exist');
    assert.ok(logbook?.link.includes('DurgeshShewale29/digital-maintenance-logbook'));
  });

  it('should verify all projects have non-empty titles, descriptions, and valid repository links', () => {
    for (const proj of projects) {
      assert.ok(proj.title.trim().length > 0, `Project title should not be empty`);
      assert.ok(proj.description.trim().length > 20, `Project description should be detailed: ${proj.title}`);
      assert.ok(proj.link.startsWith('https://github.com/DurgeshShewale29/'), `Link must point to Durgesh's repo: ${proj.link}`);
      assert.ok(proj.slug.length > 0, `Project slug must be non-empty: ${proj.slug}`);
    }
  });
});

describe('3. Experience & Internship Records', () => {
  it('should contain verified IOCL internship details', () => {
    const iocl = experience.find(e => e.company?.includes('IOCL') || e.company?.includes('Indian Oil'));
    assert.ok(iocl, 'IOCL experience must exist');
    assert.ok(iocl?.highlights && iocl.highlights.length > 0);
    const joinedHighlights = iocl?.highlights.join(' ').toLowerCase() || '';
    assert.ok(joinedHighlights.includes('ocr'));
    assert.ok(joinedHighlights.includes('digitization') || joinedHighlights.includes('fastapi'));
  });

  it('should contain HCL Tech and Sumago Infotech experience', () => {
    const hcl = experience.find(e => e.company?.includes('HCL Tech'));
    assert.ok(hcl, 'HCL Tech experience must exist');
    assert.ok(hcl?.highlights && hcl.highlights.length > 0);

    const sumago = experience.find(e => e.company?.includes('Sumago Infotech'));
    assert.ok(sumago, 'Sumago Infotech experience must exist');
  });
});

describe('4. Education & Academic Qualifications', () => {
  it('should include B.Tech Computer Engineering at Sanjivani and Diploma at KBH', () => {
    const degree = education.find(ed => ed.institution.includes('Sanjivani University'));
    assert.ok(degree, 'Sanjivani University degree must exist');
    assert.ok(degree?.degree.includes('Computer Engineering'));

    const diploma = education.find(ed => ed.institution.includes('K. B. H. Polytechnic'));
    assert.ok(diploma, 'Diploma education must exist');
  });

  it('should verify certifications array has key achievements', () => {
    assert.ok(certifications.length > 0, 'Certifications should be populated');
    const agentforce = certifications.find(c => c.title.includes('Agentforce'));
    assert.ok(agentforce, 'Salesforce Agentforce certification should exist');

    const taiwan = certifications.find(c => c.issuer.includes('Taiwan'));
    assert.ok(taiwan, 'Taiwan Spectra Vision award should exist');
  });
});

describe('5. Technical Skills Matrix', () => {
  it('should contain critical skills categories and keywords', () => {
    assert.ok(skills['Languages'].includes('Python'));
    assert.ok(skills['Languages'].includes('TypeScript'));
    assert.ok(skills['Backend'].includes('Java & Spring Boot'));
    assert.ok(skills['Backend'].includes('FastAPI'));
    assert.ok(skills['Frontend'].includes('React 19 & Next.js'));
    assert.ok(skills['Databases'].includes('MongoDB & Vector Search'));
    assert.ok(skills['Tools'].includes('Git & GitHub Actions'));
  });

  it('should verify extensions database and getExtension resolver', () => {
    assert.ok(extensions.length >= 10, 'Should have at least 10 extension skills');
    const py = getExtension('python');
    assert.ok(py, 'Python extension should be found');
    assert.equal(py?.name, 'Python');

    const react = getExtension('react');
    assert.ok(react, 'React extension should be found');
    assert.equal(react?.name, 'React 19 & Next.js');
  });
});

describe('6. File Routes & VS Code Tree Structure', () => {
  it('should have all 6 core editor files mapped with valid extensions', () => {
    assert.equal(fileRoutes.length, 6, 'Should have exactly 6 main file routes');
    const paths = fileRoutes.map(r => r.path);
    assert.ok(paths.includes('/'), 'Root home route must exist');
    assert.ok(paths.includes('/about'), 'About route must exist');
    assert.ok(paths.includes('/projects'), 'Projects route must exist');
    assert.ok(paths.includes('/skills'), 'Skills route must exist');
    assert.ok(paths.includes('/contact'), 'Contact route must exist');
    assert.ok(paths.includes('/github'), 'GitHub route must exist');
  });

  it('should verify file names and icons for VS Code Explorer view', () => {
    const fileNames = fileRoutes.map(r => r.file.name);
    assert.deepEqual(fileNames, [
      'home.tsx',
      'about.html',
      'projects.js',
      'skills.json',
      'contact.css',
      'github.md',
    ]);
  });
});

describe('7. Fuzzy Search Matching Engine', () => {
  it('should accurately match search queries against filename targets', () => {
    const match1 = fuzzyMatch('home', 'home.tsx');
    assert.ok(match1 !== null && match1.score > 100, 'Exact prefix match should score high');

    const match2 = fuzzyMatch('abt', 'about.html');
    assert.ok(match2 !== null, 'Subsequence abt should match about.html');

    const match3 = fuzzyMatch('proj', 'projects.js');
    assert.ok(match3 !== null, 'Subsequence proj should match projects.js');

    const noMatch = fuzzyMatch('xyz123', 'home.tsx');
    assert.equal(noMatch, null, 'Unrelated query should return null');
  });
});

describe('8. VS Code Theme Ecosystem', () => {
  it('should provide Durgesh Dark as flagship theme alongside popular themes', () => {
    assert.ok(THEMES.length >= 5, 'Should have at least 5 themes');
    assert.ok(THEME_KEYS.includes('durgesh-dark'), 'Durgesh Dark theme key must exist');
    assert.ok(THEME_KEYS.includes('github-dark'), 'GitHub Dark theme key must exist');
    assert.ok(THEME_KEYS.includes('dracula'), 'Dracula theme key must exist');

    const durgeshTheme = THEMES.find(t => t.theme === 'durgesh-dark');
    assert.equal(durgeshTheme?.publisher, 'Durgesh Shewale');
  });
});

describe('9. Copilot AI Assistant Local Knowledge Engine', () => {
  it('should provide exactly 4 clean, humanized suggestion chips', () => {
    assert.equal(SUGGESTED_CHIPS.length, 4);
    for (const chip of SUGGESTED_CHIPS) {
      assert.ok(!chip.includes('🌸') && !chip.includes('🚀'), 'No emoji prefixes in suggestion chips');
    }
  });

  it('should answer contact inquiry with Durgesh\'s email, phone, and LinkedIn', () => {
    const response = answerQueryLocally('How can I contact Durgesh?');
    assert.ok(response.includes('shewaledurgesh29@gmail.com'));
    assert.ok(response.includes('+91 9975340539'));
    assert.ok(response.includes('durgesh-shewale-'));
    assert.ok(response.includes('DurgeshShewale29'));
  });

  it('should answer IOCL internship inquiry accurately', () => {
    const response = answerQueryLocally('What did Durgesh build at IOCL?');
    assert.ok(response.toLowerCase().includes('indian oil') || response.includes('IOCL'));
    assert.ok(response.toLowerCase().includes('ocr'));
    assert.ok(response.toLowerCase().includes('spacy') || response.toLowerCase().includes('sqlite'));
  });

  it('should answer Spark AI inquiry accurately', () => {
    const response = answerQueryLocally('Tell me about Spark AI');
    assert.ok(response.toLowerCase().includes('spark ai'));
    assert.ok(response.toLowerCase().includes('webcontainer') || response.toLowerCase().includes('ide'));
  });

  it('should answer TripFlow Lakehouse inquiry accurately', () => {
    const response = answerQueryLocally('Tell me about TripFlow and Delta Lake');
    assert.ok(response.toLowerCase().includes('tripflow'));
    assert.ok(response.toLowerCase().includes('delta') || response.toLowerCase().includes('lakehouse'));
  });

  it('should answer Technical Stack inquiry accurately', () => {
    const response = answerQueryLocally('What is Durgesh\'s tech stack and skills?');
    assert.ok(response.includes('Python'));
    assert.ok(response.includes('Spring Boot'));
    assert.ok(response.includes('Next.js') || response.includes('React'));
  });

  it('should provide a graceful fallback for unknown queries', () => {
    const response = answerQueryLocally('random unknown question xyz');
    assert.ok(response.includes('Durgesh Rajendra Shewale'));
    assert.ok(response.length > 50);
  });
});
