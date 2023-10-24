import React, { useEffect, useRef, useState } from 'react';

import { Link } from 'react-router-dom';
import { AnnotationForm } from '../AnnotationForm/AnnotationForm';
import { AnnotationMenu } from '../AnnotationMenu/AnnotationMenu';

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
    const toggleAnnotationMode = () => {
        console.log('toggle annotation mode');
        setInAnnotationMode(!inAnnotationMode);
    };

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

    // Function to draw canvas
    const draw = (canvasContext, canvas) => {
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

    /* ------------------------------ The useEffect Zone------------------------------ */

    // useEffect for event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');

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

            draw(canvasContext, canvas);
        };

        // Attach event listeners
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);

        // Add mouseout event listener to clear hover state
        canvas.addEventListener('mouseout', () => {
            circles.forEach(circle => {
                circle.isHovered = false;
            });
            draw(canvasContext, canvas);
        });
    
        draw(canvasContext, canvas);
    
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);

        };
    }, [inAnnotationMode]);

    //resizing useEffect
    useEffect(() => {
        const updateCanvasSize = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const canvasContext = canvas.getContext('2d');
                canvas.width = window.innerWidth * 0.8; // 80% of window width
                canvas.height = window.innerHeight * 0.6; // 60% of window height
                draw(canvasContext, canvas);
            }
        };
        
        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize(); // Call it once to set initial size
        
        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [circles, traceData, lines]);

    /* ------------------------------ Rendering ------------------------------ */

    return (
        
        <div className="flex flex-col items-center justify-center h-screen">
            <div>
                In Annotation Mode: {inAnnotationMode.toString()}
            </div>
            {/* Title */}
            <h3 className="text-4xl text-center mb-4"> Node Map </h3>
        
            {/* Canvas */}
            <div className="canvas-container w-4/5 h-3/5 relative">
                <canvas className="absolute inset-0 border-dashed border-2 border-gray-600 w-full h-full" ref={canvasRef} />
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
            <div className="flex justify-center mt-4">
                <Link to="/" className="mr-2">
                    <button className="bg-blue-500 text-white p-2 rounded">Go Back</button>
                </Link>
                <button onClick={toggleAnnotationMode} className="bg-blue-500 text-white p-2 rounded mr-2">
                    {inAnnotationMode ? 'Exit Annotation Mode' : 'Create Annotation'}
                </button>
                <button onClick={toggleAnnotationMenu} className="bg-blue-500 text-white p-2 rounded">
                    {showAnnotationMenu ? 'Hide Annotation Menu' : 'Show Annotation Menu'}
                </button>
            </div>
        </div>
    );
}
