import express from "express";
import bookSchema from "../models/BookSchema.js";
import authenticateFirebase from "../middleware/authMiddleware.js";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();

const bookRoute = express.Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const bucketName = "bookswap-image-bucket";

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: bucketName,
    //acl: 'public-read',
    key: function (req, file, cb) {
      const fileName = `bookImages/${Date.now().toString()}-${
        file.originalname
      }`;
      cb(null, fileName);
    },
  }),
});

bookRoute.post("/addbook", authenticateFirebase, upload.single('bookImage'), async (req, res) => {
  try {
    const {
      ISBN,
      name,
      auther,
      category,
      price,
      age_limit,
      description,
      isConditionUsed,
    } = req.body;

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
      bookImage: req.file ? req.file.location : null,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRoute.get("/listAddedbooks", authenticateFirebase, async (req, res) => {
  try {
    console.log(req.firebaseUID);
    const books = await bookSchema.find({ firebaseUID: req.firebaseUID });
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// bookRoute.get('/listbook/:firebaseUID', async (req,res) => {
//     try {
//         const books = await bookSchema.find({ firebaseUID: req.params.firebaseUID });
//         res.status(200).json(books);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// })

bookRoute.get("/listbook", async (req, res) => {
  try {
    const books = await bookSchema.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRoute.get("/listbook/:id", async (req, res) => {
  try {
    const book = await bookSchema.findById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRoute.delete("/deletebook/:id", async (req, res) => {
  try {
    const book = await bookSchema.findByIdAndDelete(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* bookRoute.put("/updatebook/:id", authenticateFirebase, async (req, res) => {
  try {
    const {
      ISBN,
      name,
      auther,
      category,
      price,
      age_limit,
      description,
      isConditionUsed,
    } = req.body;
    const book = await bookSchema.findByIdAndUpdate(
      req.params.id,
      {
        ISBN,
        name,
        auther,
        category,
        price,
        age_limit,
        description,
        isConditionUsed,
      },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).send("Book not found.");
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}); */

bookRoute.put(
  "/updateBook/:id",
  upload.single("bookImage"),
  authenticateFirebase,

  async (req, res) => {
    const { id } = req.params;
    const { ISBN, name, auther, category, price, age_limit, description } =
      req.body;

    try {
      const updateFields = {
        ISBN,
        name,
        auther,
        category,
        price,
        age_limit,
        description,
      };

      if (req.file && req.file.location) {
        updateFields.bookImage = req.file.location;
      }

      const updatedBook = await bookSchema.findByIdAndUpdate(id, updateFields, {
        new: true,
      });

      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({
        message: "Book updated successfully!",
        book: updatedBook,
      });
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

bookRoute.get("/filterbook", async (req, res) => {
  try {
    const {
      category,
      isConditionUsed,
      minimum_age,
      maximum_age,
      minimum_price,
      maximum_price,
    } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (isConditionUsed) {
      filter.isConditionUsed = isConditionUsed === "true";
    }
    if (minimum_age || maximum_age) {
      filter.age_limit = {};
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
    if (!filteredbooks.length) return res.status(404).send("No Books found.");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRoute.get("/filterBookAuthName", async (req, res) => {
  try {
    const { search } = req.query;

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { auther: { $regex: search, $options: "i" } },
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
