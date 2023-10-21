import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/base.css'
import './NodeMap.css';
import { AnnotationForm } from '../AnnotationForm/AnnotationForm';

// NodeMap component renders a canvas with draggable nodes and annotations.

export default function NodeMap() {
      // Reference to canvas DOM element
    const canvasRef = useRef(null);

    // State to manage the circles (nodes) on the canvas
    const [circles, setCircles] = useState([
        // Initialize circles with some positions, radius, and drag status
        { x: 100, y: 100, radius: 20, isDragging: false },
        { x: 200, y: 200, radius: 20, isDragging: false },
        { x: 300, y: 100, radius: 20, isDragging: false },
        { x: 150, y: 300, radius: 20, isDragging: false },
        { x: 250, y: 300, radius: 20, isDragging: false },
        { x: 100, y: 300, radius: 20, isDragging: false },
        { x: 200, y: 400, radius: 20, isDragging: false },
        { x: 300, y: 300, radius: 20, isDragging: false },
    ]);

    // State to manage annotation form visibility and position
    const [showAnnotation, setShowAnnotation] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    // State to manage annotation mode
    const [inAnnotationMode, setInAnnotationMode] = useState(false);

    // Toggle annotation mode on/off
    const toggleAnnotationMode = () => setInAnnotationMode(!inAnnotationMode);

    // Draws a circle on the canvas
    const drawCircle = (ctx, circle) => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
      };
    
    // Draws a line between two circles on the canvas
    const drawLine = (ctx, circleA, circleB) => {
        ctx.beginPath();
        ctx.moveTo(circleA.x, circleA.y);
        ctx.lineTo(circleB.x, circleB.y);
        ctx.strokeStyle = 'dark-gray';
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    // Handles mousedown event on the canvas
    const handleMouseDown = (e, circles, canvas, inAnnotationMode, setPosition, setShowAnnotation) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        if (inAnnotationMode) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setPosition({ x, y });
            setShowAnnotation(true);
        } else {
            circles.forEach(circle => {
                const distance = Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2);
                if (distance <= circle.radius) {
                    circle.isDragging = true;
                }
            });
        }

    };
    
    // Handles mouseup event on the canvas
    const handleMouseUp = (circles) => {
        circles.forEach(circle => {
            circle.isDragging = false;
        });
    };

    // Handles mousemove event on the canvas
    const handleMouseMove = (e, circles, canvas, draw) => {
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
    

    // useEffect to set up canvas and event listeners
    useEffect(() => {
        // Get the canvas and 2D context
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Function to draw all nodes and connections
        const draw = () => {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw each circle
            circles.forEach(circle => {
                drawCircle(ctx, circle);
            });
            // Draw lines between adjacent circles
            for (let i = 0; i < circles.length - 1; i++) {
                const circleA = circles[i];
                const circleB = circles[i + 1];
                drawLine(ctx, circleA, circleB);
            }
        };

        // Attach event listeners
        canvas.addEventListener('mousedown', (e) => handleMouseDown(e, circles, canvas, inAnnotationMode, setPosition, setShowAnnotation));
        canvas.addEventListener('mouseup', () => handleMouseUp(circles));
        canvas.addEventListener('mousemove', (e) => handleMouseMove(e, circles, canvas, draw));

        draw();

        // Cleanup: remove event listeners
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [circles]);

    return (
    <div>
        <h1 className='title'>Cluster Name: My Demo</h1>
        <canvas className='canvas' ref={canvasRef} height={800} width={1600}/>
        {showAnnotation && 
            <AnnotationForm 
                x={position.x} 
                y={position.y} 
                onSave={(text) => { /* Handle saving annotation */ }}
                onCancel={() => setShowAnnotation(false)} 
            />
        }
        <Link to="/">
            <button>Go Back</button>
        </Link>
        <button id="annotationModeButton" onClick={toggleAnnotationMode}>
            {inAnnotationMode ? 'Exit Annotation Mode' : 'Create Annotation'}
        </button>
    </div>
    )
}
