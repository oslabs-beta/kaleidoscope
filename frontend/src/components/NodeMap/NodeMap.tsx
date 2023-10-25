import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnnotationForm } from '../AnnotationForm/AnnotationForm';
import { AnnotationMenu } from '../AnnotationMenu/AnnotationMenu';
import { Circle, Line, Span } from '../../types';
import { draw } from './draw';

// const makeNodes = async () => {
//     // console.log('invoked awaitFunc');
//     // Get spans (trace data) and parse it into circles and lines
//     try {
//         const data: any = await fetch('http://localhost:3001/nodemap')
//         // console.log('FETCHED NODES', data);
//         const spans:{spans:Span[]} = await data.json();  
//         console.log('SPAN DATA', spans);
//         // console.log('iterable i hope....', spans.spans)

//         const defaultNodeRadius = 20;

//         const endpoints = {};
//         const nodes:Circle[] = [];
//         const lines:Line[] = [];
//         let counter = 0
//         spans.spans.forEach(span => {
//             // console.log('in the for each!!!!!!!', span.attributes)
//             //check if we need to create a new node/circle; create if so
//             if(!endpoints[span.attributes['http.route']]){ //if endpoint is not yet in our nodes
//                 // console.log('inside conditional logic')
//                 counter++;
//                 nodes.push({
//                     name: span.attributes['http.route'],
//                     id: span.context.span_id,
//                     x: counter * 20, 
//                     y: counter * 20,
//                     radius: defaultNodeRadius,
//                     isDragging: false,
//                     isHovered: false, 
//                     data: [span]
//                 })
//                 // console.log('pushed node')
//                 endpoints[span.attributes['http.route']] = nodes[nodes.length - 1]; //keep references to nodes at each unique endpoint
//             }else{
//                 //pass span data to an existing node
//                 endpoints[span.attributes['http.route']].data.push(span);
//             }
//             // console.log('made node, makin line...')
//             //check if we need to create a new line (if node has parent_id); create if so
//             if(span.parent_id !== null){
//                 const parent:Circle|undefined = nodes.find((s) => s.id === span.parent_id);
//                 if(parent){ 
//                     const time1:Date | any = new Date(span.end_time)
//                     const time2:Date | any = new Date(span.start_time)
//                     //check for an exisiting line / incorporate latency
//                     const line:Line|undefined = lines.find((l) => l.from === parent.name && l.to === span.attributes['http.route']);
//                     if(line) {
//                         line.requests++;
//                         const weight:number = 1 / line.requests;
//                         line.latency = ((line.latency * weight) + (time1 - time2) * (1 - weight)); //calculate avg latency
//                     }else{
//                         lines.push({  //create a new line
//                             from: parent.name,
//                             to: span.attributes['http.route'],
//                             latency: (time1 - time2),
//                             requests: 1
//                         })
//                     }
//                 }
//             }
//         })
//         return [nodes, lines];
//     }catch(err) {
//         console.log('error fetching', err)
//     }
// }


// Main NodeMap component
export default function NodeMap() {
    /* ------------------------------ State Management ------------------------------ */

    // Reference to canvas DOM element
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // State to manage the circles (nodes) on the canvas
    let [circles, setCircles] = useState<Circle[]>([
        // Add more circles with IDs and initial positions
    ]);

    let lines = [];

    // State to handle saved annotations
    const [annotations, setAnnotations] = useState([]);
    const [showAnnotation, setShowAnnotation] = useState(false);
    const [showAnnotationMenu, setShowAnnotationMenu] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [inAnnotationMode, setInAnnotationMode] = useState(false);
    const [selectedCircle, setSelectedCircle] = useState(null);
    const [selectedLine, setSelectedLine] = useState(null);

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
            result = await result.json()
            console.log('result', result);
            circles= result[0]
            lines = result[1]
            console.log('got EM', circles, lines)
            // lines = newLines; 
            // circles = newCircles
        }
        getNewNodeMap();
    }, [])
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');
        if(!canvas){
            console.log('canvas is undefined')
            return; 
        } 
        const ctx = canvas.getContext('2d');
        if(!ctx){
            console.log('ctx is undefined')
            return; 
        }

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

            draw(canvasContext, canvas, circles, lines);
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
            draw(canvasContext, canvas, circles, lines);
        });

        draw(canvasContext, canvas, circles, lines);

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
                draw(canvasContext, canvas, circles, lines);
            }
        };
        
        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize(); // Call it once to set initial size
        
        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []);

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
