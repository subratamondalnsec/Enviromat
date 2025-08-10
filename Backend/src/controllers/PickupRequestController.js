const PickupRequest = require('../models/PickupRequestModel');
const {uploadImageToCloudinary}=require('../utils/imageUploader');
const Picker =require("../models/Picker");
const{findNearestPicker}=require("../utils/fatchusingAI")

exports.uploadWaste = async (req, res) => {
  try {
    const { wasteType, quantity, address, lat, lng, image } = req.body;

    // If using file upload, uncomment and integrate
    // const file = req.files?.image;
    // const result = file ? await uploadImageToCloudinary(file, process.env.CLOUDINARY_FOLDER) : null;

    const waste = new PickupRequest({
      userId: req.user.id,
      wasteType,
      imageURL: image, // or result?.secure_url
      quantity,
      location: { lat, lng },
      address
    });

    // 1️⃣ Get up to 10 pickers based on city or state
    let pickers = await Picker.find({ "address.city": address.city }).limit(10);

    if (pickers.length === 0) {
      pickers = await Picker.find({ "address.state": address.state }).limit(10);
    }

    // No pickers found at all → just save request
    if (pickers.length === 0) {
      await waste.save();
      console.log("No pickers found. Request saved without assignment.");
      return res.status(201).json({ pickerAssign: false, message: "Waste uploaded successfully.", waste });
    }

    // 2️⃣ Find nearest picker using Gemini
    const nearestPicker = await findNearestPicker(pickers, {
      lat,
      lng,
      address
    });
    console.log(" nearest picker - ",nearestPicker)

    // If Gemini couldn't decide → save without assigning
    if (!nearestPicker) {
      await waste.save();
      console.log("Gemini couldn't determine nearest picker. Request saved without assignment.");
      return res.status(201).json({ pickerAssign: false, message: "Waste uploaded successfully.", waste });
    }

    // 3️⃣ Assign the nearest picker
    waste.pickupBy = nearestPicker._id;
    waste.pickupStatus = "assigned";

    const saveWaste = await waste.save();

    await Picker.findByIdAndUpdate(
      nearestPicker._id,
      { $push: { assignedPickups: saveWaste._id } },
      { new: true }
    );

    res.status(201).json({
      pickerAssign: true,
      message: "Waste uploaded successfully. Picker assigned based on shortest distance.",
      waste,
      nearestPicker
    });

  } catch (err) {
    console.log("Error in waste upload", err);
    res.status(500).json({ error: "Server error." });
  }
};