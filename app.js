// LIBRARIES

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const app = express();
app.set('view engine', "ejs");
const port = 3000;




// APP

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));







// Mongoose

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);


const task1 = new Item({
  name: "Clean the room"
});

const task2 = new Item({
  name: "Do dinner"
});

const task3 = new Item({
  name: "Watch movie"
});

const items = [task1, task2, task3];
// const items = [];








// GET

app.get('/', (req, res) => {

  // const day = date.getDay();
  // const day = date.getDate();

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {

        Item.insertMany(items, function(err){
          if (err){
            console.log('Error on inserting');
          } else {
            console.log('Success on inserting');
          }
        });

        res.redirect('/');

    } else {

        res.render("list", {
        list_title_ejs : "Today",
        items_ejs : foundItems

      });
    }
  });
});




// POST

app.post('/', (req, res) => {

  // const item = new Item({
  //   name: req.body.newItem
  // });

  // if (req.body.list === 'Work') {
  //   items.push(item);
  //   res.redirect('/work');
  // }
  // else {

  const item = new Item({name: req.body.newItem}, (err) => {
    if (err){
      console.log('Error on item push');
    } else {
      console.log('Success on item push');
    }
  });

  item.save();

  res.redirect('/');
  // }
});






// POST DELETE

app.post('/delete', (req, res) => {

  const deletedItemId = req.body.checkbox;

  Item.deleteOne({'_id': deletedItemId}, (err) => {
    if (err){
      console.log('Error on deleteOne item');
    } else {
      console.log('Success on deleteOne item');
      res.redirect('/');
    }
  })

});






// GET WORK
// const items = [];
const workItems = [];

app.get('/work', (req, res) => {
  res.render("list", {
    list_title_ejs : "Work To-do",
    items_ejs : workItems,
  });
})




// GET ABOUT

app.get('/about', (req, res) => {
  res.render('about')
});



// LISTEN

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
