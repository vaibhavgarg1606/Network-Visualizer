'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

export default function CameraController() {
    const { camera } = useThree();
    const [, get] = useKeyboardControls();
    const velocity = useRef(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());
    const isDragging = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseDown = () => {
            isDragging.current = true;
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!isDragging.current) return;

            const deltaX = event.clientX - previousMousePosition.current.x;
            const deltaY = event.clientY - previousMousePosition.current.y;

            previousMousePosition.current = { x: event.clientX, y: event.clientY };

            // Rotate camera
            const euler = new THREE.Euler(0, 0, 0, 'YXZ');
            euler.setFromQuaternion(camera.quaternion);
            euler.y -= deltaX * 0.002;
            euler.x -= deltaY * 0.002;
            euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
            camera.quaternion.setFromEuler(euler);
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [camera]);

    useFrame((state, delta) => {
        const { forward, backward, left, right, up, down } = get();

        const speed = 5;

        // Get camera direction
        camera.getWorldDirection(direction.current);

        // Calculate movement
        const moveVector = new THREE.Vector3();

        if (forward) moveVector.add(direction.current);
        if (backward) moveVector.sub(direction.current);

        const rightVector = new THREE.Vector3();
        rightVector.crossVectors(camera.up, direction.current).normalize();

        if (left) moveVector.add(rightVector);
        if (right) moveVector.sub(rightVector);

        if (up) moveVector.y += 1;
        if (down) moveVector.y -= 1;

        // Apply movement
        velocity.current.lerp(moveVector.normalize().multiplyScalar(speed), 0.1);
        camera.position.add(velocity.current.clone().multiplyScalar(delta));
    });

    return null;
}
