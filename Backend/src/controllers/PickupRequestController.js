const PickupRequest = require('../models/PickupRequestModel');
const {uploadImageToCloudinary}=require('../utils/imageUploader');
const Picker =require("../models/Picker");

exports.uploadWaste= async (req, res) => {
        try {
            const { wasteType, quantity, address } = req.body;
            
            const result=null;
            // const file = req.files.image; // Assuming you're using express-fileupload
            // result = await uploadImageToCloudinary(file,process.env.CLOUDINARY_FOLDER);

            // if (!result || !result.secure_url) {
            //     return res.status(400).json({ error: 'Image upload failed.' });
            // }

            const waste = new PickupRequest({
                userId: req.user.id,
                wasteType,
                imageURL:result? result.secure_url: req.body.image,
                quantity,
                location: {
                    lat: req.body.lat,
                    lng: req.body.lng,
                },
                address:address,
            });

            let filterPicker = await Picker.findOne({ "address.city": address.city });
            if (!filterPicker) {
            filterPicker = await Picker.findOne({ "address.state": address.state });
            }
            // console.log(filterPicker);

            if(!filterPicker){
                await waste.save();
                console.log(" only save request not assigne.")
                return res.status(201).json({pickerAssign:false, message: 'Waste uploaded successfully.', waste });
            }

            waste.pickupBy=filterPicker._id;
            waste.pickupStatus="assigned";

            const saveWaste=await waste.save();

            filterPicker=await Picker.findByIdAndUpdate(
                filterPicker._id,
                { $push: { assignedPickups: saveWaste._id }},{new:true}
            );

            console.log(filterPicker,saveWaste);

            res.status(201).json({pickerAssign:true, message: 'Waste uploaded successfully. Also Picker Assigned ', waste,filterPicker});
        } catch (err) {
            console.log("Error in waste upload", err);
            res.status(500).json({ error: 'Server error.' });
        }
    }