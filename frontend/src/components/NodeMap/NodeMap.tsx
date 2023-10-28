import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnnotationForm } from '../AnnotationForm/AnnotationForm';
import { AnnotationMenu } from '../AnnotationMenu/AnnotationMenu';
import { Circle, Line, Span } from '../../types';
import { draw } from './draw';

type NodeMapResponse = [Circle[], Line[]];

// Main NodeMap component
export default function NodeMap() {
    /* ------------------------------ State Management ------------------------------ */
    
    // Reference to canvas DOM element
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // State to handle saved annotations
    const [annotations, setAnnotations] = useState([]);
    const [showAnnotation, setShowAnnotation] = useState(false);
    const [showAnnotationMenu, setShowAnnotationMenu] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [inAnnotationMode, setInAnnotationMode] = useState(false);
    const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
    const [selectedLine, setSelectedLine] = useState<Line | null>(null);
    const [lines, setLines] = useState<Line[]>([]);
    const [circles, setCircles] = useState<Circle[]>([]);

   /* ------------------------------ Helper Functions ------------------------------ */

     // Toggle annotation mode on/off
    const toggleAnnotationMode = () => setInAnnotationMode(!inAnnotationMode);

    // Function to toggle annotation menu
    const toggleAnnotationMenu = () => setShowAnnotationMenu(!showAnnotationMenu);

        /* ------------------------------ The useEffect Zone------------------------------ */

    // Makes map w/ new nodes and lines
    useEffect(() => {
        const getNewNodeMap = async () => {
            let result = await fetch('http://localhost:3001/nodemap'); // fetch goes here
            const data: NodeMapResponse = await result.json();
            setCircles(data[0]);
            setLines(data[1]);
        }
        getNewNodeMap();
    }, [])
    
    // Draws canvas
    useEffect(() => {
        // Get spans (trace data) and parse it into circles and lines
        const canvas = canvasRef.current;

        // Make sure canvas is defined
        if(!canvas){
            console.log('canvas is undefined')
            return; 
        } 

        // Get canvas context
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
                            setSelectedCircle(circle);
                        }
                    });
                    lines.forEach(line => {
                        const fromCircle = circles.find(circle => circle.name === line.from);
                        const toCircle = circles.find(circle => circle.name === line.to);
                        if (!fromCircle || !toCircle) {
                            console.warn("Circle not found for line:", line);
                            return;
                        }
                        const slope = (toCircle.y - fromCircle.y) / (toCircle.x - fromCircle.x);
                        const yIntercept = fromCircle.y - slope * fromCircle.x;
                        const distance = Math.abs(slope * mouseX - mouseY + yIntercept) / Math.sqrt(slope ** 2 + 1);
                        if (distance <= 5) {
                            console.log('selected line', line)
                            setSelectedLine(line);
                        }
                    });
                }
                circles.forEach(circle => {
                    const distance = Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2);
                    if (distance <= circle.radius) {
                        console.log('selected circle', circle.id)
                        setSelectedCircle(circle);
                    }
                });
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

            if (canvasContext) {
                draw(canvasContext, canvas, circles, lines);
            } else {
                console.warn("Canvas context is not available");
            }
        };

        const handleMouseOut = () => {
            circles.forEach(circle => {
                circle.isHovered = false;
            });
            if (canvasContext) {
                draw(canvasContext, canvas, circles, lines);
            } else {
                console.warn("Canvas context is not available");
            }
        }

        const addEventListeners = () => {
            // Attach event listeners
            canvas.addEventListener('mousedown', handleMouseDown);
            canvas.addEventListener('mouseup', handleMouseUp);
            canvas.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('mouseout', handleMouseOut);
        }

        const removeEventListeners = () => {
            // Remove event listeners
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseout', handleMouseOut);
        }

        // Add event listeners
        addEventListeners();
        if (canvasContext) {
            draw(canvasContext, canvas, circles, lines);
        } else {
            console.warn("Canvas context is not available");
        }

        return () => {
            removeEventListeners();
        };
    }, [circles, lines, inAnnotationMode]);

    // Resizes canvas w/ window
    useEffect(() => {
        const updateCanvasSize = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const canvasContext = canvas.getContext('2d');
                canvas.width = canvas.clientWidth; 
                canvas.height = canvas.clientHeight; 
                if (canvasContext) {
                    draw(canvasContext, canvas, circles, lines);
                } else {
                    console.warn("Canvas context is not available");
                }
            }
        };
        
        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize(); // Call it once to set initial size
        
        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-900 via-slate-800 to-cyan-900">
            <div>
                In Annotation Mode: {inAnnotationMode.toString()}
            </div>
            {/* Title */}
            <h3 className="text-4xl text-center text-sky-50 mb-4"> Node Map </h3>
        
            {/* Canvas and Buttons container */}
            <div className="flex flex-col h-full w-full justify-between">
                <div className="flex w-full overflow-y-auto">
                    <div className="relative canvas-container flex-grow p-8">
                        <canvas className="relative inset-0 border-solid border-2 border-gray-600 rounded-md w-full h-full" ref={canvasRef} />
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
                                onCancel={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    setShowAnnotation(false);
                                    setSelectedLine(null);
                                    setSelectedCircle(null);
                                }}
                            />
                        }
                    </div>

                    {/* Conditional rendering of AnnotationMenu */}
                    {showAnnotationMenu && <AnnotationMenu />}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-center mb-4 mt-2">
                    <Link to="/" className="mr-2">
                        <button className="bg-cyan-950 text-sky-50 p-2 rounded">Go Back</button>
                    </Link>
                    <button onClick={toggleAnnotationMode} className="bg-cyan-200 text-cyan-950 p-2 rounded mr-2">
                        {inAnnotationMode ? 'Exit Annotation Mode' : 'Create Annotation'}
                    </button>
                    {/* <label for= "check" class="bg-gray-100 cursor-pointer"/> */}
                    <button onClick={toggleAnnotationMenu} className="bg-cyan-200 text-cyan-950 p-2 rounded">
                        {showAnnotationMenu ? 'Hide Annotation Menu' : 'Show Annotation Menu'}
                    </button>
                </div>
            </div>

        </div>
    );
}