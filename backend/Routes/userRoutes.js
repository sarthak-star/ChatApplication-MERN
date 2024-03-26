const express = require("express");
const {registeruser,authUser,allUsers} = require("../controllers/usercontroller");
const { protect } = require("../middlewares/authmiddleware");

const router=express.Router();

router.route("/").post(registeruser).get(protect,allUsers);
router.route("/login").post(authUser);

module.exports = router;