const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

app.set('view engine', "ejs");

let items = [];

app.get('/', (req, res) => {

  let today = new Date();

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  };

  let day = today.toLocaleDateString('en-US', options);

  res.render("list", {
    day_ejs : day,
    items_ejs : items
  });

});

app.post('/', (req, res) => {

  let item = req.body.newItem;

  items.push(item)

  res.redirect('/');

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
