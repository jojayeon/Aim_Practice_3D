// 버튼 컴포넌트 
import React from 'react';
import styles from '../styles/Button.module.css';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, style }) => {
  return (
    <button className={styles.button} onClick={onClick} style={style}>
      {children}
    </button>
  );
};

export default Button;

