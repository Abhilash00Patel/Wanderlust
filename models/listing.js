const mongoose = require('mongoose');
const Review = require('./review');
const {Schema} = mongoose



// let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
// async function main() {
//   await mongoose.connect(MONGO_URL);
// }
// main().then((res)=>{
// }).catch(err => console.log(err));


  

const listingSchema = Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            // required: true,
        },
        image: {
           url: String,
           filename:String,
        },
        price: {
            type: Number,
            // required: true
        },
        location: {
            type: String,
           required: true  
        },
        country: {
            type: String,
            required: true
        },
        reviews : [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            }
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
              },
              coordinates: {
                type: [Number],
                required: true
              }
        }
    }
)

listingSchema.post("findOneAndDelete", async(listing)=>{
     if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
     }
})
const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing;