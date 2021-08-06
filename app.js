const express = require('express');
const app = express();

const session = require('express-session');
const MongoStore = require('connect-mongo');    //Save user session information to database
const mongoAtlasUsername = 'userone';
const mongoAtlasPassword = 'userone';
app.use(session({
    secret: 'abcdef-12345',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({mongoUrl: `mongodb+srv://${mongoAtlasUsername}:${mongoAtlasPassword}@fsdlibrarymanager.gfgv4.mongodb.net/LibraryData?retryWrites=true&w=majority`})
}));


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended:false}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const port = process.env.PORT || 5000;

const nav = {
    guest: [
        {link:'/books', name:'Books'},
        {link:'/authors', name:'Authors'},
        {link:'/books/add-book', name:'Add New Book'},
        {link:'/authors/add-author', name:'Add New Author'},
        {link:'/accounts/login', name:'Log in'},
        {link:'/accounts/signup', name:'Sign up'}
    ],
    user: [
        {link:'/books', name:'Books'},
        {link:'/authors', name:'Authors'},
        {link:'/books/add-book', name:'Add New Book'},
        {link:'/authors/add-author', name:'Add New Author'},
        {link:'/accounts/logout', name:'Log out'},
        {link:'#', name:'profile'}
    ]
};

const booksRouter = require('./src/routes/booksRoutes')(nav);
const authorsRouter = require('./src/routes/authorsRoutes')(nav);
const accountsRouter = require('./src/routes/accountsRoutes')(nav);

app.use(express.static('./public'));
app.set('view engine','ejs');
app.set('views', './src/views');
app.use('/books',booksRouter);
app.use('/authors',authorsRouter);
app.use('/accounts',accountsRouter);

app.get('/', (req,res)=>{
    let response = {};
    response.title = 'Library Manager';
    if(req.session.user){
        response.nav = nav.user;
        response.profileName = req.session.user.fname + ' ' + req.session.user.sname;
    }
    else{
        response.nav = nav.guest;
    }
    res.render('index',response);
});
 
app.listen(port,()=>{
    console.log(`Server started on port ${port}.`);
});