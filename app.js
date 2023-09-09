const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000

app.use(bodyparser.json());
const corsOptions = {
    origin: 'http://localhost:3000',
};
  
app.use(cors(corsOptions));
  

mongoose.connect('mongodb+srv://lokeshb003:kepler22b@cluster0.bnggsui.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/api/login', async(req,res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).json({ message: 'Login Sucessful' });
        } else {
            res.status(401).json({ message: 'Invalid Username or Password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
  
      if (existingUser) {
        // User with the same username already exists
        res.status(400).json({ message: 'Username already taken' });
      } else {
        // Create a new user
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});