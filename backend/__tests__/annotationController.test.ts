import { Request, Response } from 'express';
import * as annotationModel from '../models/annotationModel';
import {
  getAnnotations,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
} from '../controllers/annotationController';

jest.mock('../models/annotationModel');

describe('Annotation Controller', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnnotations', () => {
    it('should return all annotations', async () => {
      const annotations = [{ id: 1, text: 'Annotation 1' }, { id: 2, text: 'Annotation 2' }];
      (annotationModel.getAllAnnotations as jest.Mock).mockResolvedValueOnce(annotations);

      await getAnnotations(req, res);

      expect(annotationModel.getAllAnnotations).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(annotations);
    });

    it('should handle errors', async () => {
      const errorMessage = 'Failed to get annotations.';
      (annotationModel.getAllAnnotations as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await getAnnotations(req, res);

      expect(annotationModel.getAllAnnotations).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('createAnnotation', () => {
    it('should create a new annotation', async () => {
      const annotation = { id: 1, text: 'New Annotation' };
      req.body = annotation;
      jest.spyOn(annotationModel, 'createAnnotation').mockResolvedValueOnce(annotation);

      await createAnnotation(req, res);

      expect(annotationModel.createAnnotation).toHaveBeenCalledTimes(1);
      expect(annotationModel.createAnnotation).toHaveBeenCalledWith(annotation);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(annotation);
    });

    it('should handle errors', async () => {
      const errorMessage = 'Failed to create annotation.';
      req.body = { text: 'New Annotation' };
      annotationModel.createAnnotation.mockRejectedValueOnce(new Error(errorMessage));

      await createAnnotation(req, res);

      expect(annotationModel.createAnnotation).toHaveBeenCalledTimes(1);
      expect(annotationModel.createAnnotation).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('updateAnnotation', () => {
    it('should update an existing annotation', async () => {
      const id = 1;
      const updatedAnnotation = { id, text: 'Updated Annotation' };
      req.params = { id: id.toString() };
      req.body = updatedAnnotation;
      annotationModel.updateAnnotation.mockResolvedValueOnce(updatedAnnotation);

      await updateAnnotation(req, res);

      expect(annotationModel.updateAnnotation).toHaveBeenCalledTimes(1);
      expect(annotationModel.updateAnnotation).toHaveBeenCalledWith(id, updatedAnnotation);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedAnnotation);
    });

    it('should handle errors', async () => {
      const id = 1;
      const errorMessage = 'Failed to update annotation.';
      req.params = { id: id.toString() };
      req.body = { text: 'Updated Annotation' };
      annotationModel.updateAnnotation.mockRejectedValueOnce(new Error(errorMessage));

      await updateAnnotation(req, res);

      expect(annotationModel.updateAnnotation).toHaveBeenCalledTimes(1);
      expect(annotationModel.updateAnnotation).toHaveBeenCalledWith(id, req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('deleteAnnotation', () => {
    it('should delete an existing annotation', async () => {
      const id = 1;
      req.params = { id: id.toString() };

      await deleteAnnotation(req, res);

      expect(annotationModel.deleteAnnotation).toHaveBeenCalledTimes(1);
      expect(annotationModel.deleteAnnotation).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid ID format', async () => {
      const id = 'invalid';
      req.params = { id };

      await deleteAnnotation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid ID format');
    });

    it('should handle errors', async () => {
      const id = 1;
      const errorMessage = 'Failed to delete annotation.';
      req.params = { id: id.toString() };
      annotationModel.deleteAnnotation.mockRejectedValueOnce(new Error(errorMessage));

      await deleteAnnotation(req, res);

      expect(annotationModel.deleteAnnotation).toHaveBeenCalledTimes(1);
      expect(annotationModel.deleteAnnotation).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
