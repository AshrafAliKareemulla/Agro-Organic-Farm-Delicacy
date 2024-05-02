const dotenv=require("dotenv").config();
const mongoose=require("mongoose");
const express=require("express");
const cors=require("cors");
const cookieParser=require('cookie-parser');
const userRoute=require("./routes/userRoute")
const errorHandler=require("./middleware/errorMiddleware");
const app=express();
const multer = require('multer');
const morgan = require('morgan');
const helmet = require('helmet');
const rfs =require("rotating-file-stream")
const path = require('path');
const nodemailer =require( 'nodemailer');
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const redis = require("redis");
// const  client = require("./lib/lib.js");


//!MiddleWares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5000" ,"https://wed-project-1.onrender.com" , "https://wed-project.vercel.app"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true
}))


app.set('client',path.join(__dirname,'client'))

//! morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
morgan.token("request","new :method request for :url of version :http-version by :remote-user .it took :total-time[2] to be resolved")
app.use(morgan("request"))

app.use(helmet())
const roll="Event"
var accessLogStream=rfs.createStream(roll+".log",{
interval:'1d',
path:path.join(__dirname,'log')})

app.use(morgan("new :method request for :url of version :http-version by :res[header] .it took :total-time[2] to be resolved",{stream:accessLogStream}))


//csrf






//! Routes
app.use("/api",userRoute);

app.get("/home",(req,res)=>{
    res.send("HomePage...")
})


//swagger routes

const productRouter = require('./swagger/productRouter'); 
const Cartdata = require('./swagger/Cartdata'); 
const ReviewsRouter = require('./swagger/ReviewsRouter'); 
const UserRouter = require('./swagger/UserRouter'); 
const FeedBack = require('./swagger/FeedBack'); 


// Swagger configuration
const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Organic Farming",
      version: "2.0.0",
      description: "API application made with express and documented with swaggerAPI"
    },
    servers: [
      {
        url: "https://wed-project-1.onrender.com/",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./swagger/*.js'],
};

const specs = swaggerJSDoc(options);

// Serve Swagger UI documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Routes
app.use("/users", UserRouter);
app.use("/products", productRouter);
app.use("/cart", Cartdata);
app.use("/productReviews", ReviewsRouter);
app.use("/Feedback", FeedBack);




// import nodemailer =require( 'nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aorganic63@gmail.com',
    pass: 'qrjf oibw cqxy edkb',
  },
});


// app.put("/api/updateUser", updateUser);

// Assuming you have the necessary imports and Mongoose setup

app.get("/api/home12", async (req, res) => {
  try {
      const dbobj = mongoose.connection;
      const userData = await dbobj.collection('users').find().toArray();
      // console.log(userData)
      res.status(200).json(userData);
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});



// Create a Redis client
const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

// Error handling for Redis client
redisClient.on("error", function(error) {
  console.error("Error connecting to Redis:", error);
});

// Log message when Redis client connects successfully
redisClient.on("connect", function() {
  console.log("Redis connected successfully");
});

// Middleware to handle caching logic
const cacheMiddleware = (req, res, next) => {
  const cacheKey = 'products';

  // Check if Redis client is connected
  if (!redisClient.connected) {
      console.error("Redis client is not connected");
      return next(); 
  }

  // Check if data exists in cache
  redisClient.get(cacheKey, (err, data) => {
      if (err) {
          console.error("Error retrieving data from Redis:", err);
          return next(); // Continue without cache if there's an error
      }

      if (data !== null) {
          console.log('Data retrieved from cache');
          res.json(JSON.parse(data));
      } else {
          next();
      }
  });
};



app.get('/api/product', cacheMiddleware, async (req, res) => {
  try {
      const dbobj = mongoose.connection;
      const productdata = await dbobj.collection('products').find().toArray();

      // Cache data using Redis
      redisClient.setex('products', 3600, JSON.stringify(productdata), (err, reply) => {
          if (err) {
              console.error("Error caching data in Redis:", err);
          } else {
              console.log("Data cached in Redis");
          }
      });

      res.status(200).json(productdata);
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});





// app.get("/api/products", async (req, res) => {
//   try {
//       // Check if data exists in cache
//       console.log("searching in cache");
//       const cachedData = await client.get('products');
//       if (cachedData) {
//           // Data found in cache, return it
//           console.log("found in cache ");  
//           const products = JSON.parse(cachedData);
//           return res.status(200).json(products);
//       } else {
//           // Data not found in cache, fetch from database
//           console.log("not in cache");
//           const dbobj = mongoose.connection;
//           const productdata = await dbobj.collection('products').find().toArray();
//           // Store data in cache for future use
//           await client.set('products', JSON.stringify(productdata));
//           res.status(200).json(productdata);
//       }
//   } catch (error) {
//       console.error("Error fetching data:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//   }
// });




app.get("/api/products", async (req, res) => {
    try {
        const dbobj = mongoose.connection;
        const productdata = await dbobj.collection('products').find().toArray();
        // console.log(userData)
        res.status(200).json(productdata);
        
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
  });



  app.get("/api/cart", async (req, res) => {
    try {
      const userEmail = req.query.email;
      const dbobj = mongoose.connection;
      const userCartItems = await dbobj.collection('cart').find({ email: userEmail }).toArray();
      res.status(200).json(userCartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Add product to user's cart in MongoDB
  app.post("/api/addToCart", async (req, res) => {
    try {
      const newProduct = req.body;
      const dbobj = mongoose.connection;
      await dbobj.collection('cart').insertOne(newProduct);
      res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

  // Add this route in your index.js (Express server)
app.put("/api/updateCartItem/:itemId", async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const updatedItem = req.body; // This should contain the updated quantity
      const userEmail=req.body.email;
      // console.log(userEmail)

  
      const dbobj = mongoose.connection;
      await dbobj.collection('cart').updateOne(
        { p_id: itemId, status1: 0, email: userEmail },
        { $set: { quantity: updatedItem.quantity } }
      );
      
  
      res.status(200).json({ message: "Quantity updated successfully" });
    } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  


  app.delete("/api/deleteCartItem/:itemId", async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const userEmail = req.body.email;
      console.log(userEmail)
      const dbobj = mongoose.connection;

      const deletedResult = await dbobj.collection('cart').deleteOne({ p_id: itemId, status1: 0, email: userEmail  });
  
      if (deletedResult.deletedCount === 1) {
        return res.status(200).json({ message: "Item deleted successfully" });
      } else {
        return res.status(500).json({ message: "Failed to delete item" });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
// // import nodemailer =require( 'nodemailer');
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'aorganic63@gmail.com',
//       pass: 'psqy tocg qspm vrat',
//     },
//   });


  app.put('/api/updateOrderStatus', async (req, res) => {
    const updatedItems = Array.isArray(req.body.data1) ? req.body.data1 : [req.body.data1];
    const userEmail = req.body.data2.email;
  
    const dbobj = mongoose.connection;
  
    try {
      const email1 = 'saikumarreddy.g21@iiits.in';
      console.log(email1);
  
      let productNamesTable = '';
      let productNamesTable2 = '';

      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];
        const totalPrice = (item.product_mrp * (1 - item.offer / 100) * item.quantity).toFixed(2);
      
        productNamesTable += `
          <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <p><strong>Product Name:</strong> ${item.product_name}</p>
            <p><strong>Quantity:</strong> ${item.quantity}</p>
            <p><strong>Cost:</strong> ${totalPrice}</p>
          </div>

        `;
      
      productNamesTable2 += `
      <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        <p><strong>Product Name:</strong> ${item.product_name}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
       >
      </div>

    `;
  }
  
      
      const mailOptions = {
        from: 'aorganic63@gmail.com',
        to: userEmail,
        subject: 'Ordered Products',
        html: `
          <div>
            <p>Your order is confirmed.</p>
            <p><strong>Product Details:</strong></p>
            ${productNamesTable}
          </div>
          <p>The Organic Team</p>
       
          <p>Email : aorganic63@gmail.com<br />
        `,
      };
      const mailOptions2 = {
        from: 'aorganic63@gmail.com',
        to: 'gsaikumarreddy2004@gmail.com', // Replace with the second email address
        subject: 'Cart Data',
        html: `
          <div>
            <p>Some New product are present in Cart data please check</p>
            <p><strong>Product Details:</strong></p>
            ${productNamesTable2}
          </div>
          <p>The Organic Team</p>
       
          <p>Email : aorganic63@gmail.com<br />
        `,
      };
  
      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];
        const updateQuery = {
          p_id: item.p_id,
          status1: 0,
          email: userEmail,
        };
  
        const updateFields = {
          $set: {
            status1: item.status1,
            date: item.date,
            time: item.time,
            orderId: item.orderId,
            status2: 'Confirmed',
            Payment_Type: item.type,
          },
        };
  
        const result = await dbobj.collection('cart').updateOne(updateQuery, updateFields);
  
        if (result.nModified > 0) {
          // console.log(`Item ${i + 1} updated successfully`);
        } else {
          // console.log(`Item ${i + 1} not found or not eligible for update`);
        }
      }
  
      // Send a single email after updating all items
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(mailOptions2);
  
      res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  
  
  

  const { ObjectId } = require('mongoose').Types;
  app.put("/api/selecteditem/:productId", async (req, res) => {
    try {
      
      const itemId = new ObjectId(req.params.productId);
      const updatedItem = req.body;
      updatedItem.selected = String(updatedItem.selected);
      const dbobj = mongoose.connection;
    const out=  await dbobj.collection('products').findOne(
        { _id: itemId }
        
      );
      const email1 = 'saikumarreddy.g21@iiits.in';
      console.log(email1);
  
      const senddata=`
      <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        <p><strong>Product Name:</strong> ${out.product_name}</p>
        
      </div>
     `;

      const mailOptions = {
        from: 'aorganic63@gmail.com',
        to: out.email,
        subject: 'Product Approved',
        html: `
          <div>
            <p>Your Product is Approved.</p>
             <p><strong>Product Details:</strong></p>
            ${senddata}
            
          </div>
          <p>The Organic Team</p>
       
          <p>Email : aorganic63@gmail.com<br />
        `,
      };
  
      // const dbobj = mongoose.connection;
      await dbobj.collection('products').updateOne(
        { _id: itemId },
        { $set: { selected: updatedItem.selected } }
      );
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Quantity updated successfully" });
    } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  


  app.delete("/api/rejectitem/:productId", async (req, res) => {
    try {
      
      const itemId = new ObjectId(req.params.productId);
      // const updatedItem = req.body;
      // updatedItem.selected = String(updatedItem.selected);


      console.log(itemId)
  
      const dbobj = mongoose.connection;
      const out=  await dbobj.collection('products').findOne(
          { _id: itemId }
          
        );
        const email1 = 'saikumarreddy.g21@iiits.in';
        console.log(email1);
    
        const senddata=`
        <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          <p><strong>Product Name:</strong> ${out.product_name}</p>
          
        </div>
       `;
  
        const mailOptions = {
          from: 'aorganic63@gmail.com',
          to: out.email,
          subject: 'Product Rejected',
          html: `
            <div>
              <p>Your Product is Rejected Due to Incorrect Data.</p>
              <p><strong>Product Details:</strong></p>
              ${senddata}
            </div>
            <p>Our Team</p>
            <p>Email : aorganic63@gmail.com<br />
          `,
        };
      await dbobj.collection('products').deleteOne(
        { _id: itemId }
      );
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: "Quantity updated successfully" });
    } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  
  


  app.post("/api/addfeedback", async (req, res) => {
    try {
      const newdata = req.body;
      const dbobj = mongoose.connection;
      await dbobj.collection('Feedback').insertOne(newdata);
      res.status(200).json({ message: "feedback added to cart successfully" });
    } catch (error) {
      console.error("Error adding feedback:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


  app.get("/api/reviews", async (req, res) => {
    try {
        const dbobj = mongoose.connection;
        const reviewdata = await dbobj.collection('Feedback').find().toArray();
        // console.log(userData)
        res.status(200).json(reviewdata);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
  });


  app.get("/api/cartdata", async (req, res) => {
    try {
      
      const dbobj = mongoose.connection;
      const userCartItems = await dbobj.collection('cart').find().toArray();
      res.status(200).json(userCartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });




  app.put("/api/updateCartstatus/:productId", async (req, res) => {
    try {
      const itemId = new ObjectId(req.params.productId);
      const updatedItem = req.body; // This should contain the updated quantity
     // const userEmail=req.body.email;
     const dbobj = mongoose.connection;
     const out=  await dbobj.collection('cart').findOne(
         { _id: itemId }
         
       );
       const email1 = 'saikumarreddy.g21@iiits.in';
       console.log(itemId);
      //  const totalPrice = (item.product_mrp * (1 - item.offer / 100) * item.quantity).toFixed(2);
       const senddata=`
       <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
         <p><strong>Product Name:</strong> ${out.product_name} </p>
         <p><strong>Quantity:</strong> ${out.quantity} </p>
         
         <p><strong>is ${updatedItem.status2}</strong>  on ${updatedItem.delivereddate}</p>
         
       </div>
      `;
 
       const mailOptions = {
         from: 'aorganic63@gmail.com',
         to: out.email,
         subject: 'Product Status',
         html: `
           <div>
             
              <p><strong>Status  Details:</strong></p>
             ${senddata}
           </div>
           <p>Our Team</p>
       
           <p>Email : aorganic63@gmail.com<br />
         `,
       };

      await dbobj.collection('cart').updateOne(
        { _id: itemId },
        { $set: { status2: updatedItem.status2 ,delivereddate:updatedItem.delivereddate} }
      );
      await transporter.sendMail(mailOptions);

      
  
      res.status(200).json({ message: "Quantity updated successfully" });
    } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });
  
  app.post('/api/addproducts', upload.array('product_images', 3), async (req, res) => {
    try {
      const newdata = req.body;
      const email1 = 'saikumarreddy.g21@iiits.in';
      console.log(email1);
  
      const senddata=`
      <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        <p><strong>Product Name:</strong> ${newdata.product_name}</p>
        
        
      </div>
     `;


     const mailOptions1 = {
      from: 'aorganic63@gmail.com',
      to: newdata.email, // Replace with the first email address
      subject: 'Product Upload',
      html: `
        <div>
          <p>Your Product is sent for verification.</p>
          <p><strong>Product Details:</strong></p>
          ${senddata} 
        </div>
        <p>Thank you for Uplading  your product!<br/>The Organic Team</p>
       
        <p>Email : aorganic63@gmail.com<br />

      `,
    };
    
    // Second mail options
    const mailOptions2 = {
      from: 'aorganic63@gmail.com',
      to: 'gsaikumarreddy2004@gmail.com', // Replace with the second email address
      subject: 'New Product Upload',
      html: `
        <div>
          <p>Some New product is added please update status</p>
          <p><strong>Product Details:</strong></p>
          ${senddata}
        </div>
      `,
    };
    
    // Use the transporter to send emails

      // Access file buffer and save it to your MongoDB
      const images = req.files.map((file) => ({
        filename: file.originalname,
        data: file.buffer,
      }));
  
      newdata.product_images = images;
  
      const dbobj = mongoose.connection;
      await dbobj.collection('products').insertOne(newdata);
      await transporter.sendMail(mailOptions1);
      await transporter.sendMail(mailOptions2);
  
  
      res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  app.post('/api/updateprofile', upload.array('images', 1), async (req, res) => {
    try {
      const newData = req.body;
      console.log(newData)
      
      if (req.files && req.files.length > 0) {
        // Access file buffer and save it to your MongoDB
        const images = req.files.map((file) => ({
          filename: file.originalname,
          data: file.buffer,
        }));
      
        newData.images = images;
      }
  
      const dbobj = mongoose.connection;
  
      // Assuming you have a unique identifier like '_id' for the user
      const userId = newData._id;
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required for updating' });
      }
  
      // Remove the _id from the newData to prevent updating it
      delete newData._id;
  
      // Update the user profile based on userId
      await dbobj.collection('users').updateOne({ _id: new mongoose.Types.ObjectId(userId) }, 
      { $set: newData});
  
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  




  const csv = require('fast-csv');
  const fs = require('fs');

  const storage2 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});



const upload2 = multer({ storage: storage2 });



app.post("/api/take_csv_form", upload2.array("files"), (req, res) => {
  res.json({ message: "File(s) uploaded successfully" });
  const email = req.body.email;
  const date = req.body.date;
  
  console.log(email);
  let a = req.files;
  let b = a[0]['path'];
  let pathh = '';

  for (let i = 0; i < b.length; i++) {
    if (b[i] == '\\') {
      pathh = pathh + '/';
    } else {
      pathh = pathh + b[i];
    }
  }

  var stream = fs.createReadStream(pathh);

  csv.parseStream(stream, { headers: true }).on("data", function (data) {
    var Result = {
      'product_name': data['product_name'],
      'product_img': data['product_img'],
      'product_mrp': data['product_mrp'],
      'product_selling_price': data['product_selling_price'],
      'quantity': data['quantity'],
      'offer': data['offer'],
      'deliveryCharges': data['deliveryCharges'],
      'product_type': data['product_type'],
      'discription': data['discription'],

    };
    const dbobj = mongoose.connection;

    dbobj.collection('products')
    .insertOne({ ...Result, email: email ,date:date,selected:'0'})
    .then((result) => {
      // console.log("CSV Data Successfully Inserted into Sales Agent Product Data Database.");
    })
    .catch((err) => {
      console.log(err);
    });

  }).on("end", function () {
    console.log("CSV Parsing Completed");
  });
});




app.post("/api/reviewsdata", async (req, res) => {
  try {
    const newdata = req.body;
    const dbobj = mongoose.connection;
    await dbobj.collection('productReviews').insertOne(newdata);
    res.status(200).json({ message: "feedback added to cart successfully" });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get("/api/fetchreview", async (req, res) => {
  try {
      const dbobj = mongoose.connection;
      const reviewdata = await dbobj.collection('productReviews').find().toArray();
      // console.log(userData)
      res.status(200).json(reviewdata);
      
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});



app.post("/api/contactUs", async (req, res) => {
  try {
    const newdata = req.body;


    const mailOptions = {
      from: 'aorganic63@gmail.com',
      to: 'gsaikumarreddy2004@gmail.com',
      subject: 'Contact Us',
      html: `
        <div>
          <p>Hi sir,</p>
           <p style="margin-left: 10px;>${newdata.info}</p>
          
          
        </div>
        <p>Thank you</p>
        <p>${newdata.name}</p>
        <p>Email : ${newdata.email}<br />
      `,
    };

  
    await transporter.sendMail(mailOptions);
   
    res.status(200).json({ message: "You message send to admin" });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//! Error Middleware 
 app.use(errorHandler);
const port=5000;
mongoose.connect("mongodb+srv://admin:admin@cluster0.xqw3dcj.mongodb.net/ArgoOrgan").then(()=>{
    app.listen(port,()=>{
        console.log(`server is running on ${port}`);
    })
}).catch((err)=>console.log(err))

