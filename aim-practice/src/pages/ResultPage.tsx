// src/pages/ResultPage.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import styles from '../styles/ResultPage.module.css';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("📦 Received state from navigate:", location.state);
  const { score } = location.state || { score: 0 };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>게임 종료</h2>
      <p className={styles.score}>맞춘 타겟: {score} / 100</p>
      <Button onClick={() => navigate('/')}>다시 시작하기</Button>
    </div>
  );
};

export default ResultPage;
