const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define the Feedback schema
const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create a Feedback model using the schema
const Feedback = mongoose.model("Feedback", feedbackSchema,"Feedback");

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - feedback
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the user giving feedback
 *         email:
 *           type: string
 *           description: Email address of the user giving feedback
 *         feedback:
 *           type: string
 *           description: Feedback message
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the feedback was submitted
 */

/**
 * @swagger
 * tags:
 *   name: Feedback
 */

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Returns all user feedback
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: A list of user feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 */
router.get("/", async (req, res) => {
    try {
        const feedback = await Feedback.find();
        res.send(feedback);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Adds a new user feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       200:
 *         description: Returns the newly added user feedback
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 */
router.post("/", async (req, res) => {
    try {
        const newFeedback = await Feedback.create(req.body);
        res.send(newFeedback);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

/**
 * @swagger
 * /feedback/{id}:
 *   get:
 *     summary: Returns user feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the feedback to get
 *     responses:
 *       200:
 *         description: User feedback found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback not found
 */
router.get("/:id", async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).send("Feedback not found");
        }
        res.send(feedback);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


/**
 * @swagger
 * /feedback/{id}:
 *   put:
 *     summary: Updates user feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the feedback to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       200:
 *         description: Updated user feedback
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback not found
 */
router.put("/:id", async (req, res) => {
    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFeedback) {
            return res.status(404).send("Feedback not found");
        }
        res.send(updatedFeedback);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /feedback/{id}:
 *   delete:
 *     summary: Deletes user feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the feedback to delete
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       404:
 *         description: Feedback not found
 */
router.delete("/:id", async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!deletedFeedback) {
            return res.status(404).send("Feedback not found");
        }
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
