const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
    phonenumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    }
});

// Create a User model using the schema
const User = mongoose.model("users", userSchema,"users");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - phonenumber
 *         - role
 *         - email
 *         - password
 *         - address
 *         - state
 *         - pincode
 *       properties:
 *         phonenumber:
 *           type: string
 *           description: Phone number of the user
 *         role:
 *           type: string
 *           description: Role of the user (e.g., Farmer)
 *         photo:
 *           type: string
 *           description: URL of the user's photo
 *         email:
 *           type: string
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Password of the user
 *         address:
 *           type: string
 *           description: Address of the user
 *         state:
 *           type: string
 *           description: State of the user
 *         pincode:
 *           type: string
 *           description: Pincode of the user's address
 */

/**
 * @swagger
 * tags:
 *   name: Users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns all users
 *     tags: [Users]
 *     securtity:
 *              BearerAuth()
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Returns a user by ID
 *     tags: [Users]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to get
 *     responses:
 *       200:
 *         description: A user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Adds a new user
 *     tags: [Users]
 *     securtity:
 *              BearerAuth()
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Returns the newly added user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/", async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.send(newUser);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Updates a user by ID
 *     tags: [Users]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }
        res.send(updatedUser);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletes a user by ID
 *     tags: [Users]
 *     securtity:
 *              BearerAuth()
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
