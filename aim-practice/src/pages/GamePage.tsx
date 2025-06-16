import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TargetItem from '../components/TargetItem';
import styles from '../styles/GamePage.module.css';

interface Target {
  id: string;
  x: number;
  y: number;
  createdAt: number;
}

const TOTAL_TARGETS = 100;

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const playAreaRef = useRef<HTMLDivElement>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [hitCount, setHitCount] = useState(0);
  const spawnedCount = useRef(0);

  // 난이도 설정
  const difficultyLevels = {
    easy: { interval: 1000, lifetime: 2000, size: 30 },
    medium: { interval: 700, lifetime: 1400, size: 16 },
    hard: { interval: 500, lifetime: 1000, size: 12 },
  } as const;

  type Difficulty = keyof typeof difficultyLevels;

  // StartPage에서 전달받은 난이도, 감도
  const { difficulty = 'medium', sensitivity = 1 } = location.state || {};
  const settings = difficultyLevels[difficulty as Difficulty];

  const spawnIntervalMs = settings.interval;
  const lifetimeMs = settings.lifetime;
  const targetSize = settings.size;

  // 조준점 위치 상태 (픽셀 단위), 초기 화면 중앙
  const [aimPos, setAimPos] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  // 타겟 생성 로직
  useEffect(() => {
    const interval = setInterval(() => {
      if (spawnedCount.current >= TOTAL_TARGETS) {
        clearInterval(interval);
        return;
      }
      const newTarget: Target = {
        id: crypto.randomUUID(),
        x: Math.random() * 88 + 10, // 플레이 영역 내 적당한 위치
        y: Math.random() * 85 + 10,
        createdAt: Date.now(),
      };
      setTargets((prev) => [...prev, newTarget]);
      spawnedCount.current += 1;
    }, spawnIntervalMs);

    return () => clearInterval(interval);
  }, [spawnIntervalMs]);

  // 타겟 제거 로직
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTargets((prev) => prev.filter((t) => now - t.createdAt < lifetimeMs));
    }, 500);

    return () => clearInterval(cleanup);
  }, [lifetimeMs]);

  // pointer lock 및 감도 적용 마우스 이동 처리
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setAimPos((pos) => {
        let newX = pos.x + e.movementX * sensitivity;
        let newY = pos.y + e.movementY * sensitivity;

        const margin = 10; 
        // 조준점 반지름 + 여유//화면밖으로 나가는 translate(-50%)을 방지하기 위한 조치

        // 화면 밖으로 나가지 않도록 제한
        newX = Math.min(Math.max(newX, margin), window.innerWidth - margin);
        newY = Math.min(Math.max(newY, margin), window.innerHeight - margin);

        return { x: newX, y: newY };
      });
    };

    const handleClickLock = () => {
    if (document.pointerLockElement !== playAreaRef.current) {
      playAreaRef.current?.requestPointerLock();
    }
  };

  document.addEventListener('mousemove', handleMove);
  document.addEventListener('click', handleClickLock);
  return () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('click', handleClickLock);
  };
}, [sensitivity]);


// 클릭 시 타겟 적중 판정
const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!playAreaRef.current) return;

  const playAreaRect = playAreaRef.current.getBoundingClientRect();

  const clickX = aimPos.x; // 화면 기준 절대 좌표 (window)
  const clickY = aimPos.y;

  // 타겟과 비교할 때도 절대 좌표 기준으로 계산
  for (const target of targets) {
    const targetX = (target.x / 100) * playAreaRect.width;
    const targetY = (target.y / 100) * playAreaRect.height;
    
    const distance = Math.hypot(targetX - clickX, targetY - clickY);

    if (distance <= (targetSize / 2)+0.5) {
      // 적중 처리
      setHitCount((prev) => prev + 1);
      setTargets((prev) => prev.filter((t) => t.id !== target.id));
      break;
    }
  }
};

  // 게임 종료 조건 체크
  useEffect(() => {
    if (spawnedCount.current === TOTAL_TARGETS && targets.length === 0) {
      navigate('/result', { state: { score: hitCount } });
    }
  }, [targets, hitCount, navigate]);

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.info}>
        난이도: {difficulty.toUpperCase()} | 감도: {sensitivity} | 맞춘 타겟: {hitCount} / {TOTAL_TARGETS}
      </div>

      <div className={styles.playArea} ref={playAreaRef}>
        {targets.map((target) => (
          <TargetItem
            key={target.id}
            x={target.x}
            y={target.y}
            size={targetSize}
          />
        ))}
        {/* 조준점 위치를 실시간 style로 반영 */}
        <div
          className={styles.aim}
          style={{
            top: aimPos.y,
            left: aimPos.x,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
};

export default GamePage;
