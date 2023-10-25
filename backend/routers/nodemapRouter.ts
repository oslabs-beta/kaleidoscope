// const express = require('express')
const { Router } = require('express');
const nodemapController = require('../controllers/nodemapController.ts');
const router = Router()

router.get('*', nodemapController.getSpans, nodemapController.makeNodes, (Request, Response) => {
    // console.log('nodemaprouter hitttttt')
    console.log('res.locals.nodes', Response.locals.nodes)
    Response.status(203).json(Response.locals.nodes);
});

module.exports = router;









// const express = require('express');
// const { req: Request, res: Response} = require('express')
// const nodemapController = require('./controllers/nodemapController')
// const nodemapRouter = express.Router();


// nodemapRouter.get('*', nodemapController.getSpans, (req, res) => {
//     res.status(200).send(res.locals.spans);
// });



// export = nodemapRouter;