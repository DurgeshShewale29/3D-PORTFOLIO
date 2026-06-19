import React from 'react';

export default function ContactSection() {
  return (
    <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>INITIATE CONTACT</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '400px' }}>
        Ready to build the next generation of intelligent systems? Open a secure channel.
      </p>
      <button className="glass-panel" style={{ 
        padding: '1rem 3rem', 
        fontSize: '1.2rem', 
        color: 'var(--color-primary)',
        cursor: 'pointer',
        background: 'rgba(0, 210, 255, 0.1)',
        border: '1px solid var(--color-primary)',
        transition: 'all 0.3s ease',
        fontFamily: 'var(--font-mono)'
      }}>
        &gt; CONNECT_NOW
      </button>
    </section>
  );
}
