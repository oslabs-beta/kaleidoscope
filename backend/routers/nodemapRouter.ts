// const express = require('express')
const { Router } = require('express');
const nodemapController = require('../controllers/nodemapController.ts');
const router = Router()
import { Request, Response } from 'express'

router.get('/:width&:height', nodemapController.getSpans, nodemapController.makeNodes, (req:Request, res:Response) => {
    res.status(203).json(res.locals.nodes);
});

export default router;