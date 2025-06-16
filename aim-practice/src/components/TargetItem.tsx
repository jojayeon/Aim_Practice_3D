// src/components/TargetItem.tsx
import React from 'react';
import styles from '../styles/TargetItem.module.css';

interface TargetProps {
  x: number;
  y: number;
  size: number; // 🔹 size 추가
}

const TargetItem: React.FC<TargetProps> = ({ x, y, size }) => {
  return (
    <div
      className={styles.target}
      style={{
        top: `${y}%`,
        left: `${x}%`,
        width: `${size}px`,   // 🔹 크기 적용
        height: `${size}px`,
      }}
    />
  );
};

export default TargetItem;
