const express = require('express')
const cors = require("cors");
require("dotenv").config();

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w0ws3zg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db("productDB").collection("product");


    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      console.log(result)
    });


    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });


    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      console.log(result)
      res.send(result);
    });


    app.post("/product/:id", async (req, res) => {
      const productDetails = req.body;
      console.log(productDetails);
      const result = await productCollection.insertOne(productDetails);
      console.log(result)
      res.send(result);
    });



    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const coffee = {
        $set: {
          name: updateProduct.name,
          brnad: updateProduct.brand,
          type: updateProduct.type,
          price: updateProduct.price,
          description: updateProduct.description,
          rating: updateProduct.rating,
          image: updateProduct.image,
        },
      };
      const result = await productCollection.updateOne(filter,coffee,options)
      res.send(result)
      console.log(result)
    });


    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });





    // app.get("/products/:name", async (req, res) => {
    //   const name = req.params.name;
    //   const query = {brand: new ObjectId(name)};
    //   const result = await productCollection.findOne(query);
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})