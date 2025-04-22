import express from 'express';
const bookRoute = express.Router();
import bookSchema from '../models/BookSchema.js'
import authenticateFirebase from '../middleware/authMiddleware.js';

bookRoute.post('/addbook', authenticateFirebase, async (req, res) => {
    try {
      const { ISBN, name, auther, category, price, age_limit, description, isConditionUsed } = req.body;
  
      const book = new bookSchema({
        ISBN,
        name,
        auther,
        category,
        price,
        age_limit,
        description,
        isConditionUsed,
        firebaseUID: req.user.uid, 
      });
  
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

bookRoute.get('/listbook', async (req,res) => {
    try {
        const books = await bookSchema.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

bookRoute.get('/listbook/:id', async (req,res) => {
    try{
        const book = await bookSchema.findById(req.params.id);
        res.status(200).json(book);
    }catch (error) {
        res.status(400).json({ message: error.message });
    }
})

bookRoute.delete('/deletebook/:id', async (req,res) => {
    try {
        const book = await bookSchema.findByIdAndDelete(req.params.id);
        res.status(200).json(book);
    }catch (error) {
        res.status(400).json({ message: error.message });
    }
})

bookRoute.put('/updatebook/:id', async (req,res) => {
    try{
        const { ISBN, name, auther, category, price, age_limit, description } = req.body;
        const book = await bookSchema.findByIdAndUpdate(req.params.id,
             { ISBN, name, auther, category, price, age_limit, description }, 
            { new: true, runValidators: true });
        res.status(200).json(book);
        
        if(!book) return res.status(404).send("Book not found.");
    }catch (error) {
        res.status(400).json({ message: error.message });
    }
})

bookRoute.get('/filterbook', async (req, res) => {
    try {
        const { category, isConditionUsed, minimum_age, maximum_age, minimum_price, maximum_price } = req.query;
        const filter = {};

        if (category) {
            filter.category = category;
        }
        if (isConditionUsed) {
            filter.isConditionUsed = isConditionUsed === 'true';
        }
        if (minimum_age || maximum_age) {
            filter.age_limit = { };
            if (minimum_age) filter.age_limit.$gte = Number(minimum_age);
            if (maximum_age) filter.age_limit.$lte = Number(maximum_age);
        }
        if (minimum_price || maximum_price) {
            filter.price = {};
            if (minimum_price) filter.price.$gte = Number(minimum_price);
            if (maximum_price) filter.price.$lte = Number(maximum_price);
        }   

        const filteredbooks = await bookSchema.find(filter);

        res.status(200).json(filteredbooks);
        if(!filteredbooks.length) return res.status(404).send("No Books found.");
    }catch (error) {
        res.status(400).json({ message: error.message });
    }
})

bookRoute.get('/filterBookAuthName', async (req, res) => {
    try {
      const { search } = req.query;
  
      const filter = search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },  
              { auther: { $regex: search, $options: 'i' } },
            ],
          }
        : {}; 
  
      const filteredbooks = await bookSchema.find(filter);
  
      if (!filteredbooks.length) {
        return res.status(404).send("No Books found.");
      }
  
      res.status(200).json(filteredbooks);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

export default bookRoute;
