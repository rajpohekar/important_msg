import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const createHeartGeometry = () => {
  const shape = new THREE.Shape();

  shape.moveTo(0, 0.72);
  shape.bezierCurveTo(-0.88, 1.25, -1.72, 0.42, -1.32, -0.38);
  shape.bezierCurveTo(-1.05, -0.92, -0.34, -1.18, 0, -1.55);
  shape.bezierCurveTo(0.34, -1.18, 1.05, -0.92, 1.32, -0.38);
  shape.bezierCurveTo(1.72, 0.42, 0.88, 1.25, 0, 0.72);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.38,
    bevelEnabled: true,
    bevelSegments: 14,
    bevelSize: 0.08,
    bevelThickness: 0.08,
    curveSegments: 44,
  });

  geometry.center();
  return geometry;
};

const HeartModel = ({ parallax = { x: 0, y: 0 }, reducedMotion = false }) => {
  const group = useRef();
  const geometry = useMemo(createHeartGeometry, []);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;

    const targetY = parallax.x * 0.25 + state.clock.elapsedTime * 0.28;
    const targetX = -parallax.y * 0.16 + Math.sin(state.clock.elapsedTime * 0.9) * 0.06;

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.045);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.045);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.15) * 0.08;
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, parallax.x * 0.06, 0.045);
    group.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.015);
    group.current.rotation.z += delta * 0.03;
  });

  return (
    <group ref={group} scale={0.78} rotation={[0.08, -0.16, 0]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#FF8FB2"
          emissive="#FFBFD4"
          emissiveIntensity={0.18}
          roughness={0.24}
          metalness={0.08}
          clearcoat={0.9}
          clearcoatRoughness={0.18}
        />
      </mesh>
      <mesh geometry={geometry} scale={1.08}>
        <meshBasicMaterial color="#FFBFD4" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

export default HeartModel;
