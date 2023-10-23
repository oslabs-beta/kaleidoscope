import React, { useEffect, useRef, useState } from 'react';

import { Link } from 'react-router-dom';
import { AnnotationForm } from '../AnnotationForm/AnnotationForm';
import { AnnotationMenu } from '../AnnotationMenu/AnnotationMenu';

import Button from '@mui/material/Button';
import  Typography  from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import './NodeMap.css';

// Circle type definition
interface Circle {
    id: number;
    x: number;
    y: number;
    radius: number;
    isDragging: boolean;
    isHovered: boolean; // Add isHovered property
}

// Main NodeMap component
export default function NodeMap() {
    /* ------------------------------ State Management ------------------------------ */

    // Reference to canvas DOM element
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // State to hold circle information
    const [circles, setCircles] = useState<Circle[]>([
        // Initial circles
        { id: 1, x: 100, y: 100, radius: 20, isDragging: false, isHovered: false },
        { id: 2, x: 200, y: 200, radius: 20, isDragging: false, isHovered: false },
        { id: 3, x: 300, y: 300, radius: 20, isDragging: false, isHovered: false },
        // Add more circles
    ]);
    // Should be converted to state
    const traceData = [
        { id: 1, label: 'Endpoint 1', traceInfo: 'Information for Node 1' },
        { id: 2, label: 'Endpoint 2', traceInfo: 'Information for Node 2' },
        { id: 3, label: 'Endpoint 3', traceInfo: 'Information for Node 3' },
        // Add more trace data
    ];
    // Should be converted to state
    const lines = [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
    ];
    // State to handle saved annotations
    const [annotations, setAnnotations] = useState([]);
    const [showAnnotation, setShowAnnotation] = useState(false);
    const [showAnnotationMenu, setShowAnnotationMenu] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [inAnnotationMode, setInAnnotationMode] = useState(false);
    const [selectedCircle, setSelectedCircle] = useState(null);
    const [selectedLine, setSelectedLine] = useState(null);

   /* ------------------------------ Helper Functions ------------------------------ */

    // Function to toggle annotation mode
    const toggleAnnotationMode = () => setInAnnotationMode(!inAnnotationMode);

    // Function to toggle annotation menu
    const toggleAnnotationMenu = () => setShowAnnotationMenu(!showAnnotationMenu);

    // Function to draw circle on canvas
    const drawCircle = (canvasContext, circle) => {
        canvasContext.beginPath();
        canvasContext.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        canvasContext.fillStyle = 'black';
        canvasContext.fill();
        canvasContext.closePath();
    };

    // Function to draw line between circles
    const drawLine = (canvasContext, circleA, circleB) => {
        canvasContext.beginPath();
        canvasContext.moveTo(circleA.x, circleA.y);
        canvasContext.lineTo(circleB.x, circleB.y);
        canvasContext.strokeStyle = 'dark-gray';
        canvasContext.lineWidth = 5;
        canvasContext.stroke();
    };

    /* ------------------------------ The World's Biggest useEffect------------------------------ */

    // useEffect to handle canvas rendering and interactions
    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');

        const updateCanvasSize = () => {
            if (canvasRef.current) {
              canvasRef.current.width = window.innerWidth * 0.8; // 80% of window width
              canvasRef.current.height = window.innerHeight * 0.8; // 80% of window height
            }
          };

        // Initial update
        updateCanvasSize();

        const draw = () => {
            // clear canvas
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);

            // Draw lines with labels
            lines.forEach(line => {
                const fromCircle = circles.find(circle => circle.id === line.from);
                const toCircle = circles.find(circle => circle.id === line.to);

                // Draw line
                drawLine(canvasContext, fromCircle, toCircle);

                // Calculate the midpoint of the line for label positioning
                const labelX = (fromCircle.x + toCircle.x) / 2;
                const labelY = (fromCircle.y + toCircle.y) / 2;

                // Display label
                canvasContext.font = '12px Arial';
                canvasContext.fillStyle = 'red';
                canvasContext.fillText('Trace Data', labelX, labelY);
            });

            // Draw circles and node labels
            circles.forEach(circle => {
                // call helper func
                drawCircle(canvasContext, circle);

                // Display trace data on the circle
                // needs to be reconfigured w/ store
                const data = traceData.find(data => data.id === circle.id); // needs to reference properties of trace data (span_id, trace_id, etc.)
                if (data) {
                    canvasContext.font = '12px Arial';
                    canvasContext.fillStyle = 'white';
                    canvasContext.fillText(data.label, circle.x - 15, circle.y);
                }
            });
        };

        // Handles mousedown event on the canvas
        const handleMouseDown = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            if (inAnnotationMode) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                if (!selectedCircle) {
                    setPosition({ x, y });
                    setShowAnnotation(true);
                    circles.forEach(circle => {
                        const distance = Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2);
                        if (distance <= circle.radius) {
                            console.log('selected circle', circle.id)
                            setSelectedCircle(circle);
                        }
                    });
                    lines.forEach(line => {
                        const fromCircle = circles.find(circle => circle.id === line.from);
                        const toCircle = circles.find(circle => circle.id === line.to);
                        const slope = (toCircle.y - fromCircle.y) / (toCircle.x - fromCircle.x);
                        const yIntercept = fromCircle.y - slope * fromCircle.x;
                        const distance = Math.abs(slope * mouseX - mouseY + yIntercept) / Math.sqrt(slope ** 2 + 1);
                        if (distance <= 5) {
                            console.log('selected line', line)
                            setSelectedLine(line);
                        }
                    });
                }
            } else {
                circles.forEach(circle => {
                    const distance = Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2);
                    if (distance <= circle.radius) {
                        console.log('selected circle', circle.id)
                        circle.isDragging = true;
                    }
                });
            }
        };

        // Handles mouseup event on the canvas
        const handleMouseUp = () => {
            circles.forEach(circle => {
                circle.isDragging = false;
            });
        };

        // Handles mousemove event on the canvas
        const handleMouseMove = (e: MouseEvent) => {
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

        // Attach event listeners
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);

        // Update canvas size when window resizes
        window.addEventListener('resize', updateCanvasSize);

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
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [circles, traceData, lines]);

    /* ------------------------------ Rendering ------------------------------ */

    return (
        <Box sx={{ p: 2, border: '1px dashed grey' }}>
            {/* Title */}
            <Typography variant="h3" component="div" align="center">
                Node Map
            </Typography>
        
            {/* Canvas */}
            <div className="canvas-container">
                <canvas className='canvas' ref={canvasRef} style={{ border: '1px dashed grey' }} />
            </div>
            {/* Conditional rendering of AnnotationForm */}
            {showAnnotation && (selectedCircle || selectedLine) && 
                <AnnotationForm
                    x={position.x}
                    y={position.y}
                    onSave={(annotationText) => {
                        console.log('Annotation saved: ', annotationText);
                        setShowAnnotation(false);
                        setSelectedLine(null);
                        setSelectedCircle(null);
                    }}
                    onCancel={() => {
                        setShowAnnotation(false);
                        setSelectedLine(null);
                        setSelectedCircle(null);
                    }}
                />
            }
            {/* Conditional rendering of AnnotationMenu */}
            {showAnnotationMenu && <AnnotationMenu />}
            {/* Navigation buttons */}
            <Container fixed style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/">
                    <Button>Go Back</Button>
                </Link>
                <Button id="annotationModeButton" onClick={toggleAnnotationMode}>
                    {inAnnotationMode ? 'Exit Annotation Mode' : 'Create Annotation'}
                </Button>
                <Button id="showAnnotationMenu" onClick={toggleAnnotationMenu}>
                    {showAnnotationMenu ? 'Hide Annotation Menu' : 'Show Annotation Menu'}
                </Button>
            </Container>
        </Box>
    );
}
