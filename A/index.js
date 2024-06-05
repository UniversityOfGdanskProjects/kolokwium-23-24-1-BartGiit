const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

// Set view engine and middleware
app.use(bodyParser.urlencoded({ extended: true }));

const Product = require('./models/Product');
const Order = require('./models/Order');

//Pobranie informacji o produkcie za pomoca ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ product_id: id });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Nie udalo sie pobrac informacji o produkcie' });
    }
  });


//Skladanie zamowienia
app.post('/api/orders', async (req, res) => {
    try {
      const order = new Order({
        order_id: req.body.order_id,
        customer_id: req.body.customer_id,
        product_id: req.body.product_id,
        quantity: req.body.quantity,
        order_date: req.body.order_date,
        status: req.body.status
      });
      await order.save();
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ error: 'Nie udalo sie zalozyc zamowienia' });
    }
  });


//Aktualizacja danych produktu
app.post('/api/products/:id', async (req, res) => {
    try{
        const { id } = req.params;
        await Item.findOneAndUpdate({product_id: id}, { product_name: req.body.product_name,  category: req.body.category, price: req.body.price, in_stock: req.body.in_stock });
        res.status(200);
    } catch(err) {
        res.status(500).json({ error: 'Nie udalo sie zaktualizowac produktu' });     
    }
  });



//Zaawansowane statystyki
app.get('/api/orders/statistics', async (_req, res) => {
    try {
        Order.aggregate([{$liczba_zamowien: {Order}}]).exec((error, resultSet) => { 
            if (error) { 
                console.log(error); 
            } else { 
                res.json(resultSet); 
            } 
        })
    } catch (err) {
        res.status(500).json({ error: 'Nie udalo sie utworzyc statystyk' });
    }
  });


//Konfiguracja portu
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
