import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Startpage.module.css';
import Button from '../components/Button';

const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [sensitivity, setSensitivity] = useState<number>(1);
  const [gameMode, setGameMode] = useState<'2d' | '3d'>('2d');

  const handleStart = () => {
    const clampedSensitivity = Math.max(0.1, Math.min(10, sensitivity || 1));
    const route = gameMode === '3d' ? '/game3d' : '/game';
    navigate(route, {
      state: { difficulty, sensitivity: clampedSensitivity }
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>에임 트레이너</h1>

      <div className={styles.selectGroup}>
        <label htmlFor="gameMode">게임 모드:</label>
        <select
          id="gameMode"
          value={gameMode}
          onChange={(e) => setGameMode(e.target.value as '2d' | '3d')}
          className={styles.select}
        >
          <option value="2d">2D 모드</option>
          <option value="3d">3D 모드</option>
        </select>
      </div>

      <div className={styles.selectGroup}>
        <label htmlFor="difficulty">난이도:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
          className={styles.select}
        >
          <option value="easy">쉬움</option>
          <option value="medium">보통</option>
          <option value="hard">어려움</option>
        </select>
      </div>

      <div className={styles.selectGroup}>
        <label htmlFor="sensitivity">마우스 감도:</label>
        <input
          id="sensitivity"
          type="number"
          min="0.1"
          max="10"
          step="0.1"
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          className={styles.input}
        />
      </div>

      <Button onClick={handleStart}>게임 시작</Button>
    </div>
  );
};

export default StartPage;
