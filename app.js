// LIBRARIES

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const _ = require('lodash');
const app = express();
app.set('view engine', "ejs");
const port = process.env.PORT || 3000;




// APP

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));







// Mongoose

mongoose.connect('mongodb+srv://admin-adrian:Mongodb!ammn!A!wb!94@cluster0.oaxlz4o.mongodb.net/?retryWrites=true&w=majority');

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






// List mongoose

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);








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






// GET ABOUT

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, (err, foundList) => {

        if (!err){

          if (!foundList){

              const list = new List({
                name: customListName,
                items: items
              });

              list.save();

              res.redirect('/' + customListName);

          } else {
              res.render("list", {
              list_title_ejs : foundList.name,
              items_ejs : foundList.items
            });
          }
        }
    });
});









// POST

app.post('/', (req, res) => {

          const itemName = req.body.newItem;
          const listName = req.body.list;

          const item = new Item({
            name: itemName
          });



          if (listName === 'Today'){
            item.save();
            res.redirect('/');
          }
          else {
            List.findOne({name: listName}, function(err, foundList){
              foundList.items.push(item);
              foundList.save();
              res.redirect('/' + listName);
            })
          }

});






// POST DELETE

app.post('/delete', (req, res) => {

  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;


  if (listName === 'Today'){
        Item.deleteOne({'_id': checkedItemId}, (err) => {
              if (err){
                console.log('Error on deleteOne item');
              } else {
                console.log('Success on deleteOne item');
                res.redirect('/');
              }
        });
  }

  else {

    // DO ZMIANY
              List.findOneAndUpdate({name: listName},
                                    {$pull: {items: {_id:checkedItemId}}},
                                    (err, foundList) => {
                                                          if (!err) {
                                                            res.redirect('/' + listName);
                                                          }
              });
    // DO ZMIANY

      }
});














// LISTEN

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
