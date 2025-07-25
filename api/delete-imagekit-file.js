export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fileId } = req.query;
  if (!fileId) {
    return res.status(400).json({ error: "Missing fileId" });
  }

  // Use the private key from environment variable or fallback to the one in auth.js for local dev
  const IMAGEKIT_PRIVATE_KEY =
    process.env.IMAGEKIT_PRIVATE_KEY || "private_+4cDAMAoXCWHmPL6WMMKiq5ZI+g=";
  if (!IMAGEKIT_PRIVATE_KEY) {
    return res.status(500).json({ error: "Missing ImageKit private key" });
  }

  try {
    const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization:
          "Basic " + Buffer.from(IMAGEKIT_PRIVATE_KEY + ":").toString("base64"),
        Accept: "application/json",
      },
    });

    // ImageKit returns 204 No Content on success, so handle that
    if (response.status === 204) {
      return res.status(200).json({ success: true });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("ImageKit delete error:", err);
    res.status(500).json({
      error: "Server error",
      details: err && err.message ? err.message : err,
    });
  }
}
