const jwt = require('jsonwebtoken')
const Attendee = require('../model/attendee')
const requireAuth = (req,res,next) =>{
    const token = req.cookies.jwt;
    //check if jwt exists and verified
    if(token){
        jwt.verify(token,'soma secret',(err,decodedToken) =>{
            if(err){
                console.log(err.message)
                res.redirect('/login');
            }
            else{
                console.log(decodedToken);
                next();
            }

        })
    }
    else{
        console.log("not loggedin")
        res.redirect('/login');
    
    }
}
//checking user
const checkUser=(req,res,next)=>{
    const token = req.cookies.jwt;
    //check if jwt exists and verified
    if(token){
        jwt.verify(token,'soma secret',async (err,decodedToken) =>{
            if(err){
                console.log(err.message);
                res.locals.attendee=null;
                next();
            }
            else{
                console.log(decodedToken);
                let attendee= await Attendee.findById(decodedToken.id)
                res.locals.attendee=attendee;
                next();
            }

        })
    }
    else{
        res.locals.attendee=null;
        next();
    }
}
const isAdmin =(req,res,next) => {
        
    if(!res.locals.user.isAdmin){
        res.redirect('/403')
    }
    else{
        next();
    }
}
module.exports = {requireAuth,checkUser,isAdmin}