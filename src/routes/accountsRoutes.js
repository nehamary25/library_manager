const express = require('express');
const accountsRouter = express.Router();
const UserData = require('../model/Database').UserData;

router = (nav)=>{
    accountsRouter.get('/login', (req,res)=>{
        let response = {};
        if(req.session.user){
            res.redirect('/');
        }
        else {
            response.title = 'Library Manager | Log in';
            response.nav = nav.guest;
            response.profileName = '';
            response.user = {fname: '', sname: '', email: '', password: ''};
            response.errorMsg = '';
            response.successMsg = '';
            res.render('login',response);
        }
    });

    accountsRouter.post('/login', (req,res)=>{
        // Fetch user inputs from form
        let inputUser = req.body;
        let response = {};
        response.title = 'Library Manager | Log in';
        // Check login credentials
        UserData.findOne({email:inputUser.email})
        .then((user)=>{
            if(user && user.password === inputUser.password){       // Found email id and passwords matching
                req.session.user = user;
                res.redirect('back');
            }
            else{
                response.nav = nav.guest;
                response.profileName = '';
                response.user = inputUser;
                response.errorMsg = 'Wrong email or password';
                response.successMsg = '';
                // Render page with error/success message
                res.render('login',response);
            }
        })
        .catch((err)=>{
            console.log(err);
            //Handle error here
        });
    })
    
    accountsRouter.get('/signup', (req,res)=>{
        let response = {};
        if(req.session.user){
            res.redirect('/');
        }
        else{
            response.title = 'Library Manager | Sign up';
            response.nav = nav.guest;
            response.profileName = '';
            response.user = {fname: '', sname: '', email: '', password: ''};
            response.errorMsg = '';
            response.successMsg = '';
            res.render('signup',response);
        }
    });
    
    accountsRouter.post('/signup', (req,res)=>{
        // Fetch user inputs from form
        let newUser = {
            fname: req.body.fname,
            sname: req.body.sname,
            email: req.body.email,
            password: req.body.password
        };
        let response = {};
        response.title = 'Library Manager | Sign up';
        UserData.findOne({email:newUser.email})
        .then((user)=>{
            if(user){       // Email id already in use
                response.nav = nav.guest;
                response.user = newUser;
                response.profileName = '';
                response.errorMsg = 'Email id alredy registered.';
                response.successMsg = '';
                // Render page with error/success message
                res.render('signup',response);
            }
            else{
                // Add new user to the users array
                // and set session information
                UserData(newUser).save()
                .then(()=>{
                    req.session.user = newUser;
                    res.redirect('back');
                })
            }
        })
        .catch((err)=>{
            console.log(err);
            //Handle error here
        });
    });

    accountsRouter.get('/logout', (req, res)=>{
        req.session.destroy();
        res.redirect('/accounts/login');
    });
    return accountsRouter;
}

module.exports = router;