const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const date = require(__dirname + "/date.js");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

app.set('view engine', "ejs");

const items = [];
const workItems = [];

app.get('/', (req, res) => {

  // const day = date.getDay();
  const day = date.getDate();

  res.render("list", {
    list_title_ejs : day,
    items_ejs : items
  });
});

app.post('/', (req, res) => {
  const item = req.body.newItem;

  if (req.body.list === 'Work') {
    workItems.push(item);
    res.redirect('/work');
  }
  else {
    items.push(item);
    res.redirect('/');
  }
});

app.get('/work', (req, res) => {
  res.render("list", {
    list_title_ejs : "Work To-do",
    items_ejs : workItems,
  });
})

app.get('/about', (req, res) => {
  res.render('about')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
