const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define the ProductReviews schema
const productReviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    p_id: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    c_id: {
        type: String,
        required: true
    }
});

// Create a ProductReviews model using the schema
const ProductReviews = mongoose.model("productReviews", productReviewSchema,"productReviews");

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductReview:
 *       type: object
 *       required:
 *         - name
 *         - p_id
 *         - stars
 *         - text
 *         - date
 *         - c_id
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the reviewer
 *         p_id:
 *           type: string
 *           description: ID of the product being reviewed
 *         stars:
 *           type: number
 *           description: Rating given by the reviewer (out of 5)
 *         text:
 *           type: string
 *           description: Review text
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the review
 *         c_id:
 *           type: string
 *           description: ID of the customer who submitted the review
 */

/**
 * @swagger
 * tags:
 *   name: ProductReviews
 */

/**
 * @swagger
 * /productreviews:
 *   get:
 *     summary: Returns all product reviews
 *     tags: [ProductReviews]
 *     securtity:
 *              BearerAuth()
 *     responses:
 *       200:
 *         description: A list of product reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductReview'
 */
router.get("/", async (req, res) => {
    try {
        const reviews = await ProductReviews.find();
        res.send(reviews);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /productreviews/{id}:
 *   get:
 *     summary: Returns a product review by ID
 *     tags: [ProductReviews]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product review to get
 *     responses:
 *       200:
 *         description: A product review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
 *       404:
 *         description: Product review not found
 */
router.get("/:id", async (req, res) => {
    try {
        const review = await ProductReviews.findById(req.params.id);
        if (!review) {
            return res.status(404).send("Product review not found");
        }
        res.send(review);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /productreviews:
 *   post:
 *     summary: Adds a new product review
 *     tags: [ProductReviews]
 *     securtity:
 *              BearerAuth()
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductReview'
 *     responses:
 *       200:
 *         description: Returns the newly added product review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
 */
router.post("/", async (req, res) => {
    try {
        const newReview = await ProductReviews.create(req.body);
        res.send(newReview);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

/**
 * @swagger
 * /productreviews/{id}:
 *   put:
 *     summary: Updates a product review by ID
 *     tags: [ProductReviews]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductReview'
 *     responses:
 *       200:
 *         description: Updated product review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
 *       404:
 *         description: Product review not found
 */
router.put("/:id", async (req, res) => {
    try {
        const updatedReview = await ProductReviews.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReview) {
            return res.status(404).send("Product review not found");
        }
        res.send(updatedReview);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /productreviews/{id}:
 *   delete:
 *     summary: Deletes a product review by ID
 *     tags: [ProductReviews]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product review to delete
 *     responses:
 *       200:
 *         description: Product review deleted successfully
 *       404:
 *         description: Product review not found
 */
router.delete("/:id", async (req, res) => {
    try {
        const deletedReview = await ProductReviews.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).send("Product review not found");
        }
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
