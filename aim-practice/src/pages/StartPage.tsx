import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Startpage.module.css';
import Button from '../components/Button';

const StartPage = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [sensitivity, setSensitivity] = useState(1); // 기본 감도

  const handleStart = () => {
    // 감도는 0.1 ~ 10 범위로 제한
    const validSensitivity = Math.max(0.1, Math.min(10, sensitivity));

    navigate('/game', { state: { difficulty, sensitivity: validSensitivity } });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎯 에임 연습</h1>

      <div className={styles.difficultySelector}>
        {['easy', 'medium', 'hard'].map((level) => (
          <Button
            key={level}
            onClick={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
            style={{
              backgroundColor: difficulty === level ? '#4caf50' : '#ddd',
              color: difficulty === level ? 'white' : 'black',
              margin: '0 8px',
            }}
          >
            {level.toUpperCase()}
          </Button>
        ))}
      </div>

      <div className={styles.sensitivityInput} style={{ marginTop: '20px' }}>
        <label htmlFor="sensitivity" style={{ marginRight: '10px' }}>
          감도 (0.1 ~ 10):
        </label>
        <input
          id="sensitivity"
          type="number"
          min="0.1"
          max="10"
          step="0.1"
          value={sensitivity}
          onChange={(e) => setSensitivity(parseFloat(e.target.value))}
        />
      </div>

      <Button onClick={handleStart} style={{ marginTop: '20px' }}>
        시작하기
      </Button>
    </div>
  );
};

export default StartPage;
