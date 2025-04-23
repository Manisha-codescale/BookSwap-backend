import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.post('/addUser', async (req, res) => {
    console.log('addUser route hit');
    const { email, name, date_of_birth, firebaseUid, authProvider } = req.body;
    console.log(req.body);
  
    try {
      let existingUser = await User.findOne({ firebaseUid });
  
      if (existingUser) {
        return res.status(200).json({ message: 'User already exists', user: existingUser });
      }
  
      const newUser = await User.create({
        email,
        name,
        date_of_birth,
        firebaseUid,
        authProvider,
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

router.get('/getUser', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/getUserbyId/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const singleUser = await User.findById(id);
        res.status(200).json(singleUser);
    } catch (error) {
        res.status(400).json({ error: error.messdate_of_birth });
    }
});

router.put('/updateUser/:id', async (req, res) => {
    const { id } = req.params;
    const { email, name, date_of_birth } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            email,
            name,
            date_of_birth
        }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* router.put('/changePassword/:id', async (req, res) => {
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
}); */

router.delete('/deleteUser/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
);


export default router;