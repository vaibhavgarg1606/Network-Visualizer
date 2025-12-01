'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function WASDControls() {
    const { camera } = useThree();

    useEffect(() => {
        const keys: Record<string, boolean> = {};
        const moveSpeed = 0.5;

        const handleKeyDown = (e: KeyboardEvent) => {
            keys[e.code] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keys[e.code] = false;
        };

        const moveCamera = () => {
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);

            const right = new THREE.Vector3();
            right.crossVectors(camera.up, direction).normalize();

            if (keys['KeyW'] || keys['ArrowUp']) {
                camera.position.add(direction.multiplyScalar(moveSpeed));
            }
            if (keys['KeyS'] || keys['ArrowDown']) {
                camera.position.sub(direction.multiplyScalar(moveSpeed));
            }
            if (keys['KeyA'] || keys['ArrowLeft']) {
                camera.position.add(right.multiplyScalar(moveSpeed));
            }
            if (keys['KeyD'] || keys['ArrowRight']) {
                camera.position.sub(right.multiplyScalar(moveSpeed));
            }
            if (keys['Space']) {
                camera.position.y += moveSpeed;
            }
            if (keys['ShiftLeft'] || keys['ShiftRight']) {
                camera.position.y -= moveSpeed;
            }
        };

        const interval = setInterval(moveCamera, 16); // ~60fps

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [camera]);

    return null;
}
