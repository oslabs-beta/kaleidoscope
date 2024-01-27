import express from 'express';
import * as annotationController from '../controllers/annotationController';
import validateId from '../middlewares/validateId';

const router = express.Router();

router.get('/', annotationController.getAnnotations);
router.get('/:id', validateId, annotationController.getAnnotationById); 
router.post('/', annotationController.createAnnotation);
router.put('/:id', validateId, annotationController.updateAnnotation);
router.delete('/:id', annotationController.deleteAnnotation);


export default router;
