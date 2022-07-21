const router = require("express").Router();
const passport = require("passport");
const session = require("express-session");
const cookies = require('cookie-session');

const CLIENT_URL = "http://localhost:3000/";



router.get("/login/failed", (req,res) => {
    res.status(401).json({
        success: false,
        message:"failure"
    })
})

router.get("/login/success", (req,res) => {
    if(req, res){ //si ya esta autenticado
        res.status(200).json({
            success: true,
            message:"successful",
            user:req.user,
            cookies: req.cookies
        })
    }
    
})

router.get("/logout", (req,res)=>{
    req.logOut();
    /*req.session.destroy(function () {
        res.clearCookie("connect.sid");
        res.redirect(CLIENT_URL);
      });*/
      res.redirect(CLIENT_URL);
})



//metodo de autenticación google
router.get("/google", passport.authenticate("google", {
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ],
  }
));

router.get("/google/callback", passport.authenticate("google", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/login/failed"
}))




router.get("/facebook", passport.authenticate("facebook", {scope:"email, user_photos"}));

router.get("/facebook/callback", passport.authenticate("facebook", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/login/failed"
}))

module.exports = router