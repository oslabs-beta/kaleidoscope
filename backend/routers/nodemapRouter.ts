const express = require('express');
const nodemapController = require('../controllers/nodemapController.ts');
const nodemapRouter = express.Router();

nodemapRouter.get('*', (req, res) => {
    console.log('nodemaprouter hitttttt')
    res.status(203).json({ message: res.locals.spans });
});

module.exports = nodemapRouter;









// const express = require('express');
// const { req: Request, res: Response} = require('express')
// const nodemapController = require('./controllers/nodemapController')
// const nodemapRouter = express.Router();


// nodemapRouter.get('*', nodemapController.getSpans, (req, res) => {
//     res.status(200).send(res.locals.spans);
// });



// export = nodemapRouter;