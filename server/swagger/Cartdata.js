const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define the Cart schema
const cartSchema = new mongoose.Schema({
    p_id: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_mrp: {
        type: String,
        required: true
    },
    offer: {
        type: String,
        required: true
    },
    product_type: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status1: {
        type: Number,
        default: 0
    },
    Payment_Type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    orderId: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: new Date().toLocaleTimeString()
    }
});

// Create a Cart model using the schema
// Create a Cart model using the schema
const Cart = mongoose.model("Cart", cartSchema, "cart");


/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - p_id
 *         - product_name
 *         - product_mrp
 *         - offer
 *         - product_type
 *         - quantity
 *         - email
 *         - status1
 *         - Payment_Type
 *         - date
 *         - orderId
 *         - time
 *       properties:
 *         p_id:
 *           type: string
 *           description: ID of the product
 *         product_name:
 *           type: string
 *           description: Name of product
 *         product_mrp:
 *           type: string
 *           description: Maximum Retail Price of product
 *         offer:
 *           type: string
 *           description: Offer on product
 *         product_type:
 *           type: string
 *           description: Type of product
 *         quantity:
 *           type: number
 *           description: Quantity of product
 *         email:
 *           type: string
 *           description: Email of the user
 *         status1:
 *           type: number
 *           description: Status of the product
 *         Payment_Type:
 *           type: string
 *           description: Type of payment
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the transaction
 *         orderId:
 *           type: string
 *           description: Order ID
 *         time:
 *           type: string
 *           description: Time of the transaction
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Returns all items in the cart
 *     tags: [Cart]
 *     securtity:
 *              BearerAuth()
 *     responses:
 *       200:
 *         description: A list of items in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 */
router.get("/", async (req, res) => {
    try {
        const items = await Cart.find();
        res.send(items);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     summary: Returns an item in the cart by ID
 *     tags: [Cart]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the item in the cart to get
 *     responses:
 *       200:
 *         description: An item in the cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Item not found in the cart
 */
router.get("/:id", async (req, res) => {
    try {
        const item = await Cart.findById(req.params.id);
        if (!item) {
            return res.status(404).send("Item not found in the cart");
        }
        res.send(item);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Adds a new item to the cart
 *     tags: [Cart]
 *     securtity:
 *              BearerAuth()
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Returns the newly added item in the cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.post("/", async (req, res) => {
    try {
        const newItem = await Cart.create(req.body);
        res.send(newItem);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Updates an item in the cart by ID
 *     tags: [Cart]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the item in the cart to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Updated item in the cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Item not found in the cart
 */
router.put("/:id", async (req, res) => {
    try {
        const updatedItem = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).send("Item not found in the cart");
        }
        res.send(updatedItem);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Deletes an item from the cart by ID
 *     tags: [Cart]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the item in the cart to delete
 *     responses:
 *       200:
 *         description: Item deleted successfully from the cart
 *       404:
 *         description: Item not found in the cart
 */
router.delete("/:id", async (req, res) => {
    try {
        const deletedItem = await Cart.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).send("Item not found in the cart");
        }
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
