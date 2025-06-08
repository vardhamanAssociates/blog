const express = require("express");
const cors = require("cors");
const ImageKit = require("imagekit");

const app = express();
const port = 3000;

const imagekit = new ImageKit({
  publicKey: "public_C5juPBxFMNI+aIo/PkxOrNXPtFM=",
  privateKey: "private_+4cDAMAoXCWHmPL6WMMKiq5ZI+g=",
  urlEndpoint: "https://ik.imagekit.io/fhhfomunb",
});

app.use(cors({ origin: "*" }));

app.options("/api/auth", (req, res) => {
  res.sendStatus(200);
});

app.get("/api/auth", (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.json(authParams);
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    res.status(500).json({ error: "ImageKit Auth Error" });
  }
});

app.listen(port, () => {
  console.log(`Local server running at http://localhost:${port}`);
});
