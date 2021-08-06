const mongoose = require('mongoose');
const mongoAtlasUsername = 'userone';
const mongoAtlasPassword = 'userone';
mongoose.connect(`mongodb+srv://${mongoAtlasUsername}:${mongoAtlasPassword}@fsdlibrarymanager.gfgv4.mongodb.net/LibraryData?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    author: String,
    genre: String,
    description: String,
    img:{
        data: Buffer,
        contentType: String
    }
});
const BookData = mongoose.model('book', BookSchema);

const AuthorSchema = new Schema({
    name: String,
    books: String,
    description: String,
    img:{
        data: Buffer,
        contentType: String
    }
});
const AuthorData = mongoose.model('author', AuthorSchema);

const UserSchema = new Schema({
    fname: String,
    sname: String,
    email: String,
    password: String
});
const UserData = mongoose.model('user', UserSchema);

module.exports.BookData = BookData;
module.exports.AuthorData = AuthorData;
module.exports.UserData = UserData;
