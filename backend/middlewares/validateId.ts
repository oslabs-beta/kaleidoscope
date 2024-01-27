import { Request, Response, NextFunction } from 'express';
// middleware/validateId.js

function validateId(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }

    req.params.id = id.toString(); // Convert to string before assigning
    next(); // Proceed to the next middleware or controller
}

export default validateId;
