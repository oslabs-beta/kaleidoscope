import annotationModel from '../models/annotationModel';
import { Request, Response } from 'express'

export async function getAnnotationById(req: Request, res: Response) {
    try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID must be a number' });
      return;
    }

    const annotation = await annotationModel.getAnnotationById(id);
    if (!annotation) {
      res.status(404).json({ error: 'Annotation not found' });
      return;
    }

    res.status(200).json(annotation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch annotation' });
  }
}

export async function getAnnotations(req: Request, res: Response) {
    try {
        const annotations = await annotationModel.getAllAnnotations();
        res.status(200).json(annotations);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch annotations.' });
    }
}

export async function createAnnotation(req: Request, res: Response) {
    try {
        const newAnnotationId = await annotationModel.addAnnotation(req.body);
        res.status(201).json({ id: newAnnotationId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create annotation.' });
    }
}

export async function updateAnnotation(req: Request, res: Response) {
    try {
        // ensure that the ID is a number
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).send("Invalid ID format");
        }
        await annotationModel.updateAnnotation(id, req.body);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Failed to update annotation.' });
    }
}

export async function deleteAnnotation(req: Request, res: Response) {
    try {
        // ensure that the ID is a number
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).send("Invalid ID format");
        }
        await annotationModel.deleteAnnotation(id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete annotation.' });
    }
}