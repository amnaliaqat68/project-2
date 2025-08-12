"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Select from "react-select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CSRForm({ doctorId }) {
  const [isClearable, setIsClearable] = useState(true);
  const [doctorList, setDoctorList] = useState([]);
  const [isSearchable, setIsSearchable] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [formData, setFormData] = useState({
    doctorId: doctorId || "",
    filledBy: "",
    groupOfFE: "",
    drName: "",
    drDesignation: "",
    qualification: "",
    speciality: "",
    location: "",
    address: "",
    group: "",
    zone: "",
    contact: "",
    patientsMorning: 0,
    patientsEvening: 0,
    customerType: "New",
    brick: "",
    products: [
      {
        product: "",
        strength: "",
        presentUnits: "",
        expectedUnits: "",
        additionUnits: "",
      },
    ],
    Business: [
      {
        businessValuePresent: 0,
        businessValueExpected: 0,
        businessValueAddition: 0,
        businessPeriod: "",
        expectedTotalBusiness: "",
        roi: "",
        exactCost: "",
        requiredDate: "",
        itemRequested: "",
        byHo: "",
        investmentLastYear: "",
        activity: "",
        activityValue: "",
        activityMonth: "",
      },
    ],
    chemists: [
      {
        chemistName: "",
        businessShare: "",
        otherDoctors: "",
      },
    ],
    investmentInstructions: "",
    comments: "",
    ledgerSummary: [
      {
        month: "",
        sale: "",
      },
    ],
  });
  const router = useRouter();

  const productsList = [
    "IB-Nic Tab",
    "IB-Nic Inj",
    "MOBICAL",
    "D-UP 2000000 IU",
    "XIBMED TAB",
    "ACTFREE TAB",
    "WISEBACT IG",
    "WISEBACT 2G",
    "WISEM IG INJ",
    "AMISAVE INJ",
    "DIGYMINT",
    "G-LIV",
    "U-TOP TAB",
    "SARIX ",
    "UNIMYCIN",
    "ETHIX",
    "LAKILL TAB",
    "RHYTHM SYP",
    "ACHFREE GEL",
    "SPATEC TAB 30's",
    "KENAC TAB 20's",
    "COPSID TAB 10s",
    "LINZRAO TAB",
    "LINZRAO IV",
    "VILINE-MET",
    "ROSUWIM",
    "UUNIPANTO CAP",
    "UNIVAM 5/80",
    "UNIVAM 5/160",
    "UNIIVAM 10/160",
    "D-IN",
    "HEXEL-M",
    "MEFO PLUS SACHET",
    "AQATE TAB",
    "MOBICAL TAB 20's",
    "MOBICAL SACHET",
    "MAXIRON",
    "NEUROFOL TAB",
    "MEGAFOL TAB",
    "ACEVIT TAB 20'S",
    "UBI CARE TAB 30's",
    "SWELTIN TAB",
    "SHEFRESH",
    "UCIT TAB",
    "UNIMYCIN",
    "PROCUB SACHET",
    "MOBICAL SYP",
    "ACEVIT SYP",
    "LINZRAO SUSPENSION",
    "LINZRAO IV",
    "RIDGE-D DROP",
    "G-COLIC DROPS",
    "HB-PLUS SYP",
    "RHYTHM SYP",
    "MAISAVE INJ",
    "WISEM INJ",
    "TOSS OFF",
  ];
  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          product: "",
          strength: "",
          presentUnits: "",
          expectedUnits: "",
          additionUnits: "",
        },
      ],
    }));
  };
  const handleBusinessChange = (index, name, value) => {
    const updated = [...formData.Business];
    updated[index][name] = value;
    setFormData((prev) => ({ ...prev, Business: updated }));
  };

  const removeProduct = (index) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const addChemist = () => {
    setFormData((prev) => ({
      ...prev,
      chemists: [
        ...prev.chemists,
        {
          chemistName: "",
          businessShare: "",
          otherDoctors: "",
        },
      ],
    }));
  };

  const removeChemist = (index) => {
    setFormData((prev) => ({
      ...prev,
      chemists: prev.chemists.filter((_, i) => i !== index),
    }));
  };

  const addLedgerRow = () => {
    setFormData((prev) => ({
      ...prev,
      ledgerSummary: [...prev.ledgerSummary, { month: "", sale: "" }],
    }));
  };

  const removeLedger = (index) => {
    setFormData((prev) => ({
      ...prev,
      ledgerSummary: prev.ledgerSummary.filter((_, i) => i !== index),
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...formData.products];
    updated[index][field] = value;
    setFormData({ ...formData, products: updated });
  };

  const handleUpload = async (selectedFile) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "Saas_preset");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/det4apayu/auto/upload",
        formData
      );
      setUploadedUrl(response.data.secure_url);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      ...(uploadedUrl && { filePath: uploadedUrl }),
    };

    console.log("Submitting Payload:", payload);

    try {
      const res = await fetch("/api/csrInfo/CSR", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (res.ok) {
        toast.success("CSR submitted successfully!");
        resetForm();
        router.push("/SMuser/dashboard");
      } else {
        toast.error(`Error submitting CSR: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error("Failed to submit form");
    }
  };

  const handleInputChange = (
    e,
    index = null,
    field = null,
    subField = null
  ) => {
    const { name, value, type, checked } = e.target;
    if (index !== null && field) {
      const updatedArray = [...formData[field]];
      updatedArray[index] = { ...updatedArray[index], [subField]: value };
      setFormData({ ...formData, [field]: updatedArray });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      filledBy: "",
      groupOfFE: "",
      doctorId: "",
      drName: "",
      drDesignation: "",
      qualification: "",
      speciality: "",
      location: "",
      address: "",
      brick: "",
      group: "",
      zone: "",
      contact: "",
      patientsMorning: "",
      patientsEvening: "",
      customerType: "New",
      brickName: "",
      products: [
        {
          product: "",
          strength: "",
          presentUnits: "",
          expectedUnits: "",
          additionUnits: "",
        },
      ],
      businessValuePresent: 0,
      businessValueExpected: 0,
      businessValueAddition: 0,
      businessPeriod: "",
      expectedTotalBusiness: "",
      roi: "",
      exactCost: "",
      requiredDate: "",
      itemRequested: "",
      byHo: "",
      investmentLastYear: "",

      chemists: [
        {
          chemistName: "",
          businessShare: "",
          otherDoctors: "",
        },
      ],
      investmentInstructions: "",
      comments: "",
      ledgerSummary: [
        {
          month: "",
          sale: "",
        },
      ],
    });
    setFile(null);
    setUploadedUrl("");
  };

  // ✅ Fetch Doctors on Load
  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await fetch("/api/doctorsManage/getDoctors");
      const data = await res.json();
      console.log("Fetched doctor data:", data);
      const formatted = data.map((doc) => ({
        value: doc._id,
        label: doc.name,
        designation: doc.designation,
        qualification: doc.qualification,
        speciality: doc.speciality,
        address: doc.address,
        contact: doc.contact,
        group: doc.group,
        brick: doc.brick,
        investmentLastYear: doc.investmentLastYear,
      }));
      setDoctorList(formatted);
    };
    fetchDoctors();
  }, []);

  // ✅ File Upload Input
  const fileUploadSection = (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Attach Sales Report
      </label>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
        onChange={(e) => {
          const selectedFile = e.target.files[0];
          if (!selectedFile) return;
          setFile(selectedFile);
          handleUpload(selectedFile);
        }}
        className="border-2 w-2xl h-3 rounded p-2 border-black"
      />

      {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}

      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-green-600">✅ File Uploaded:</p>
          {file && file.type.startsWith("image/") ? (
            <img
              src={uploadedUrl}
              alt="Uploaded"
              width="200"
              className="mt-2 border"
            />
          ) : (
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mt-2 block"
            >
              View Uploaded File
            </a>
          )}
        </div>
      )}
    </div>
  );
  return (
    <div className="bg-gray-100 min-h-screen py-2">
      <Head>
        <title>CSR Performa Form</title>
      </Head>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto p-5 space-y-4 bg-white shadow-2xl rounded-2xl border border-gray-200"
      >
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            CSR Performa Form
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Fill out the form carefully. All sections are required.
          </p>
        </div>
        <section className="w-full flex space-x-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
              SMIO/FE
            </label>
            <input
              type="text"
              name="filledBy"
              placeholder="name of CSR User"
              className="w-[540px] px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
              value={formData.filledBy}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
              Group of SMIO/FE
            </label>
            <select
              name="groupOfFE"
              id="groupOfFE"
              value={formData.groupOfFE}
              onChange={handleInputChange}
              required
              className="w-[540px] px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
            >
              <option value="">Select a group</option>
              <option value="corporate">Corporate</option>
              <option value="jupiter">Jupiter</option>
              <option value="venus">Venus</option>
              <option value="dynamic">Dynamic</option>
            </select>
          </div>
        </section>

        {/* Doctor Details */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-2 sm:p-4 border border-gray-200 print:bg-white print:shadow-none print:p-0 print:border-none">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 border-b pb-2">
            Doctor Details
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6 print:grid-cols-1">
            {/* Doctor Dropdown */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
                Doctor Name
              </label>
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Search or select a doctor..."
                isClearable
                isSearchable
                options={doctorList}
                onChange={(selectedDoctor) => {
                  if (selectedDoctor) {
                    setFormData((prev) => ({
                      ...prev,
                      doctorId: selectedDoctor.value,
                      drName: selectedDoctor.label,
                      drDesignation: selectedDoctor.designation,
                      qualification: selectedDoctor.qualification,
                      speciality: selectedDoctor.speciality,
                      address: selectedDoctor.address,
                      contact: selectedDoctor.contact,
                      brick: selectedDoctor.brick,
                      group: selectedDoctor.group,
                      zone: selectedDoctor.zone,
                      location: selectedDoctor.location,
                      investmentLastYear: selectedDoctor.investmentLastYear,
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      doctorId: "",
                      drName: "",
                      drDesignation: "",
                      qualification: "",
                      speciality: "",
                      address: "",
                      contact: "",
                      brick: "",
                      zone: "",
                      group: "",
                      location: "",
                      investmentLastYear: "",
                    }));
                  }
                }}
                value={
                  doctorList.find((doc) => doc.label === formData.drName) ||
                  null
                }
              />
            </div>

            {/* Fields BELOW Doctor Dropdown */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
                  Designation
                </label>
                <input
                  type="text"
                  name="drDesignation"
                  value={formData.drDesignation}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                  placeholder="Enter designation"
                />
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                  placeholder="Enter qualification"
                />
              </div>

              {/* Speciality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
                  Speciality
                </label>
                <input
                  type="text"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                  placeholder="Enter speciality"
                />
              </div>
            </div>
            {/* Cell No */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
                  Cell No
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                  placeholder="0300xxxxxxx"
                />
              </div>

              {/* Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
                  Group
                </label>
                <input
                  type="text"
                  name="group"
                  value={formData.group}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                  placeholder="Enter group"
                />
              </div>

              {/* Brick Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
                  Brick Name
                </label>
                <input
                  type="text"
                  name="brick"
                  value={formData.brick}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                  placeholder="Enter brick name"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
                Full Address / Clinic Name / Hospital Name
              </label>
              <div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Clinic or Hospital Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
              {/* Patients Morning */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
                  Patients (Morning)
                </label>
                <input
                  type="number"
                  name="patientsMorning"
                  value={formData.patientsMorning}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                  placeholder="e.g., 30"
                />
              </div>

              {/* Patients Evening */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">
                  Patients (Evening)
                </label>
                <input
                  type="number"
                  name="patientsEvening"
                  value={formData.patientsEvening}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                  placeholder="e.g., 20"
                />
              </div>

              {/* Customer Checkboxes */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-1">
                <label className="flex items-center text-sm text-gray-700 space-x-2 print:text-black">
                  <input
                    type="radio"
                    name="customerType"
                    value="Existing"
                    checked={formData.customerType === "Existing"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span>Existing</span>
                </label>
                <label className="flex items-center text-sm text-gray-700 space-x-2 print:text-black">
                  <input
                    type="radio"
                    name="customerType"
                    value="New"
                    checked={formData.customerType === "New"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span>New</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Product Commitments */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-gray-200 print:bg-white print:shadow-none print:p-0 print:border-none">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2">
            Product Commitments
          </h3>

          <div className="overflow-x-auto print:overflow-visible">
            <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg print:border-black">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs print:bg-white print:border-b print:border-black">
                <tr>
                  {[
                    "#",
                    "Product",
                    "Strength",
                    "Present",
                    "Expected",
                    "Additional",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="border px-3 py-2 print:border-black"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formData.products.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 print:bg-white`}
                  >
                    <td className="border px-3 py-2 print:border-black">
                      {index + 1}
                    </td>
                    <td className="border px-3 py-2 print:border-black">
                      <select
                        value={item.product}
                        onChange={(e) =>
                          handleProductChange(index, "product", e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                        required
                      >
                        <option value="">Select Product</option>
                        {productsList.map((p, idx) => (
                          <option key={idx} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-3 py-2 print:border-black">
                      <select
                        value={item.strength}
                        onChange={(e) =>
                          handleProductChange(index, "strength", e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                        required
                      >
                        <option value="">Select Strength</option>
                        {[
                          "50mg",
                          "75mg",
                          "100mg",
                          "150mg",
                          "250mg",
                          "500mg",
                          "600mg",
                          "750mg",
                          "900mg",
                          "1050mg",
                          "600mcg",
                          "1000mcg",
                          "1g",
                          "2g",
                          "240ml",
                          "300ml",
                          "Custom",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-3 py-2 print:border-black">
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={item.presentUnits}
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            "presentUnits",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                        placeholder="0"
                        required
                      />
                    </td>
                    <td className="border px-3 py-2 print:border-black">
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={item.expectedUnits}
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            "expectedUnits",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                        placeholder="0"
                        required
                      />
                    </td>
                    <td className="border px-3 py-2 print:border-black">
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={item.additionUnits}
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            "additionUnits",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
                        placeholder="0"
                        required
                      />
                    </td>
                    <td className="border px-3 py-2 text-center print:border-black print:hidden">
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="text-red-500 hover:text-red-700 font-semibold transition"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <section>
            <div></div>
          </section>

          <div className="mt-4 flex justify-end print:hidden">
            <button
              type="button"
              onClick={addProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition mb-3"
            >
              + Add Product
            </button>
          </div>
          <div className="mb-6 print:mb-0">
            <h3 className="text-xl font-bold mb-4">Business Value</h3>
            <div className="w-full border border-gray-200 rounded-md overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-100 text-gray-600 text-sm font-semibold">
                <div className="p-2 border">Present</div>
                <div className="p-2 border">Expected</div>
                <div className="p-2 border">Addition</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-2 border">
                  <input
                    type="number"
                    name="businessValuePresent"
                    value={formData.Business?.[0]?.businessValuePresent || ""}
                    onChange={(e) =>
                      handleBusinessChange(
                        0,
                        "businessValuePresent",
                        e.target.value
                      )
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div className="p-2 border">
                  <input
                    type="number"
                    name="businessValueExpected"
                    value={formData.Business?.[0]?.businessValueExpected || ""}
                    onChange={(e) =>
                      handleBusinessChange(
                        0,
                        "businessValueExpected",
                        e.target.value
                      )
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div className="p-2 border">
                  <input
                    type="number"
                    name="businessValueAddition"
                    value={formData.Business?.[0]?.businessValueAddition || ""}
                    onChange={(e) =>
                      handleBusinessChange(
                        0,
                        "businessValueAddition",
                        e.target.value
                      )
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Details */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-gray-200 mt-6 print:bg-white print:shadow-none print:p-0 print:border-none">
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Bussiness Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Required Date", name: "requiredDate", type: "date" },
                { label: "Exact Cost", name: "exactCost" },
                { label: "CSR By HO", name: "byHo" },
                { label: "ROI %", name: "roi" },
                {
                  label: "Expected Total Business (Value)",
                  name: "expectedTotalBusiness",
                },

                { label: "Business Period (Months)", name: "businessPeriod" },

                {
                  label: "Investment Last 12 Months",
                  name: "investmentLastYear",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData.Business?.[0]?.[field.name] || ""}
                    onChange={(e) =>
                      handleBusinessChange(0, field.name, e.target.value)
                    }
                    className="input border"
                  />
                </div>
              ))}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Item Requested (Complete Specifications)
                </label>
                <textarea
                  name="itemRequested"
                  value={formData.Business?.[0]?.itemRequested || ""}
                  onChange={(e) =>
                    handleBusinessChange(0, "itemRequested", e.target.value)
                  }
                  rows={3}
                  className="input border w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Chemist Table */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg rounded-xl p-4 sm:p-6 border border-gray-200 print:bg-white print:shadow-none print:p-0 print:border-none">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Chemist Monitoring the Business
          </h3>

          <div className="overflow-x-auto rounded-lg border border-gray-200 print:overflow-visible print:border-black">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs print:bg-white print:border-b print:border-black">
                <tr>
                  {[
                    "#",
                    "Chemist Name",
                    "Business Share (%)",
                    "Other Doctors",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 border text-left print:border-black"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formData.chemists.map((chemist, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors duration-200 print:bg-white`}
                  >
                    <td className="border px-4 py-2 print:border-black">
                      {index + 1}
                    </td>
                    <td className="border px-4 py-2 print:border-black">
                      <input
                        type="text"
                        value={chemist.chemistName}
                        onChange={(e) =>
                          handleInputChange(e, index, "chemists", "chemistName")
                        }
                        className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none print:border-gray-400"
                      />
                    </td>
                    <td className="border px-4 py-2 print:border-black">
                      <input
                        type="number"
                        value={chemist.businessShare}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            index,
                            "chemists",
                            "businessShare"
                          )
                        }
                        className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none print:border-gray-400"
                      />
                    </td>
                    <td className="border px-4 py-2 print:border-black">
                      <input
                        type="text"
                        value={chemist.otherDoctors}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            index,
                            "chemists",
                            "otherDoctors"
                          )
                        }
                        className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none print:border-gray-400"
                      />
                    </td>
                    <td className="border px-4 py-2 text-center print:hidden">
                      <button
                        type="button"
                        onClick={() => removeChemist(index)}
                        className="text-red-500 hover:text-red-700 font-semibold transition-colors duration-200"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end print:hidden">
            <button
              type="button"
              onClick={addChemist}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
            >
              + Add Chemist
            </button>
          </div>
        </section>

        {/* Additional Fields */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 print:grid-cols-1">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Instructions for Investment
            </label>
            <textarea
              name="investmentInstructions"
              value={formData.investmentInstructions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Any Comments
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
            />
          </div>
        </section>

        {/* Ledger Summary */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md rounded-lg p-4 sm:p-6 border border-gray-200 mt-6 print:bg-white print:shadow-none print:p-0 print:border-none">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 border-b pb-2">
            Ledger Summary
          </h3>
          <div className="overflow-x-auto print:overflow-visible">
            <table className="min-w-full text-sm border-collapse border border-gray-200 print:border-black">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs print:bg-white">
                <tr>
                  {["Month", "Customer's Sale", "Action"].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 border print:border-black"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formData.ledgerSummary.map((ledger, index) => (
                  <tr key={index} className="hover:bg-gray-50 print:bg-white">
                    <td className="border px-4 py-2 print:border-black">
                      <input
                        type="text"
                        value={ledger.month}
                        onChange={(e) =>
                          handleInputChange(e, index, "ledgerSummary", "month")
                        }
                        className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 print:border-gray-400"
                        placeholder={`Month ${index + 1}`}
                      />
                    </td>
                    <td className="border px-4 py-2 print:border-black">
                      <input
                        type="number"
                        value={ledger.sale}
                        onChange={(e) =>
                          handleInputChange(e, index, "ledgerSummary", "sale")
                        }
                        className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 print:border-gray-400"
                      />
                    </td>
                    <td className="border px-4 py-2 text-center print:hidden">
                      <button
                        type="button"
                        onClick={() => removeLedger(index)}
                        className="text-red-500 hover:text-red-700 font-semibold"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end print:hidden">
            <button
              type="button"
              onClick={addLedgerRow}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              + Add Row
            </button>
          </div>
        </section>

        {/* File Upload */}
        <section className="mt-6 print:hidden">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attach Sales Report
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
            className="border-2 border-gray-300 p-2 rounded-lg w-full sm:w-auto"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (!selectedFile) return;
              setFile(selectedFile);
              handleUpload(selectedFile);
            }}
          />
        </section>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 text-lg font-semibold"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
