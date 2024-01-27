import fs from "fs";
import { Circle, Line, Span } from "../types";
import { Request, Response, NextFunction } from "express";

const BORDER_DISTANCE = 50; // Minimum separation between nodes / edges of the canvas
const DEFAULT_NODE_RADIUS = 20;

const getSpans = (req: Request, res: Response, next: NextFunction) => {
  // Load test data from file
  res.locals.spans = JSON.parse(
    fs.readFileSync("../tracestore.json").toString()
  ); //test data
  return next();
};

export const randomPositionWithinBounds = (
  maxWidth: number,
  maxHeight: number,
  existingPositions: { x: number; y: number }[]
): [number, number] => {
  // Generate a random number within a specified range and distance from border
  const random = (num: number): number => {
    const result = Math.ceil(Math.random() * num);
    if (result < BORDER_DISTANCE || result > num - BORDER_DISTANCE)
      return random(num);
    return result;
  };

  const x = random(maxWidth);
  const y = random(maxHeight);

  for (const pos of existingPositions) {
    const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
    if (distance < BORDER_DISTANCE)
      return randomPositionWithinBounds(maxWidth, maxHeight, existingPositions);
  }

  return [x, y];
};

export const makeNodes = (req: Request, res: Response, next: NextFunction) => {
  const width = Number(req.params.width.replace(":", ""));
  const height = Number(req.params.height.replace(":", ""));

  const existingPositions: { x: number; y: number }[] = [];
  const spans: Span[] = res.locals.spans;
  const endpoints: { [key: string]: Circle } = {};
  const nodes: Circle[] = [];
  const lines: Line[] = [];
  try {
    spans.forEach((span) => {
      if (!span.attributes || !span.name) return;

      //check if we need to create a new node/circle; create if so
      if (!endpoints[span.name]) {
        //if endpoint is not yet in our nodes
        const [x, y] = randomPositionWithinBounds(
          width,
          height,
          existingPositions
        );
        nodes.push({
          name: span.name,
          id: span.spanId,
          x: x,
          y: y,
          radius: DEFAULT_NODE_RADIUS,
          isDragging: false,
          isHovered: false,
          data: [span],
        });

        endpoints[span.name] = nodes[nodes.length - 1];
      } else {
        endpoints[span.name].data.push(span);
      }

      // Create lines connecting nodes based on parent relationships
      if (span.parentSpanId) {
        const parentSpan = spans.find((s) => s.spanId === span.parentSpanId);
        if (!parentSpan) return;

        const parent = nodes.find((n) => n.name === parentSpan.name);
        if (parent && parent.name !== span.name) {
          const latency =
            (span.endTimeUnixNano - span.startTimeUnixNano) / 1000000; // Convert ns to ms
          const existingLine = lines.find(
            (l) => l.from === parent.name && l.to === span.name
          );

          //check for an exisiting line / incorporate latency
          if (existingLine) {
            const weight = 1 / existingLine.requests;
            existingLine.latency = Number(
              (existingLine.latency * weight + latency * (1 - weight)).toFixed(
                3
              )
            );
            existingLine.requests++;
          } else {
            lines.push({
              from: parent.name,
              to: span.name,
              latency,
              requests: 1,
            });
          }
        }
      }
    });
    res.locals.data = { nodes, lines };
  } catch (error) {
    next(error);
  }
};

export { getSpans };
