import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({
        status:"success",
        results:[
            {name:'Come Home'},
            {name:"Teenage Angst"},
            {name:"Bionic"},
            {name:"36 Degrees"},
            {name:"Hang on to your IQ"},
            {name:"Nancy Boy"},
            {name:"I Know"},
            {name:"Bruise Pristine"},
            {name:"Lady fof the Flowers"},
            {name:"Swallow"}
        ]
    });
});

export default router;