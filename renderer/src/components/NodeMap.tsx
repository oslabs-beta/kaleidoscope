import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface Circle {
    id: number;
    x: number;
    y: number;
    radius: number;
    isDragging: boolean;
    isHovered: boolean; // Add isHovered property
}

export default function NodeMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [circles, setCircles] = useState<Circle[]>([
        // Change Id values to be represent incoming data values
        { id: 1, x: 100, y: 100, radius: 20, isDragging: false, isHovered: false },
        { id: 2, x: 200, y: 200, radius: 20, isDragging: false, isHovered: false },
        { id: 3, x: 300, y: 300, radius: 20, isDragging: false, isHovered: false },
        // Add more circles with IDs and initial positions
    ]);

    // Define your trace data (replace this with your actual data)
    const traceData = [
        { id: 1, label: 'Endpoint 1', traceInfo: 'Information for Node 1' },
        { id: 2, label: 'Endpoint 2', traceInfo: 'Information for Node 2' },
        { id: 3, label: 'Endpoint 3', traceInfo: 'Information for Node 3' },
        // Add more trace data
    ];

    // Define line data
    const lines = [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        // { from: 3, to: 1 },
        // Define connections between nodes
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw lines with labels
            lines.forEach(line => {
                const fromCircle = circles.find(circle => circle.id === line.from);
                const toCircle = circles.find(circle => circle.id === line.to);

                // Draw line
                ctx.beginPath();
                ctx.moveTo(fromCircle.x, fromCircle.y);
                ctx.lineTo(toCircle.x, toCircle.y);
                ctx.strokeStyle = 'dark-gray';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Calculate the midpoint of the line for label positioning
                const labelX = (fromCircle.x + toCircle.x) / 2;
                const labelY = (fromCircle.y + toCircle.y) / 2;

                // Display label
                ctx.font = '12px Arial';
                ctx.fillStyle = 'red';
                ctx.fillText('Trace Data', labelX, labelY);
            });

            // Draw circles and node labels
            circles.forEach(circle => {
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                ctx.fillStyle = circle.isHovered ? 'green' : 'blue'; // Change fill color on hover
                ctx.fill();
                ctx.closePath();

                // Display trace data on the circle
                const data = traceData.find(data => data.id === circle.id);
                if (data) {
                    ctx.font = '12px Arial';
                    ctx.fillStyle = 'white';
                    ctx.fillText(data.label, circle.x - 15, circle.y);
                }
            });
        };

        const handleMouseDown = (e: MouseEvent) => {
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

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            circles.forEach(circle => {
                const distance = Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2);
                if (distance <= circle.radius) {
                    circle.isHovered = true; // Set isHovered to true when hovering over the circle
                } else {
                    circle.isHovered = false; // Set isHovered to false when not hovering
                }

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

        // Add mouseout event listener to clear hover state
        canvas.addEventListener('mouseout', () => {
            circles.forEach(circle => {
                circle.isHovered = false;
            });
            draw();
        });

        draw();

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [circles, traceData, lines]);

    return (
        <div>
            <h1 className='title'>Cluster Name: My Demo</h1>
            <canvas className='canvas' ref={canvasRef} width={1200} height={1200} />
            <Link to="/">
                <button>Go Back</button>
            </Link>
        </div>
    );
}
