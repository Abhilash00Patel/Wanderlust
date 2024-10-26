const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });


module.exports.index = async(req,res)=>{
    let allListings = await Listing.find()
    res.render("listings/index.ejs", {allListings})
};

module.exports.createListing =  (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.postListing = async(req,res,next)=>{
   let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
     .send()
     console.log(response.body.features[0].geometry)
  
    let url = req.file.path
    let filename = req.file.filename
        const newListing =  new Listing(req.body.listing)
        newListing.owner = req.user._id
        newListing.image = {url, filename}
        newListing.geometry = response.body.features[0].geometry
        console.log(newListing)
       await newListing.save()
       req.flash("success", "new Listing Created!")
       res.redirect("/listings") 
};


module.exports.showListing = async(req,res)=>{

    let {id} = req.params
    let listing =await Listing.findById(id).populate({path: "reviews" , populate:{path:"author"}}).populate("owner")
    if(!listing){
        req.flash("error", "Listing Does not exist!")
        res.redirect("/listings")
    }
        res.render("listings/show.ejs" , {listing})
}

module.exports.editForm = async(req,res)=>{
    let {id} = req.params 
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "Listing Does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs" , {listing})
}


module.exports.updateListing =  async(req,res)=>{
    
    let {id} = req.params
    let listing = await  Listing.findByIdAndUpdate(id,{...req.body.listing})
 
   if(typeof req.file !== "undefined"){
    let url = req.file.path
    let filename = req.file.filename
    listing.image = {url,filename}
        await listing.save()
   }
   req.flash("success" , "Listing Edited!")
   res.redirect(`/listings/${id}`)

}

module.exports.destroyListing =  async(req,res)=>{
    let {id} = req.params ;
     await Listing.findByIdAndDelete(id)
     req.flash("success", "Listing Deleted!")
     res.redirect("/listings")
}