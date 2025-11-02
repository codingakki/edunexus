import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./server/models/Product.js";

dotenv.config();

const products = [
  {
    title: "Calculus Textbook",
    subject: "Math",
    price: 350,
    location: "Campus A",
    desc: "Used, good condition.",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Data Structures Textbook",
    subject: "CS",
    price: 300,
    location: "Online",
    desc: "Concepts with problems.",
    img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=500&q=80"
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("✅ Sample products added!");
    mongoose.connection.close();
  })
  .catch((err) => console.error(err));
