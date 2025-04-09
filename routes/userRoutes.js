import express from 'express';
import user from '../models/user.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, username, name, password, age } = req.body;

    try {
        const newUser = await user.create({
            email,
            username,
            name,
            password,
            age
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const singleUser = await user.findById(id);
        res.status(200).json(singleUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { email, username, name, password, age } = req.body;

    try {
        const updatedUser = await user.findByIdAndUpdate(id, {
            email,
            username,
            name,
            password,
            age
        }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/changePassword/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const updatedUser = await user.findByIdAndUpdate(id, {
            password,
        }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



export default router;