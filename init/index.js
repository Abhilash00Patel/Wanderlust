const mongoose = require("mongoose")
const Listing = require("../models/lisiting");
let initData = require("./data.js")
const User = require("../models/user"); // Ensure this is required
let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
async function main() {
  await mongoose.connect(MONGO_URL);
}
main().then((res)=>{
    console.log("database connected")
}).catch(err => console.log(err));



let insertDb = async()=>{
    let del = await Listing.deleteMany({})
    console.log(del)
    console.log(initData.data)
    initData.data = initData.data.map((obj)=> ({...obj, owner: "6709bd99ef19b276ced273a3"}))
    let insert = await Listing.insertMany(initData.data)
    console.log(insert)
}

insertDb();