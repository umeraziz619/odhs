const router = require("express").Router();
let User = require("../models/User");
let Electrician = require("../models/Electrician");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
// const uuid = require("uuid/v4");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
router.route("/electrician").post(auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    // Get the user from the token
    const user = await User.findById(req.user.id);
    // Add the user data to the electrician table
    const jobId = uuidv4();
    const type = req.body["type"];
    const status = req.body["status"];
    const assignedTo = req.body["assignedTo"];
    const electrician = new Electrician({
      title,
      description,
      type,
      status,
      assignedTo,
      userId: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      userType: user.userType,
      job_Id: jobId,
    });
    // Save the electrician data to the database
    await electrician.save();
    // Update the user's appliedForJob array
    user.appliedForJob.push({
      title,
      description,
      category: `${req.body.type}`,
      status,
      jobId,
      assignedTo,
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
    const array = [];
    for (let x = 0; x < users.length; x++) {
      if (users[x].appliedForJob.length > 0) {
        for (let y = 0; y < users[x].appliedForJob.length; y++) {
          array.push(users[x].appliedForJob[y]);
        }
      }
    }
    const userJobs = users;
    res.status(200).json({ userJobs });
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
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
//Update Job by  id ---- Update job Status
router.route("/user/:userid/update/:jobid").patch(auth, async (req, res) => {
  try {
    //Update Job by Id
    const user = await User.findById(req.params.userid);

    for (let x = 0; x < user.appliedForJob.length; x++) {
      if (user.appliedForJob[0].jobId === req.params.jobid) {
        user.appliedForJob[0].status = "Completed";
      }
    }

    const updateUser = await User.findByIdAndUpdate(req.params.userid, user);
    await user.save();
    res.json(updateUser);
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
    console.log(`Error: ${error}`);
  }
});
//Update Job by id ---- Update job assignTo
router
  .route("/user/:userid/update/:jobid/assign/:assignToid")
  .patch(async (req, res) => {
    try {
      //Update Job by Id
      const user = await User.findById(req.params.userid);
      for (let x = 0; x < user.appliedForJob.length; x++) {
        if (user.appliedForJob[0].jobId === req.params.jobid) {
          user.appliedForJob[0].assignedTo = req.params.assignToid;
        }
      }
      const updateUser = await User.findByIdAndUpdate(req.params.userid, user);
      await user.save();
      res.json(updateUser);
    } catch (error) {
      res.status(500).json(`Error: ${error}`);
      console.log(`Error: ${error}`);
    }
  });

module.exports = router;
