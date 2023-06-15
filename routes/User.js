const router = require("express").Router();
let User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth")
require("dotenv").config();
router.route("/signup").post(async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  const address = req.body.address;
  const type = req.body.type;
  console.log(username);
  console.log(email);
  console.log(phoneNumber);
  console.log(address);
  const user = await User.findOne({ email });
  if (user) {
    return res.status(404).json("User already exists");
  }
  const newUser = new User({
    username,
    email,
    password,
    phoneNumber,
    address,
    type,
    appliedForJob: [],
  });
  await newUser
    .save()
    .then(() => res.status(201).json("User added!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});
router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User not found");
    }
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(401).json("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, "my_temporary_secret", {
      expiresIn: "1h",
    });
    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 86400000 });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
});
router.route("/getAll").get(async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
});
router.route("/delete/:id").delete(async (req, res) => {
  try {
    const users = await User.findOneAndRemove({
      _id: req.params.id,
    });

    res.status(200).json("User has been deleted!");
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
});
router.get('/token', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
