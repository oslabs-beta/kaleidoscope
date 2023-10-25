// const express = require('express')
const { Router } = require('express');
const nodemapController = require('../controllers/nodemapController.ts');
const router = Router()

router.get('*', nodemapController.getSpans, nodemapController.makeNode, (Request, Response) => {
    // console.log('nodemaprouter hitttttt')
    Response.status(203).json(Response.locals.spans);
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