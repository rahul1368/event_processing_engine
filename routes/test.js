//This file just only contain the testing api's
const Router = require('express');
let router = Router();
const getUserDetails = require('../services/UserService');
const publishToQueue = require('../services/MQService');

router.post('/hello',async (req,res,next)=>{
    let uname = req.body.username;
    let userDetails = await getUserDetails(req.db,uname)
    res.statusCode = 200;
    res.data = userDetails;
    next();
});

router.post('/msg',async(req,res,next)=>{
    let {queueName,payload} = req.body;
    await publishToQueue(queueName,payload);
    res.statusCode = 200;
    res.data = {"message-sent":true};
    next();
})

module.exports = router;