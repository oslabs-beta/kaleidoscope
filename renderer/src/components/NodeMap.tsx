import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function NodeMap() {
    const canvasRef = useRef(null);
    const [circles, setCircles] = useState([
        { x: 100, y: 100, radius: 20, isDragging: false },
        { x: 200, y: 200, radius: 20, isDragging: false },
        { x: 300, y: 100, radius: 20, isDragging: false },
        { x: 150, y: 300, radius: 20, isDragging: false },
        { x: 250, y: 300, radius: 20, isDragging: false },
        { x: 100, y: 300, radius: 20, isDragging: false },
        { x: 200, y: 400, radius: 20, isDragging: false },
        { x: 300, y: 300, radius: 20, isDragging: false },
]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            circles.forEach(circle => {
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'black';
                ctx.fill();
            ctx.closePath();
        });

        for (let i = 0; i < circles.length - 1; i++) {
            const circleA = circles[i];
            const circleB = circles[i + 1];

            ctx.beginPath();
            ctx.moveTo(circleA.x, circleA.y);
            ctx.lineTo(circleB.x, circleB.y);
            ctx.strokeStyle = 'dark-gray';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    };

        const handleMouseDown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        circles.forEach(circle => {
            const distance = Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2);
            if (distance <= circle.radius) {
                circle.isDragging = true;
            }
        });
    };

    const handleMouseUp = () => {
        circles.forEach(circle => {
            circle.isDragging = false;
        });
    };

    const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        circles.forEach(circle => {
            if (circle.isDragging) {
            circle.x = mouseX;
            circle.y = mouseY;
            }
        });

        draw();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    draw();

    return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [circles]);

    return (
    <div>
        <h1 className='title'>Cluster Name: My Demo</h1>
            <canvas className='canvas' ref={canvasRef} width={1200} height={1200} />
            <Link to="/">
        <button>Go Back</button>
            </Link>
    </div>
    )
}
