const router = require("express").Router();
let User = require("../models/User");
let Electrician = require("../models/Electrician");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require("dotenv").config();
router.route("/electrician").post(auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    // Get the user from the token
    const user = await User.findById(req.user.id);
    // Add the user data to the electrician table
    console.log(req.body);
    const type = req.body["type"];
    const status = req.body["status"];
    const electrician = new Electrician({
      title,
      description,
      type,
      status,
      userId: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      userType: user.userType,
    });
    // Save the electrician data to the database
    await electrician.save();

    // Update the user's appliedForJob array
    user.appliedForJob.push({
      title,
      description,
      category: `${req.body.type}`,
      status,
    });
    await user.save();

    res.json("Electrician job application submitted successfully");
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
    console.log(`Error: ${error}`);
  }
});
router.route("/electrician/getAll").get(auth, async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    console.log(users);
    const array = [];
    for (let x = 0; x < users.length; x++) {
      if (users[x].appliedForJob.length > 0) {
        for (let y = 0; y < users[x].appliedForJob.length; y++) {
          array.push(users[x].appliedForJob[y]);
        }
      }
    }
    console.log(users);
    const userJobs = users;
    res.status(200).json({ userJobs });
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
    console.log(`Error: ${error}`);
  }
});
router.get("/token", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
