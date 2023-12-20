const express = require('express');

const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const blogRoutes = require('./routes/blogRoutes')
const mongoose = require('mongoose');
require('dotenv').config()


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.MONGO_URL;
const PORT = process.env.PORT
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
 .then((result) => {
app.listen(PORT, () => { 
  console.log("Listening to ",PORT);
})

console.log('Connected to Database');
});

  const blogs = {};

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/create', requireAuth, (req, res) => res.render('create',{blogs,title : 'Main page'}))
app.get('/details', requireAuth,(req, res) => res.render('details',{blogs,title : 'Main page'}))
app.get('/about', requireAuth, (req, res) => res.render('about',{blogs,title : 'Main page'}))
app.use(authRoutes);
 app.use('/blogs',blogRoutes)