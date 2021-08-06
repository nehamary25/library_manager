const express = require('express');
const booksRouter = express.Router();
const BookData = require('../model/Database').BookData;
const multer = require('multer');

// Use disk storage
// const storage = multer.diskStorage({
//     destination: function(req, file, callback) {
//         callback(null, 'uploads');
//     },
//     filename: function (req, file, callback) {
//         callback(null, file.fieldname);
//     }
// });

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
    booksRouter.get('/', (req,res)=>{
        let response = {};
        response.title = 'Library Manager | Books';
        if(req.session.user){
            response.nav = nav.user;
            response.profileName = req.session.user.fname + ' ' + req.session.user.sname;
        }
        else{
            response.nav = nav.guest;
            response.profileName = '';
        }
        BookData.find()
        .then((books)=>{
            response.books = books;
            res.render('books',response);
        });
    });

    booksRouter.get('/add-book', (req,res)=>{
        let response = {};
        response.title = 'Library Manager | Add New Book';
        if(req.session.user){
            response.nav = nav.user;
            response.profileName = req.session.user.fname + ' ' + req.session.user.sname;
            response.book = {},
            response.errorMsg = '';
            response.successMsg = '';
            res.render('addBook',response);
        }
        else{
            response.nav = nav.guest;
            response.profileName = '';
            res.render('accessDenied',response);
        }
    });

    booksRouter.post('/add-book', (req,res)=>{
        if(req.session.user){
            upload(req, res, (err)=>{
                let newBook = req.body;
                let response = {};
                response.title = 'Library Manager | Add New Book';
                response.nav = nav.user;
                response.profileName = req.session.user.fname + ' ' + req.session.user.sname;
                if (err){
                    response.book = newBook;
                    response.errorMsg = err.message;
                    response.successMsg = '';
                    res.render('addBook',response);
                }
                else{
                    if(req.file){
                        newBook.img = {
                            data: req.file.buffer,
                            contentType: req.file.mimetype
                        }
                    }
                    else{
                        newBook.img = {
                            data: '',
                            contentType: ''
                        }
                    }
                    BookData(newBook).save()
                    .then(()=>{
                        res.redirect('/books');
                    });
                }
            });
        }
        else{
            // If not logged in, do not add book.
            // Redirect to same page. It will be handled in get route.
            res.redirect('/books/add-book');
        }
    });

    booksRouter.get('/edit/:id', (req,res)=>{
        let bookId = req.params.id;
        let response = {};
        response.title = 'Library Manager | Edit Book';
        if(req.session.user){
            response.nav = nav.user;
            response.profileName = req.session.user.fname + ' ' + req.session.user.sname;
            BookData.findById(bookId)
            .then((book)=>{
                response.book = book;
                response.errorMsg = '';
                response.successMsg = '';
                res.render('editBook',response);
            });
        }
        else{
            response.nav = nav.guest;
            response.profileName = '';
            res.render('accessDenied',response);
        }
    });

    booksRouter.post('/edit/:id', (req,res)=>{
        let bookId = req.params.id;
        if(req.session.user){
            upload(req, res, (err)=>{
                let updatedBook = req.body;
                let response = {};
                response.title = 'Library Manager | Edit Book';
                response.nav = nav.user;
                response.profileName = req.session.user.fname + ' ' + req.session.user.sname;
                if (err){
                    response.book = updatedBook;
                    response.errorMsg = err.message;
                    response.successMsg = '';
                    res.render('editBook',response);
                }
                else{
                    if(req.file){
                        updatedBook.img = {
                            data: req.file.buffer,
                            contentType: req.file.mimetype
                        }
                    }
                    else{
                        updatedBook.img = {
                            data: '',
                            contentType: ''
                        }
                    }
                    BookData.findByIdAndUpdate(bookId, updatedBook)
                    .then(()=>{
                        res.redirect('/books');
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
            res.redirect(`/books/edit/${bookId}`);
        }
    });

    booksRouter.get('/delete/',(req,res)=>{
        res.redirect('/books');
    });
    booksRouter.post('/delete/',(req,res)=>{
        let bookId = req.body.id;
        let response = {};
        if(req.session.user){
            BookData.findByIdAndDelete(bookId)
            .then(()=>{
                res.redirect('/books');
            })
            .catch((err)=>{
                console.log(err);
                // Handle errors
            });
        }
        else{
            // If not logged in, do not delete book.
            response.title = 'Library Manager | Delete Book';
            response.nav = nav.guest;
            response.profileName = '';
            res.render('accessDenied',response);
        }
    });
    return booksRouter;
}

module.exports = router;