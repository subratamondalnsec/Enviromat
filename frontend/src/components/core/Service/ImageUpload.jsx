// components/service/ImageUpload.jsx
import React, { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Upload, X, Camera, Tag } from "lucide-react";
import gsap from "gsap";

const ImageUpload = ({ images, onImagesChange }) => {
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  // Waste categories with credit points
  const wasteCategories = {
    plastic: {
      name: "Plastic",
      color: "bg-green-100 text-green-800",
      credits: 5,
    },
    paper: { name: "Paper", color: "bg-blue-100 text-blue-800", credits: 3 },
    metal: { name: "Metal", color: "bg-gray-100 text-gray-800", credits: 8 },
    organic: {
      name: "Organic",
      color: "bg-yellow-100 text-yellow-800",
      credits: 2,
    },
    glass: {
      name: "Glass",
      color: "bg-purple-100 text-purple-800",
      credits: 4,
    },
    electronic: {
      name: "E-Waste",
      color: "bg-red-100 text-red-800",
      credits: 12,
    },
  };

  // Auto-detect category (simulate ML model)
  const detectCategory = () => {
    const categories = Object.keys(wasteCategories);
    return categories[Math.floor(Math.random() * categories.length)];
  };

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const newImages = [];

    // Process files sequentially to avoid async issues
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        try {
          const preview = await createPreview(file);
          const category = detectCategory();

          const newImage = {
            id: `${Date.now()}-${i}`,
            file,
            preview,
            category,
            credits: wasteCategories[category]?.credits || 5,
            name: file.name,
          };

          newImages.push(newImage);
        } catch (error) {
          console.error("Error processing file:", file.name, error);
        }
      }
    }

    // Update parent component with ALL images (existing + new)
    onImagesChange([...images, ...newImages]);

    // Reset input
    e.target.value = "";
  };

  const createPreview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter((img) => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  const changeCategoryManually = (imageId, newCategory) => {
    const updatedImages = images.map((img) =>
      img.id === imageId
        ? {
            ...img,
            category: newCategory,
            credits: wasteCategories[newCategory].credits,
          }
        : img
    );
    onImagesChange(updatedImages);
  };

  const handleChooseImagesClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div ref={containerRef} className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Camera className="w-6 h-6 mr-3 text-green-500" />
        Upload Waste Images
      </h2>


      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drag and Drop Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-400 transition-all duration-300 mb-6"
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          const mockEvent = { target: { files, value: "" } };
          handleFileSelect(mockEvent);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center justify-center gap-2 p-6">
          <div className="text-center mb-2">
            <motion.button
              type="button"
              onClick={handleChooseImagesClick}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#0ae979] backdrop-blur-xl px-6 py-3 border border-[#08DF73] rounded-full text-sm font-medium text-gray-600 hover:bg-[#eff8d8] transition-colors transform-gpu shadow-lg flex items-center space-x-2 mx-auto"
            >
              <Upload className="w-5 h-5" />
              <span className=" text-lg">Choose Images</span>
            </motion.button>
          </div>
          <p className="text-gray-500 text-sm w-[65%] mb-2 text-center">
          Select multiple images at once (JPG, PNG, GIF up to 10MB each)
           Or drag and drop images here
          </p>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-purple-500" />
            Uploaded Images ({images.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Image Preview */}
                <div className="relative mb-3">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Image Info */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.name}
                  </p>

                  {/* Category Selector */}
                  <select
                    value={image.category}
                    onChange={(e) =>
                      changeCategoryManually(image.id, e.target.value)
                    }
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {Object.entries(wasteCategories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* Category Badge & Credits */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        wasteCategories[image.category].color
                      }`}
                    >
                      {wasteCategories[image.category].name}
                    </span>
                    <span className="text-green-600 font-bold text-sm">
                      +{image.credits} credits
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
