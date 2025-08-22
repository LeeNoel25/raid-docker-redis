const express = require("express");
const redis = require("redis");
const app = express();

// Create a Redis client
const client = redis.createClient({
  url: "redis://redis:6379",
});

// Connect to Redis and initialize
client
  .connect()
  .then(async () => {
    console.log("Connected to Redis");

    // Only set visits to 0 if it doesn't exist
    const exists = await client.exists("visits");
    if (!exists) {
      await client.set("visits", 0);
      console.log("Initialized visit count");
    }
  })
  .catch((err) => console.error("Error connecting to Redis:", err));

// Define the route
app.get("/", async (req, res) => {
  try {
    const updatedVisits = await client.incr("visits");
    res.send(`You are the ${updatedVisits}th visitor.`);
  } catch (err) {
    console.error("Error interacting with Redis:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
