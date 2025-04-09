import express from 'express';
const router = express.Router();
const users = [
    {
        email: 'noah@email.com',
        username: 'noah',
        name: 'Noah',
        password: '1234',
        age: 25,
    },
]

router.get('/', (req, res) => {
    res.send(users);
});

export default router;  