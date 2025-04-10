import express from 'express';
const bookRoute = express.Router();
import bookSchema from '../models/BookSchema.js'

bookRoute.post('/addbook', async (req,res) => {
    try {
      const { ISBN, name, auther, category, price, age_limit, description } = req.body;
      const book = new bookSchema({ ISBN, name, auther, category, price, age_limit, description });
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

export default bookRoute;
