const Picker = require("../models/Picker");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Get picker profile
exports.getPickerProfile = async (req, res) => {
  try {
    const pickerId = req.params.id;
    
    // Find picker by ID
    const picker = await Picker.findById(pickerId).select("-password");
    
    if (!picker) {
      return res.status(404).json({
        success: false,
        message: "Picker not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Picker profile fetched successfully",
      picker: picker,
    });
  } catch (error) {
    console.error("GET_PICKER_PROFILE_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update picker profile
exports.updatePickerProfile = async (req, res) => {
  try {
    const pickerId = req.params.id;
    const { 
      firstName, 
      lastName, 
      email, 
      contactNumber, 
      address,
      vehicleDetails,
      serviceAreas,
      isActive 
    } = req.body;

    // Find picker by ID
    const picker = await Picker.findById(pickerId);
    
    if (!picker) {
      return res.status(404).json({
        success: false,
        message: "Picker not found",
      });
    }
    console.log("PICKER_TO_UPDATE:", picker);
    // Update picker fields
    if (firstName !== undefined) picker.firstName = firstName;
    if (lastName !== undefined) picker.lastName = lastName;
    if (email !== undefined) picker.email = email;
    if (contactNumber !== undefined) picker.contactNumber = contactNumber;
    if (address !== undefined) picker.address = address;
    if (vehicleDetails !== undefined) picker.vehicleDetails = vehicleDetails;
    if (serviceAreas !== undefined) picker.serviceAreas = serviceAreas;
    if (isActive !== undefined) picker.isActive = isActive;

    // Handle image upload if provided
    if (req.files && req.files.profileImage) {
      const image = req.files.profileImage;
      
      try {
        const uploadedImage = await uploadImageToCloudinary(
          image,
          process.env.FOLDER_NAME,
          1000,
          90
        );
        picker.image = uploadedImage.secure_url;
      } catch (uploadError) {
        console.error("IMAGE_UPLOAD_ERROR:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload profile image",
        });
      }
    }

    // Save updated picker
    const updatedPicker = await picker.save();
    
    // Remove password from response
    updatedPicker.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Picker profile updated successfully",
      picker: updatedPicker,
    });
  } catch (error) {
    console.error("UPDATE_PICKER_PROFILE_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
