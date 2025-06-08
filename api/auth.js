const ImageKit = require("imagekit");

var imagekit = new ImageKit({
  publicKey: "public_LIte2WVb2L+8OZtVNv3nDya6DgM=",
  privateKey: "private_CtI9OtjxI/hCRamOq5NdALxxMvM=",
  urlEndpoint: "https://ik.imagekit.io/fhhfomunb/"
});

module.exports = (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const result = imagekit.getAuthenticationParameters();
    res.status(200).json(result);
  } catch (err) {
    console.error("ImageKit auth error:", err);
    res.status(500).json({ error: "Auth server error", details: err && err.message ? err.message : err });
  }
};
