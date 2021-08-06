const express = require('express');
const authorsRouter = express.Router();
const AuthorData = require('../model/Database').AuthorData;
const multer = require('multer');

// Use memory storage
const storage = multer.memoryStorage();

// Define the maximum size for uploading 
// picture i.e. 1 MB. it is optional 
const maxSize = 1 * 1000 * 1000;

const upload = multer({
    storage: storage,
    limits: {fileSize: maxSize}
}).single('img'); //Single file in img field of the form

router = (nav)=>{
    authorsRouter.get('/', (req,res)=>{
        let response = {};
        response.title = 'Library Manager | Authors';
        if(req.session.user){
            response.nav = nav.user;
            response.profileName = req.session.user.fname + ' ' + req.session.user.sname;
        }
        else{
            response.nav = nav.guest;
            response.profileName = '';
        }
        AuthorData.find()
        .then((authors)=>{
            response.authors = authors;
            res.render('authors',response);
        });
    });

    authorsRouter.get('/add-author', (req,res)=>{
        let response = {};
        response.title = 'Library Manager | Add New Author';
        if(req.session.user){
            response.nav = nav.user;
            response.profileName = req.session.user.fname + ' ' + req.session.user.sname;
            response.author = {},
            response.errorMsg = '';
            response.successMsg = '';
            res.render('addAuthor',response);
        }
        else{
            response.nav = nav.guest;
            response.profileName = '';
            res.render('accessDenied',response);
        }
    });

    authorsRouter.post('/add-author', (req,res)=>{
        if(req.session.user){
            upload(req, res, (err)=>{
                let newAuthor = req.body;
                let response = {};
                response.title = 'Library Manager | Add New Author';
                response.nav = nav.user;
                response.profileName = req.session.user.fname + ' ' + req.session.user.sname;
                if (err){
                    response.author = newAuthor;
                    response.errorMsg = err.message;
                    response.successMsg = '';
                    res.render('addAuthor',response);
                }
                else{
                    if(req.file){
                        newAuthor.img = {
                            data: req.file.buffer,
                            contentType: req.file.mimetype
                        }
                    }
                    else{
                        newAuthor.img = {
                            data: '',
                            contentType: ''
                        }
                    }
                    AuthorData(newAuthor).save()
                    .then(()=>{
                        res.redirect('/authors');
                    });
                }
            });
        }
        else{
            // If not logged in, do not add book.
            // Redirect to same page. It will be handled in get route.
            res.redirect('/authors/add-author');
        }
    });

    authorsRouter.get('/edit/:id', (req,res)=>{
        let authorId = req.params.id;
        let response = {};
        response.title = 'Library Manager | Edit Author';
        if(req.session.user){
            response.nav = nav.user;
            response.profileName = req.session.user.fname + ' ' + req.session.user.sname;
            AuthorData.findById(authorId)
            .then((author)=>{
                response.author = author;
                response.errorMsg = '';
                response.successMsg = '';
                res.render('editAuthor',response);
            });
        }
        else{
            response.nav = nav.guest;
            response.profileName = '';
            res.render('accessDenied',response);
        }
    });

    authorsRouter.post('/edit/:id', (req,res)=>{
        let authorId = req.params.id;
        if(req.session.user){
            upload(req, res, (err)=>{
                let updatedAuthor = req.body;
                let response = {};
                response.title = 'Library Manager | Edit Author';
                response.nav = nav.user;
                response.profileName = req.session.user.fname + ' ' + req.session.user.sname;
                if (err){
                    response.author = updatedAuthor;
                    response.errorMsg = err.message;
                    response.successMsg = '';
                    res.render('editAuthor',response);
                }
                else{
                    if(req.file){
                        updatedAuthor.img = {
                            data: req.file.buffer,
                            contentType: req.file.mimetype
                        }
                    }
                    else{
                        updatedAuthor.img = {
                            data: '',
                            contentType: ''
                        }
                    }
                    AuthorData.findByIdAndUpdate(authorId, updatedAuthor)
                    .then(()=>{
                        res.redirect('/authors');
                    })
                    .catch((err)=>{
                        console.log(err);
                        // Handle errors
                    });
                }
            });
        }
        else{
            // If not logged in, do not modify book.
            // Redirect to same page. It will be handled in get route.
            res.redirect(`/authors/edit/${authorId}`);
        }
    });

    authorsRouter.get('/delete/',(req,res)=>{
        res.redirect('/authors');
    });
    authorsRouter.post('/delete/',(req,res)=>{
        let authorId = req.body.id;
        let response = {};
        if(req.session.user){
            AuthorData.findByIdAndDelete(authorId)
            .then(()=>{
                res.redirect('/authors');
            })
            .catch((err)=>{
                console.log(err);
                // Handle errors
            });
        }
        else{
            // If not logged in, do not delete book.
            response.title = 'Library Manager | Delete Author';
            response.nav = nav.guest;
            response.profileName = '';
            res.render('accessDenied',response);
        }
    });
    return authorsRouter;
}

module.exports = router;