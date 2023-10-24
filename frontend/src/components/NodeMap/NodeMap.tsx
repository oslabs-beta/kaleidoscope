import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnnotationForm } from '../AnnotationForm/AnnotationForm';
import './NodeMap.css';
import '../../styles/base.css'

interface Circle {
    name: string;
    id: string;
    x: number;
    y: number;
    radius: number;
    isDragging: boolean;
    isHovered: boolean; // Add isHovered property
    data: Span[]; //to store data in each node, might not be efficient
}

interface Line {
    from: string;
    to: string;
    latency: number;
    requests: number;
}

interface Span { 
    name: string;
    context: {
        trace_id: string;
        span_id: string;
    }
    parent_id: string;
    start_time: Date;
    end_time: Date;
    attributes: {
        'http.route': string;
    }
    events: {
        name: string;
        timestamp: Date;
        attributes: {
            event_attributes: Number;
        }
    }[]
}

const makeNodes = async () => {
    // console.log('invoked awaitFunc');
    // Get spans (trace data) and parse it into circles and lines
    try {
        const data: any = await fetch('http://localhost:3001/nodemap')
        // console.log('FETCHED NODES', data);
        const spans:{spans:Span[]} = await data.json();  
        console.log('SPAN DATA', spans);
        // console.log('iterable i hope....', spans.spans)

        const defaultNodeRadius = 20;

        const endpoints = {};
        const nodes:Circle[] = [];
        const lines:Line[] = [];
        let counter = 0
        spans.spans.forEach(span => {
            // console.log('in the for each!!!!!!!', span.attributes)
            //check if we need to create a new node/circle; create if so
            if(!endpoints[span.attributes['http.route']]){ //if endpoint is not yet in our nodes
                // console.log('inside conditional logic')
                counter++;
                nodes.push({
                    name: span.attributes['http.route'],
                    id: span.context.span_id,
                    x: counter * 20, 
                    y: counter * 20,
                    radius: defaultNodeRadius,
                    isDragging: false,
                    isHovered: false, 
                    data: [span]
                })
                // console.log('pushed node')
                endpoints[span.attributes['http.route']] = nodes[nodes.length - 1]; //keep references to nodes at each unique endpoint
            }else{
                //pass span data to an existing node
                endpoints[span.attributes['http.route']].data.push(span);
            }
            // console.log('made node, makin line...')
            //check if we need to create a new line (if node has parent_id); create if so
            if(span.parent_id !== null){
                const parent:Circle|undefined = nodes.find((s) => s.id === span.parent_id);
                if(parent){ 
                    const time1:Date | any = new Date(span.end_time)
                    const time2:Date | any = new Date(span.start_time)
                    //check for an exisiting line / incorporate latency
                    const line:Line|undefined = lines.find((l) => l.from === parent.name && l.to === span.attributes['http.route']);
                    if(line) {
                        line.requests++;
                        const weight:number = 1 / line.requests;
                        line.latency = ((line.latency * weight) + (time1 - time2) * (1 - weight)); //calculate avg latency
                    }else{
                        lines.push({  //create a new line
                            from: parent.name,
                            to: span.attributes['http.route'],
                            latency: (time1 - time2),
                            requests: 1
                        })
                    }
                }
            }
        })
        return [nodes, lines];
    }catch(err) {
        console.log('error fetching', err)
    }
}


export default function NodeMap() {
    // Reference to canvas DOM element
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // State to manage the circles (nodes) on the canvas
    let [circles, setCircles] = useState<Circle[]>([
        // Add more circles with IDs and initial positions
    ]);
    let lines = [];

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
    
    useEffect(() => {
        const getNewNodeMap = async () => {
            const [newCircles, newLines]:any = await makeNodes(); 
            console.log('got EM', newCircles) 
            lines = newLines; 
            circles = newCircles
        }
        getNewNodeMap();
    }, [])
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas){
            console.log('canvas is undefined')
            return; 
        } 
        const ctx = canvas.getContext('2d');
        if(!ctx){
            console.log('ctx is undefined')
            return; 
        }
        
        const draw = (circles:Circle[], lines:Line[]):void | null => {
            // console.log('draw')
            // clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw lines with labels
            lines.forEach(line => {
                // console.log('Check here', circles.find(circle => circle.name === line.from)) 
                console.log('testing', circles.find(circle => circle.name === line.from))
                const fromCircle: Circle = circles.find(circle => circle.name === line.from);
                const toCircle: Circle = circles.find(circle => circle.name === line.to);
                console.log('from', fromCircle, '  to', toCircle);
                // Draw line
                drawLine(ctx, fromCircle, toCircle);

                // Calculate the midpoint of the line for label positioning
                const labelX = (fromCircle.x + toCircle.x) / 2;
                const labelY = (fromCircle.y + toCircle.y) / 2;

                // Display label
                ctx.font = '12px Arial';
                ctx.fillStyle = 'red';
                ctx.fillText(`average latency: ${line.latency}ms requests:${line.requests}`, labelX, labelY);
            });

            // Draw circles and node labels
            circles.forEach(circle => {
                // call helper func
                drawCircle(ctx, circle);
                // Display trace data on the circle
                // needs to be reconfigured w/ store
                ctx.font = '12px Arial';
                ctx.fillStyle = 'white';
                ctx.fillText(circle.name, circle.x - 15, circle.y);
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

            draw(circles, lines);
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
            draw(circles, lines);
        });

        draw(circles,lines);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);



    return (
        <div>
            <h1 className='title'>Cluster Name: My Demo</h1>
            <canvas className='canvas' ref={canvasRef} width={1200} height={800} />
            { /* not currently being used but allows annotation form component to be rendered */ }
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
    );
}
