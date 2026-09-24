'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { getAllCategories } from '../lib/data';
import CategoryCard from '../components/category/CategoryCard';
import type { Category } from '../types/category';

export default function Home() {
  const [categories, setCategories] = useState<ReadonlyArray<Category>>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategories(getAllCategories());
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.title}>English From <span className={styles.highlight}>Zero</span></h1>
        <p className={styles.subtitle}>
          Học tiếng Anh giao tiếp từ con số 0. Chọn một chủ đề bên dưới để bắt đầu.
        </p>
      </header>

      <section className={styles.topicsGrid} style={{ marginBottom: '2rem' }}>
        {categories.map((category) => (
          <CategoryCard 
            key={category.slug} 
            category={category} 
          />
        ))}
      </section>

      <section className={styles.gameSection} style={{ textAlign: 'center', padding: '2rem', background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', borderRadius: '16px', color: 'white', cursor: 'pointer', boxShadow: '0 10px 30px rgba(108, 92, 231, 0.3)' }} onClick={() => window.location.href = '/games/arena'}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎮 Đấu Trường Tiếng Anh (Game Arena)</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', opacity: 0.9 }}>Chế độ chơi nhiều người cực vui! Thi tài từ vựng và nhận điểm số.</p>
        <button style={{ padding: '12px 30px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '30px', border: 'none', background: 'white', color: '#6c5ce7', cursor: 'pointer' }}>Vào Game Ngay ➡️</button>
      </section>
    </main>
  );
}
