const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.new = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  // Add a console.log here to inspect the listing object before rendering
  console.log("Listing object in show route:", listing);
  console.log(
    "Listing geometry coordinates in show route:",
    listing.geometry.coordinates
  );

  const isOwner =
    res.locals.currUser && listing.owner._id.equals(res.locals.currUser._id);

  res.render("listings/show.ejs", { listing, isOwner });
};
module.exports.create = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry; // <--- This line is critical
  // If you want to store location too:

  let savedListing = await newListing.save();
  console.log(savedListing); // This log will show the saved listing, including geometry
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you req. doesn't exist!");
    return res.redirect("/listings");
  }
  let ogUrl = listing.image.url;
  ogUrl = ogUrl.replace("/upload", "/upload/w_100");
  res.render("listings/edit.ejs", { listing, ogUrl });
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}`);
  }

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save(); // Save image info separately
  }

  await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true }
  );

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let deletedL = await Listing.findByIdAndDelete(id);
  console.log(deletedL);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
