const express    = require("express");
const mongoose   = require("mongoose");
const bodyParser = require("body-parser");
const app        = express();

const dburl = "mongodb+srv://dbuser:I9QcJWvfMiCFEs6m@cluster0.nfciawg.mongodb.net/?retryWrites=true&w=majority";
const connetParameters = {
                            useNewUrlParser:true,
                            useUnifiedTopology:true
                        }

mongoose.connect(dburl,connetParameters).then(()=>{
    console.log("connected with database")
}).catch((err)=>{
    console.log(err)
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());

const productSchema = new mongoose.Schema({
    name:String,
    discription:String,
    price:Number,
}
);
//create products
const Product = new mongoose.model("Product",productSchema);

app.post("/api/v1/addProduct",async(req,res)=>{
    const product = await Product.create(req.body);
    res.status(200).json({
        success:true,
        product
    })
})
//read products
app.get("/api/v1/products",async(req,res)=>{
    const productList = await Product.find();
    res.status(200).json({
        success:true,
        productList
    })

})
//update product
app.put("/api/v1/products/:id",async(req,res)=>{
    const productId = req.params.id;
    let product = await Product.findById(productId);
    if(!product){
        res.status(500).json({
            success:false,
            message:"product is not found"
        })
    }

    product = await Product.findByIdAndUpdate(productId,req.body,{new:true,
        usefindAndModify:true,runValidators:true})

    res.status(200).json({
        success:true,
        product
    })
})

//product delete
app.delete("/api/v1/products/:id", async(req,res)=>{
    const pid = req.params.id;
    let product = await Product.findById(pid);
    if(!product){
        res.status(500).json({
            success:false,
            message:"product is not found"
        })
    }

    await product.remove(pid);

    res.status(200).json({
        success:true,
        message:"your product is deleted"
    })

})

app.listen(4000,"localhost",()=>{
    console.log('server start')
})

