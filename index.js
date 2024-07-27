const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const methodOverride = require('method-override');
const Product = require('./models/product.model');

// Set up storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Route to render the form
app.get('/', (req, res) => {
    res.render('index', { title: 'Home page' });
});

// Route to handle form submission
app.post('/products', upload.single('image'), async (req, res) => {
    console.log(req.body);
    if (req.file) {
        console.log(`Image file: ${req.file.originalname}`);
    }
    const newProduct = new Product({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        image: req.file ? req.file.originalname : null
    });
    try {
        await newProduct.save();
        res.send('Product saved successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to display products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('products', { products });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to delete a product
app.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to render edit form
app.get('/products/:id/edit', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('edit', { product });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to update a product
app.put('/products/:id', upload.single('image'), async (req, res) => {
    try {
        const updatedProduct = {
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
        };
        if (req.file) {
            updatedProduct.image = req.file.originalname;
        }
        await Product.findByIdAndUpdate(req.params.id, updatedProduct);
        res.redirect('/products');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Connect to MongoDB and start the server
mongoose.connect('mongodb+srv://aswindilip5:6NZO85hFB2VDPSqf@backenddb.levwpb9.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the database');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log(err);
});
