import express from "express";
import User from "../models/user.js";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

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
      const fileName = `profileImages/${Date.now().toString()}-${
        file.originalname
      }`;
      cb(null, fileName);
    },
  }),
});

router.post("/addUser", async (req, res) => {
  console.log("addUser route hit");
  const { email, name, date_of_birth, firebaseUid, authProvider } = req.body;
  console.log(req.body);

  try {
    let existingUser = await User.findOne({ firebaseUid });

    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists", user: existingUser });
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

router.get("/getUser", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getUserbyId/:firebaseUid", async (req, res) => {
  console.log("getbyId route hit");
  const { firebaseUid } = req.params;
  console.log(req.body);
  console.log("Firebase UID:", firebaseUid);

  try {
    const singleUser = await User.findOne({ firebaseUid: firebaseUid });
    if (!singleUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(singleUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put(
  "/updateUser/:firebaseUid",
  upload.single("profileImage"),

  async (req, res) => {
    console.log("updateUser route hit");
    const { firebaseUid } = req.params;
    const { email, name, date_of_birth } = req.body;

    try {
      const updateFields = {
        email,
        name,
        date_of_birth,
      };

      if (req.file && req.file.location) {
        updateFields.profileImage = req.file.location;
      }

      const updatedUser = await User.findOneAndUpdate(
        { firebaseUid: firebaseUid },
        updateFields,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User updated successfully!",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

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

router.delete("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
