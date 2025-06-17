// GamePage3D.tsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "../styles/GamePage3D.module.css";

interface GamePage3DProps {
  difficulty: string;
  sensitivity: number;
}

const GamePage3D: React.FC<GamePage3DProps> = ({ difficulty, sensitivity }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bgSceneRef = useRef(new THREE.Scene());
  const targetSceneRef = useRef(new THREE.Scene());
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerLocked = useRef(false);

  const targetCameraRef = useRef(
    new THREE.PerspectiveCamera(103, window.innerWidth / window.innerHeight, 0.1, 1000)
  );
  const bgCameraRef = useRef(
    new THREE.PerspectiveCamera(103, window.innerWidth / window.innerHeight, 0.1, 1000)
  );

  const rotationRef = useRef({ yaw: 0, pitch: 0 });
  const [hitCount, setHitCount] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const targetsRef = useRef<{ mesh: THREE.Mesh; birth: number }[]>([]);
  const spawnedCount = useRef(0);

  const settings = {
    interval: 1000,
    lifespan: 2000,
    radius: 0.5,
  };

  const totalTargets = 100;

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));

  const spawnTarget = () => {
    const yaw = THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(-90, 90));
    const pitch = THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(-45, 45));
    const distance = 20;

    const x = distance * Math.cos(pitch) * Math.sin(yaw);
    const y = distance * Math.sin(pitch);
    const z = -distance * Math.cos(pitch) * Math.cos(yaw);

    const geometry = new THREE.SphereGeometry(settings.radius, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff5555 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    targetSceneRef.current.add(mesh);
    targetsRef.current.push({ mesh, birth: Date.now() });
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    bgCameraRef.current.position.set(0, 0, 0);
    targetCameraRef.current.position.set(0, 0, 0);

    // 배경 격자 + 돔
    const grid = new THREE.GridHelper(100, 50, 0xb0b0b0, 0x909090);
    grid.position.y = -1;

    // targetSceneRef에 추가:
    targetSceneRef.current.add(grid);

    const domeGeometry = new THREE.SphereGeometry(
      50,
      32,
      32,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );
    const domeMaterial = new THREE.MeshBasicMaterial({
      color: 0xd0d0d0, // 밝은 파란색 격자 느낌
      side: THREE.BackSide,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const domeMesh = new THREE.Mesh(domeGeometry, domeMaterial);
    bgSceneRef.current.add(domeMesh);

    bgSceneRef.current.add(domeMesh);

    // 격자와 함께 targetScene에 배경 벽 추가
    const wallMaterial = new THREE.MeshBasicMaterial({
      color: 0xa0a0a0,
      side: THREE.BackSide,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    // 좌우 벽
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(100, 50), wallMaterial);
    leftWall.position.set(-50, 24, 0);
    leftWall.rotation.y = Math.PI / 2;

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(100, 50), wallMaterial);
    rightWall.position.set(50, 24, 0);
    rightWall.rotation.y = -Math.PI / 2;

    // 뒤쪽 벽
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(100, 50), wallMaterial);
    backWall.position.set(0, 24, -50);
    backWall.rotation.y = Math.PI;

    // 추가
    targetSceneRef.current.add(leftWall, rightWall, backWall);

    // 초기화
    setHitCount(0);
    setRemaining(totalTargets);
    targetsRef.current = [];
    spawnedCount.current = 0;

    const spawnInterval = setInterval(() => {
      if (spawnedCount.current >= totalTargets) {
        clearInterval(spawnInterval);
        return;
      }
      spawnTarget();
      spawnedCount.current++;
    }, settings.interval);

    const animate = () => {
      requestAnimationFrame(animate);
      const now = Date.now();

      targetsRef.current = targetsRef.current.filter(({ mesh, birth }) => {
        if (now - birth > settings.lifespan) {
          targetSceneRef.current.remove(mesh);
          setRemaining((r) => r - 1);
          return false;
        }
        return true;
      });

      targetCameraRef.current.rotation.order = "YXZ";
      targetCameraRef.current.rotation.y = THREE.MathUtils.degToRad(rotationRef.current.yaw);
      targetCameraRef.current.rotation.x = THREE.MathUtils.degToRad(rotationRef.current.pitch);

      renderer.clear();
      renderer.render(bgSceneRef.current, bgCameraRef.current);
      renderer.render(targetSceneRef.current, targetCameraRef.current);
    };
    animate();

    const onMouseMove = (e: MouseEvent) => {
      if (!pointerLocked.current) return;
      rotationRef.current.yaw -= e.movementX * sensitivity * 0.1;
      rotationRef.current.pitch -= e.movementY * sensitivity * 0.1;
      rotationRef.current.yaw = clamp(rotationRef.current.yaw, -135, 135);
      rotationRef.current.pitch = clamp(rotationRef.current.pitch, -85, 85);
    };

    const onClick = (e: MouseEvent) => {
      if (!rendererRef.current) return;

      raycasterRef.current.setFromCamera(new THREE.Vector2(0, 0), targetCameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(
        targetsRef.current.map((t) => t.mesh)
      );
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        targetSceneRef.current.remove(hit);
        targetsRef.current = targetsRef.current.filter((t) => t.mesh !== hit);
        setHitCount((h) => h + 1);
        setRemaining((r) => r - 1);
      }
    };

    const onPointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement === renderer.domElement;
    };

    const onCanvasClick = () => {
      renderer.domElement.requestPointerLock();
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    renderer.domElement.addEventListener("click", onCanvasClick);

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);

      [bgCameraRef.current, targetCameraRef.current].forEach((cam) => {
        cam.aspect = width / height;
        cam.updateProjectionMatrix();
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(spawnInterval);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("click", onCanvasClick);

      if (mount && rendererRef.current) {
        mount.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [difficulty, sensitivity]);

  return (
    <div className={styles.container}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>
      <div className={styles.crosshair}>
        <div className={styles.crosshairH}></div>
        <div className={styles.crosshairV}></div>
      </div>
      <div className={styles.info}>
        Hits: {hitCount}
        <br />
        Remaining: {remaining}
        <div className={styles.instruction}>Click to lock pointer and aim</div>
      </div>
    </div>
  );
};

export default GamePage3D;
