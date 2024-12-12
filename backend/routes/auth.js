const express = require("express");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });

    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture } = payload;

    let user = await User.findOne({ googleId });
    if (!user) {
      user = new User({ googleId, name, email, picture });
      await user.save();
    }

    res.json({ user, message: "Login successful" });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

module.exports = router;
