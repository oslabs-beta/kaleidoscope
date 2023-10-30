import { Circle, Line } from '../../types';

// Function to draw circle on canvas
const drawCircle = (canvasContext: CanvasRenderingContext2D, circle: Circle) => {
    canvasContext.beginPath();
    canvasContext.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    canvasContext.fillStyle = 'black';
    canvasContext.fill();
    canvasContext.closePath();
};

// Function to draw line between circles
const drawLine = (canvasContext: CanvasRenderingContext2D, circleA: Circle, circleB: Circle) => {
    //line from circleA to circleB
    canvasContext.beginPath();
    canvasContext.moveTo(circleA.x, circleA.y);
    canvasContext.lineTo(circleB.x, circleB.y);
    canvasContext.strokeStyle = 'dark-gray';
    canvasContext.lineWidth = 2;
    canvasContext.stroke();

    //tip of the arrow
    const arrowSize = 15;

    const dx = circleB.x - circleA.x;
    const dy = circleB.y - circleA.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitDx = dx / length;
    const unitDy = dy / length;

    const arrowX = circleB.x - unitDx * 20;
    const arrowY = circleB.y - unitDy * 20;

    const angle = Math.atan2(circleB.y - circleA.y, circleB.x - circleA.x);
    canvasContext.beginPath();
    canvasContext.moveTo(arrowX, arrowY);
    canvasContext.lineTo(arrowX - arrowSize * Math.cos(angle - Math.PI / 6), arrowY - arrowSize * Math.sin(angle - Math.PI / 6));
    canvasContext.moveTo(arrowX, arrowY);
    canvasContext.lineTo(arrowX - arrowSize * Math.cos(angle + Math.PI / 6), arrowY - arrowSize * Math.sin(angle + Math.PI / 6));
    canvasContext.stroke();
};

export const draw = (
    canvasContext: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    circles:Circle[], 
    lines:Line[]
):void | null => {
    // clear canvas
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lines with labels
    lines.forEach(line => {
        const fromCircle = circles.find(circle => circle.name === line.from);
        const toCircle = circles.find(circle => circle.name === line.to);
        
        // Draw line if both circles exist
        if (fromCircle && toCircle) {
            // Draw line
            drawLine(canvasContext, fromCircle, toCircle);

            // Calculate the midpoint of the line for label positioning
            const labelX = (fromCircle.x + toCircle.x) / 2;
            const labelY = (fromCircle.y + toCircle.y) / 2;

        // Display label
        canvasContext.font = '12px Arial';
        canvasContext.fillStyle = 'red';
        canvasContext.fillText(
            `avg latency: ${line.latency}ms`, 
        labelX, labelY);
        canvasContext.fillText(
            `requests: ${line.requests}`, 
        labelX, labelY - 12);
        }
    });

    // Draw circles and node labels
    circles.forEach(circle => {
        // call helper func
        drawCircle(canvasContext, circle);
        // Display trace data on the circle
        // needs to be reconfigured w/ store
        canvasContext.font = '12px Arial';
        canvasContext.fillStyle = 'white';
        canvasContext.fillText(circle.name, circle.x - 15, circle.y);
    });
};