// const express = require('express')
const { Router } = require('express');
const nodemapController = require('../controllers/nodemapController.ts');
const router = Router()

router.get('/:width&:screenwidth&:height&:screenheight', nodemapController.getSpans, nodemapController.makeNodes, (Request, Response) => {
    Response.status(203).json(Response.locals.nodes);
});

module.exports = router;