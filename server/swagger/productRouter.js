const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_img: {
        type: String,
        required: true
    },
    product_mrp: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    offer: {
        type: String,
        required: true
    },
    deliveryCharges: {
        type: String,
        required: true
    },
    product_type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    selected: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Create a Product model using the schema
const Product = mongoose.model("Product", productSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - product_name
 *         - product_img
 *         - product_mrp
 *         - quantity
 *         - offer
 *         - deliveryCharges
 *         - product_type
 *         - description
 *         - email
 *       properties:
 *         product_name:
 *           type: string
 *           description: Name of product
 *         product_img:
 *           type: string
 *           description: URL of product image
 *         product_mrp:
 *           type: string
 *           description: Maximum Retail Price of product
 *         quantity:
 *           type: string
 *           description: Quantity of product
 *         offer:
 *           type: string
 *           description: Offer on product
 *         deliveryCharges:
 *           type: string
 *           description: Delivery charges for the product
 *         product_type:
 *           type: string
 *           description: Type of product (e.g., Vegetable, Fruit)
 *         description:
 *           type: string
 *           description: Description of the product
 *         email:
 *           type: string
 *           description: Email of the user adding the product
 *         selected:
 *           type: number
 *           description: Whether the product is selected or not 
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when the product is added 
 */

/**
 * @swagger
 * tags:
 *   name: Products
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns all products
 *     tags: [Products]
 *     securtity:
 *              BearerAuth()
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Returns a product by ID
 *     tags: [Products]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to get
 *     responses:
 *       200:
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.send(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Adds a new Product
 *     tags: [Products]
 *     securtity:
 *              BearerAuth()
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Returns the newly created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post("/", async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.send(newProduct);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Updates a product by ID
 *     tags: [Products]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Updated product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }
        res.send(updatedProduct);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deletes a product by ID
 *     tags: [Products]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).send("Product not found");
        }
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
