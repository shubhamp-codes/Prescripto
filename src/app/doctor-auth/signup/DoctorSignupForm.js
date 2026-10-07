"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stethoscope, UploadCloud } from "lucide-react";

export default function DoctorSignupForm({ specialities }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    // We will replace these with actual env variables later
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo"; 
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "demo_preset";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  async function handleDoctorSignup(e) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    let imageUrl = null;
    if (imageFile) {
      setUploadingImage(true);
      imageUrl = await uploadToCloudinary(imageFile);
      setUploadingImage(false);
      if (!imageUrl) {
        setErrorMessage("Failed to upload profile picture. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      userType: "doctor",
      name: formData.get("name"),
      email: formData.get("email"),
      password: password,
      phone: formData.get("phone"),
      speciality: formData.get("speciality"),
      qualification: formData.get("qualification"),
      experience: formData.get("experience"),
      fee: formData.get("fee"),
      state: formData.get("state"),
      city: formData.get("city"),
      address: formData.get("address"),
      about: formData.get("about"),
      image: imageUrl,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/doctor-auth/login?registered=true");
      } else {
        const data = await res.json();
        setErrorMessage(data.message || "Failed to register.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="bg-white w-full max-w-3xl p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2 mb-4 border border-blue-200">
            <Stethoscope className="w-4 h-4" />
            Doctor Portal
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Join Prescripto</h2>
          <p className="text-gray-500">Apply to become a verified doctor on our platform.</p>
        </div>

        <form onSubmit={handleDoctorSignup} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="sm:col-span-2 flex flex-col items-center justify-center mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center w-full">Profile Picture</label>
                <div className="relative group cursor-pointer">
                  <div className={`w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${imagePreview ? 'border-blue-400' : 'border-gray-300 hover:border-blue-500 bg-gray-50'}`}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
                <p className="text-xs text-gray-400 mt-2">Click to upload photo (Optional)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input type="text" name="name" required placeholder="Dr. John Doe" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                <input type="email" name="email" required placeholder="john@hospital.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <input type="password" name="password" required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                <input type="password" name="confirmPassword" required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                <input type="tel" name="phone" required placeholder="+91 9876543210" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Professional Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Speciality *</label>
                <select name="speciality" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white">
                  <option value="">Select Speciality</option>
                  {specialities.map(s => (
                    <option key={s.specialityId} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Consultation Fee (₹) *</label>
                <input type="number" name="fee" required placeholder="500" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Qualifications *</label>
                <input type="text" name="qualification" required placeholder="MBBS, MD" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience (Years) *</label>
                <input type="number" name="experience" required placeholder="10" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">About (Short Bio)</label>
                <textarea name="about" rows="3" placeholder="Briefly describe your expertise..." className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Section 3: Clinic / Hospital Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Clinic Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                <input type="text" name="state" required placeholder="Maharashtra" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                <input type="text" name="city" required placeholder="Mumbai" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Complete Address *</label>
                <input type="text" name="address" required placeholder="123 Health Ave, Clinic 4B" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <span className="text-red-600 text-sm font-medium">{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-4 rounded-xl font-bold text-lg shadow-md transition-all mt-4 
              ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"}`}
          >
            {uploadingImage ? "Uploading Photo..." : isSubmitting ? "Submitting Application..." : "Apply for Doctor Account"}
          </button>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have a doctor account?{" "}
            <Link href="/doctor-auth/login" className="text-blue-600 font-bold hover:underline">
              Log in here
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
