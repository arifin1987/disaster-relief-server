const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.59h68ks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const donationsCollection = client
      .db("disaster_relief")
      .collection("donations");
    const reviewCollection = client.db("disaster_relief").collection("reviews");
    app.get("/donations", async (req, res) => {
      const result = await donationsCollection.find().toArray();
      res.send(result);
    });

    app.get("/donations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await donationsCollection.findOne(query);
      res.send(result);
    });
    app.post("/donations", async (req, res) => {
      const donation = req.body;
      const result = await donationsCollection.insertOne(donation);
      res.send(result);
    });

    app.delete("/donations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await donationsCollection.deleteOne(query);
    });

    app.put("/donations/:id", async (req, res) => {
      const id = req.params.id;
      const donation = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          image: donation.image,
          title: donation.title,
          category: donation.category,
          amount: donation.amount,
        },
      };
      const options = { upsert: true };
      const result = await donationsCollection.updateOne(
        query,
        updateDoc,
        options
      );

      res.send(result);
    });
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deploymentyyy. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Disaster relief server is running");
});

app.listen(port, () => {
  console.log(`Disaster relief server is running on port ${port}`);
});
