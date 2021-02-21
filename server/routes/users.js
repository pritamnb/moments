const express = require('express');
const auth = require('../middleware/auth');

const { createUser, login} = require('../controllers/userController');

const router = express.Router();

router.post('/create',async (req,res)=>{
    try{
        let result = await createUser(req.body);

        if(result.error){
            res.status(500).json({
                error: true,
                message : result.message
            });
        }else{
            res.status(200).json({
                error : false,
                data : result.data
            });
        }
    }catch(error){
        return res.status(500).json({
            error : true,
            message: "Something Went Wrong!"
        });
    }
});

router.post('/login',async (req,res)=>{
    try{
        let result = await login(req.body.email,req.body.password);
        if(result.error){
            return res.status(500).json({
                error : true,
                message : result.message
            });
        }else{
            return res.status(200).json({
                error : false,
                message : result.message,
                data : result.data
            }); 
        }
    }catch(error){
        return res.status(500).json({
            error : true,
            message : "Something Went Wrong!"
        });
    }
});


module.exports = router;

