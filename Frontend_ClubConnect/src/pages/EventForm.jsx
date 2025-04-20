import React, { useState } from "react";
import axios from "axios";

const EventForm = () => {
  const [like, setLike] = useState(0); // Note: 'like' state seems unused; consider removing or using it
  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    venue: "",
    date: "",
    time: "",
    isFree: true,
    price: 0,
    description: "",
    clubName: "",
    performer: "",
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    images.forEach((image) => {
      submitData.append("images", image);
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/events/create`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ text: "Event created successfully!", type: "success" });

      setFormData({
        name: "",
        institution: "",
        venue: "",
        date: "",
        time: "",
        isFree: true,
        price: 0,
        description: "",
        clubName: "",
        performer: "",
      });
      setImages([]);
      setPreviewImages([]);
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to create event. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "isFree") {
      setFormData({
        ...formData,
        [name]: checked,
        price: checked ? 0 : formData.price,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      if (selectedFiles.length > 3) {
        setMessage({ text: "You can only upload up to 3 images", type: "error" });
        return;
      }

      setImages(selectedFiles);

      const imagePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages(imagePreviews);

      setMessage({ text: "", type: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Create New Event</h2>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded-lg text-white ${
              message.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter event name"
                required
              />
            </div>

            {/* Club Name */}
            <div>
              <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-2">
                Club Name *
              </label>
              <input
                type="text"
                id="clubName"
                name="clubName"
                value={formData.clubName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter club name"
                required
              />
            </div>

            {/* Performer Name */}
            <div>
              <label htmlFor="performer" className="block text-sm font-medium text-gray-700 mb-2">
                Performer Name (Optional)
              </label>
              <input
                type="text"
                id="performer"
                name="performer"
                value={formData.performer}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter performer name"
              />
            </div>

            {/* Institution */}
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                Institution *
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter institution name"
                required
              />
            </div>

            {/* Venue */}
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter venue"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time (HH:MM) *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
            </div>

            {/* Price Options */}
            <div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="isFree"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700">
                  This is a free event
                </label>
              </div>
              {!formData.isFree && (
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (in ₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Enter price"
                    required
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter event description"
                maxLength={500}
              ></textarea>
              <p className="text-right text-xs text-gray-500 mt-1">0/500 characters</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Images * (Max 3)</label>
              <div className="mt-4 flex justify-center px-6 pt-6 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-2 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload files</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={() => {
                          setPreviewImages(previewImages.filter((_, i) => i !== index));
                          setImages(images.filter((_, i) => i !== index));
                        }}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Creating Event..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;