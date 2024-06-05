const express = require('express')
const app = express()
app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs', {name:'kyle'})
})

app.get('/login', (req,res) => {
    res.render('login.ejs', {name:'bob'})


})

app.get('/register', (req,res) => {
    res.render('register.ejs', {name:'tom'})


})

app.listen(3000)
