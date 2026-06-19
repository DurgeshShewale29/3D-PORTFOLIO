import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Dashboard({ isBooted, activeView }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFocused = activeView === 'HOME' || activeView === 'DATA' || activeView === 'RESEARCH';

  useEffect(() => {
    if (!isBooted) return;
    
    // Change this username to your actual GitHub username
    const username = 'DurgeshShewale29';
    
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=40`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        const validRepos = data.filter(repo => repo.size > 0);
        if (validRepos.length === 0) throw new Error('No repos found');
        
        const maxSize = Math.max(...validRepos.map(r => r.size));
        
        const mappedData = validRepos.map(repo => ({
          id: repo.id,
          name: repo.name,
          height: Math.max((repo.size / maxSize) * 100, 10),
          language: repo.language
        }));
        
        setRepos(mappedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("GitHub Fetch Error:", err);
        // Fallback to randomized mock data if API fails or rate limited
        setRepos([...Array(40)].map((_, i) => ({
          id: i,
          name: `Fallback-Data-${i}`,
          height: Math.random() * 80 + 10,
          fallback: true
        })));
        setLoading(false);
      });
  }, [isBooted]);

  if (!isBooted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isFocused ? 1 : 0.1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
      className="hud-panel" 
      style={{ width: '600px', padding: '1rem', pointerEvents: isFocused ? 'auto' : 'none' }}
    >
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-header)', fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
        GITHUB ACTIVITY {loading ? '(SCANNING...)' : ''}
      </div>
      
      <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', gap: '2px', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '4px' }}>
        {loading ? (
          // Framer Motion "scanning" animation while loading
          [...Array(40)].map((_, i) => (
            <motion.div key={i} 
              animate={{ height: ['10%', '100%', '10%'] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.05 }}
              style={{ 
                flex: 1, 
                background: 'rgba(0, 243, 255, 0.3)', 
                opacity: 0.5 
              }}
            />
          ))
        ) : (
          [...Array(40)].map((_, i) => {
            const repo = repos[i];
            if (repo) {
              return (
                <div key={repo.id} title={repo.name ? `${repo.name}` : ''} style={{ 
                  flex: 1, 
                  background: repo.fallback ? (i % 3 === 0 ? 'var(--color-accent)' : 'var(--color-primary)') : 'var(--color-primary)', 
                  height: `${repo.height}%`,
                  opacity: 0.8,
                  boxShadow: `0 0 5px var(--color-primary)`,
                  cursor: 'pointer'
                }}></div>
              );
            } else {
              return (
                <div key={`empty-${i}`} style={{
                  flex: 1,
                  background: 'rgba(0, 243, 255, 0.05)',
                  height: '2px',
                }}></div>
              );
            }
          })
        )}
      </div>
    </motion.div>
  );
}
