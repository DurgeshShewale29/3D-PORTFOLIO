import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootLogs = [
  "SYSTEM BOOT INITIATED...",
  "ESTABLISHING NEURAL LINK...",
  "BYPASSING SECURITY PROTOCOLS...",
  "DECRYPTING ARCHIVES v2.1...",
  "SYNCING NODE...",
  "WELCOME..."
];

export default function BootSequence({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsDone(true), 400);
        setTimeout(() => onComplete(), 1000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#010409',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '4rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-primary)',
            fontSize: '1.2rem',
            textShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
          }}
        >
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ marginBottom: '0.5rem' }}
            >
              &gt; {log}
            </motion.div>
          ))}
          {!isDone && logs.length > 0 && (
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ display: 'inline-block', width: '10px', height: '1.2rem', backgroundColor: 'var(--color-primary)', marginTop: '0.5rem' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
