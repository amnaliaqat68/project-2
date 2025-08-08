"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AddDoctorForm() {
  const [form, setForm] = useState({
    name: "",
    speciality: "",
    district: "",
    address: "",
    brick: "",
    group: "",
    zone: "",
    qualification: "",
    designation: "",
    status: "active",
    relationship: "strong",
    email: "",
    contact: "",
    totalValue: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Doctor Submitted:", form);

    try {
      const response = await axios.post("/api/doctorsManage/doctors", form);
      console.log("Response:", response.data);
      console.log("Payload Sent to Backend:", JSON.stringify(form, null, 2));
      toast.success("Doctor submitted successfully!");
      setForm({
        name: "",
        speciality: "",
        district: "",
        address: "",
        brick: "",
        group: "",
        zone: "",
        qualification: "",
        designation: "",
        status: "active",
        relationship: "strong",
        email: "",
        contact: "",
        totalValue: "",
      });
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error submitting doctor:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">
          Add New Doctor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Doctor Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Dr. Ahmad Khan"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Speciality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speciality
            </label>
            <input
              type="text"
              name="speciality"
              value={form.speciality}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <input
              type="text"
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="e.g. Lahore"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Adress/clinic Adress
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Full Adress..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group
            </label>
            <select
              name="group"
              id="group"
              value={form.group}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md  focus:ring-1 focus:ring-blue-200 focus:outline-none"
            >
              <option value="">Select Group</option>
              <option value="venus">Venus</option>
              <option value="dynamic">Dynamic</option>
              <option value="jupiter">Jupiter</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brick
            </label>
            <input
              type="text"
              name="brick"
              value={form.brick}
              onChange={handleChange}
              placeholder="brick..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zone
            </label>
            <input
              type="text"
              name="zone"
              value={form.zone}
              onChange={handleChange}
              placeholder="zone..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <select
              name="relationship"
              value={form.relationship}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            >
              <option value="strong">Strong</option>
              <option value="moderate">moderate</option>
              <option value="new">New</option>
            </select>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="e.g. 03001234567"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. 03001234567"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

      
         

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 w-full text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
