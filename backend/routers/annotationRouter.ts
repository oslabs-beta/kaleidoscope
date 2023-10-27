import express from 'express';
import * as annotationController from '../controllers/annotationController';

const router = express.Router();

router.get('/', annotationController.getAnnotations);
router.post('/', annotationController.createAnnotation);
// ... routes for updating, fetching single annotation, and deleting
router.put('/:id', annotationController.updateAnnotation);
// router.get('/:id', annotationController.getAnnotationById); <- this needs to be created in annotation Controller
router.delete('/:id', annotationController.deleteAnnotation);


export default router;
