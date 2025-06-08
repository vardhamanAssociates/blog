const ImageKit = require("imagekit");

var imagekit = new ImageKit({
  publicKey: "public_LIte2WVb2L+8OZtVNv3nDya6DgM=",
  privateKey: "private_CtI9OtjxI/hCRamOq5NdALxxMvM=",
  urlEndpoint: "https://ik.imagekit.io/fhhfomunb/",
});

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Handle image upload
    if (req.method === "POST") {
      const { image, fileName } = req.body;

      if (!image || !fileName) {
        return res
          .status(400)
          .json({ error: "Image and fileName are required" });
      }

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(image.split(",")[1], "base64");

      // Upload to ImageKit
      const result = await imagekit.upload({
        file: imageBuffer,
        fileName: fileName,
        folder: "/blog-images",
      });

      // Ensure we have a URL before sending response
      if (!result.url) {
        throw new Error("Failed to get image URL from ImageKit");
      }

      return res.status(200).json({
        url: result.url,
        fileId: result.fileId,
        success: true,
      });
    }

    // Handle authentication request
    if (req.method === "GET") {
      const result = imagekit.getAuthenticationParameters();
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      error: "Server error",
      details: err && err.message ? err.message : err,
      success: false,
    });
  }
};
