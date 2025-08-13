"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Select from "react-select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

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
    <div className="bg-blue-100 min-h-screen py-2 rounded-md">
      <Head>
        <title>CSR Performa Form</title>
      </Head>

      {/* Hero section with background image */}

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto p-5 space-y-4 bg-white rounded-md  "
      >
        {/* Title */}
        <div className="text-center">
          <section
            className="relative bg-cover bg-no-repeat bg-center w-full h-48 rounded-md  flex items-center justify-center"
            style={{
              backgroundImage:
                "url('https://media.istockphoto.com/id/1448152453/vector/big-data-technology-and-data-science-illustration-data-flow-concept-querying-analysing.jpg?s=2048x2048&w=is&k=20&c=RJqfVGXDYkWmwIohM7hsaRY5Lz6n_I8UIcftlKMnioM=')",
            }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white bg-black/50 px-4 py-2 rounded-lg">
              CSR Form
            </h1>
          </section>
        </div>
        <section className="w-full flex flex-col space-y-8">
          {/* SMIO/FE Section */}
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            <div className="flex-1">
              <label
                htmlFor="filledBy"
                className="block text-sm font-semibold text-gray-800 mb-2 print:text-black"
              >
                SMIO / FE
              </label>
              <input
                type="text"
                id="filledBy"
                name="filledBy"
                placeholder="Enter CSR User's Name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm
          focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                value={formData.filledBy}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="groupOfFE"
                className="block text-sm font-semibold text-gray-800 mb-2 print:text-black"
              >
                Group of SMIO / FE
              </label>
              <select
                id="groupOfFE"
                name="groupOfFE"
                value={formData.groupOfFE}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900
          focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
              >
                <option value="" disabled>
                  Select a group
                </option>
                <option value="corporate">Corporate</option>
                <option value="jupiter">Jupiter</option>
                <option value="venus">Venus</option>
                <option value="dynamic">Dynamic</option>
              </select>
            </div>
          </div>

          {/* Doctor Details Section */}
          <section
            className="bg-white border border-gary-200 rounded-md p-6 print:bg-white print:shadow-none print:p-0 print:border-none"
            aria-labelledby="doctor-details-title"
          >
            <h2
              id="doctor-details-title"
              className="text-1xl font-bold text-gray-900 mb-6 border-b text-center border-gray-200 pb-3"
            >
              Doctor Details
            </h2>

            <div className="mb-6">
              <label
                htmlFor="doctor-select"
                className="block text-sm font-semibold text-gray-800 mb-2 print:text-black"
              >
                Doctor Name
              </label>
              <Select
                id="doctor-select"
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

            {/* Doctor Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                {
                  label: "Designation",
                  name: "drDesignation",
                  placeholder: "Enter designation",
                },
                {
                  label: "Qualification",
                  name: "qualification",
                  placeholder: "Enter qualification",
                },
                {
                  label: "Speciality",
                  name: "speciality",
                  placeholder: "Enter speciality",
                },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-gray-800 mb-2 print:text-black"
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    id={name}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full rounded-md border border-gray-300 px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm"
                  />
                </div>
              ))}
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                {
                  label: "Cell No",
                  name: "contact",
                  placeholder: "0300xxxxxxx",
                },
                { label: "Group", name: "group", placeholder: "Enter group" },
                {
                  label: "Brick Name",
                  name: "brick",
                  placeholder: "Enter brick name",
                },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-gray-800 mb-2 print:text-black"
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    id={name}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full rounded-md border border-gray-300 px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm"
                  />
                </div>
              ))}
            </div>

            {/* Address / Clinic / Hospital */}
            <div className="mb-6">
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-gray-800 mb-2 print:text-black"
              >
                Full Address / Clinic Name / Hospital Name
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Clinic or Hospital Name"
                className="w-full rounded-md border border-gray-300 px-4 py-3 resize-y
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm"
                rows={3}
              />
            </div>

            {/* Patients & Customer Type Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <label
                  htmlFor="patientsMorning"
                  className="block text-sm font-semibold text-gray-800 mb-2 print:text-black"
                >
                  Patients (Morning)
                </label>
                <input
                  type="number"
                  id="patientsMorning"
                  name="patientsMorning"
                  value={formData.patientsMorning || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                  className="w-full rounded-md border border-gray-300 px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm"
                  min={0}
                />
              </div>

              <div>
                <label
                  htmlFor="patientsEvening"
                  className="block text-sm font-semibold text-gray-800 mb-2 print:text-black"
                >
                  Patients (Evening)
                </label>
                <input
                  type="number"
                  id="patientsEvening"
                  name="patientsEvening"
                  value={formData.patientsEvening || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., 20"
                  className="w-full rounded-md border border-gray-300 px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm"
                  min={0}
                />
              </div>

              <fieldset className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 mt-1">
                <legend className="sr-only">Customer Type</legend>
                {["Existing", "New"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-700 print:text-black cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="customerType"
                      value={type}
                      checked={formData.customerType === type}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </fieldset>
            </div>
          </section>
        </section>
        {/* Product Commitments */}
        <section
          className=" bg-white border border-gray-200 rounded-md p-4 print:bg-white print:shadow-none print:p-0 print:border-none"
          aria-labelledby="product-details-title"
        >
          <h2
            id="product-details-title"
            className="text-1xl font-bold text-gray-900 mb-4 border-b text-center border-gray-200 pb-3"
          >
            Product Details
          </h2>

          <div className="overflow-x-auto print:overflow-visible">
            <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg print:border-black">
              <thead className=" text-gray-700  text-sm print:bg-white print:border-b print:border-black">
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
                      className="border px-4 py-3 print:border-black"
                      scope="col"
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
                    <td className="border px-4 py-3 print:border-black">
                      {index + 1}
                    </td>

                    <td className="border px-4 py-2 print:border-black">
                      <select
                        value={item.product}
                        onChange={(e) =>
                          handleProductChange(index, "product", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm print:border-gray-400 print:shadow-none"
                        required
                      >
                        <option value="" disabled>
                          Select Product
                        </option>
                        {productsList.map((p, idx) => (
                          <option key={idx} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="border px-4 py-2 print:border-black">
                      <select
                        value={item.strength}
                        onChange={(e) =>
                          handleProductChange(index, "strength", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition shadow-sm print:border-gray-400 print:shadow-none"
                        required
                      >
                        <option value="" disabled>
                          Select Strength
                        </option>
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

                    {["presentUnits", "expectedUnits", "additionUnits"].map(
                      (field) => (
                        <td
                          key={field}
                          className="border px-4 py-2 print:border-black"
                        >
                          <input
                            type="number"
                            min={0}
                            max={10000}
                            value={item[field]}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                field,
                                Number(e.target.value)
                              )
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition print:border-gray-400 print:shadow-none"
                            placeholder="0"
                            required
                          />
                        </td>
                      )
                    )}

                    <td className="border px-4 py-2 text-center print:border-black print:hidden">
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="text-red-600 hover:text-red-800 font-semibold transition"
                        aria-label={`Remove product row ${index + 1}`}
                      >
                        <Trash2 size={20} className="text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end print:hidden">
            <button
              type="button"
              onClick={addProduct}
              className="font-bold text-white bg-blue-950 px-4 py-2 rounded-lg drop-shadow-lg hover:bg-gray-700 transition"
            >
              + Add Product
            </button>
          </div>

          {/* Business Value */}
          <div className="mt-4">
            <h2
              id="Busines-details-title"
              className="text-1xl text-center font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3"
            >
              Business Value
            </h2>

            <div className="w-full max-w-6xl border border-gray-300 rounded-lg overflow-hidden">
              {/* Header Row */}
              <div className="grid grid-cols-3 text-gray-700 text-sm font-semibold bg-gray-100 border-b border-gray-300">
                <div className="p-2 text-center border-r border-gray-300">
                  Present
                </div>
                <div className="p-2 text-center border-r border-gray-300">
                  Expected
                </div>
                <div className="p-2 text-center">Addition</div>
              </div>

              {/* Input Row */}
              <div className="grid grid-cols-3">
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
                  className="w-full border-r border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                  placeholder="0"
                />
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
                  className="w-full border-r border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                  placeholder="0"
                />
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
                  className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Business Details */}
        <section className=" border border-gray-200 rounded-md bg-white p-4 mt-2 print:bg-white print:shadow-none print:p-0 print:border-none max-w-6xl mx-auto">
          <h2
            id="busines-details-title"
            className="text-1xl text-center font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3"
          >
            Business Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="block text-sm font-medium text-gray-700 mb-2 print:text-black"
                >
                  {label}
                </label>
                <input
                  type={type || "text"}
                  id={name}
                  name={name}
                  value={formData.Business?.[0]?.[name] || ""}
                  onChange={(e) =>
                    handleBusinessChange(0, name, e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900
            placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition print:border-gray-400 print:shadow-none"
                  placeholder={
                    type === "date" ? "" : `Enter ${label.toLowerCase()}`
                  }
                />
              </div>
            ))}

            <div className="sm:col-span-2 md:col-span-3">
              <label
                htmlFor="itemRequested"
                className="block text-sm font-medium text-gray-700 mb-1 print:text-black"
              >
                Item Requested (Complete Specifications)
              </label>
              <textarea
                id="itemRequested"
                name="itemRequested"
                value={formData.Business?.[0]?.itemRequested || ""}
                onChange={(e) =>
                  handleBusinessChange(0, "itemRequested", e.target.value)
                }
                rows={3}
                placeholder="Provide complete specifications here..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 resize-y
          text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition print:border-gray-400 print:shadow-none"
              />
            </div>
          </div>
        </section>

        {/* Chemist Table */}
        <section className=" border border-gray-200 rounded-md p-2 sm:p-4 print:bg-white print:shadow-none print:p-0 print:border-none">
          <h2
            id="doctor-details-title"
            className="text-1xl font-bold text-center text-gray-900 mb-6 border-b border-gray-200 pb-2"
          >
            Chemist Details
          </h2>

          <div className="overflow-x-auto border border-gray-200 print:overflow-visible print:border-black">
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
                        className="w-full px-2 py-1 border  focus:ring-2 focus:ring-blue-400 focus:outline-none print:border-gray-400"
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
                        className="w-full px-2 py-1 border focus:ring-2 focus:ring-blue-400 focus:outline-none print:border-gray-400"
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
                        className="w-full px-2 py-1 border focus:ring-2 focus:ring-blue-400 focus:outline-none print:border-gray-400"
                      />
                    </td>
                    <td className="border px-4 py-2 text-center print:hidden">
                      <button
                        type="button"
                        onClick={() => removeChemist(index)}
                        className="text-red-500 hover:text-red-700 font-semibold transition-colors duration-200"
                      >
                        <Trash2 size={20} className="text-red-500" />
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
              className="font-bold text-white bg-blue-950 px-4 py-2 rounded-lg drop-shadow-lg hover:bg-gray-600 transition duration-200"
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
              rows={2}
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
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
              rows={2}
              className="w-full px-3 py-2 border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-gray-400 print:shadow-none"
            />
          </div>
        </section>

        {/* Ledger Summary */}
        <section className=" border border-gray-200 rounded-md p-4 sm:p-6  mt-4 print:bg-white print:shadow-none print:p-0 print:border-none">
          <h2
            id="doctor-details-title"
            className="text-1xl font-bold text-center text-gray-900 mb-6 border-b border-gray-200 pb-3"
          >
            Ledger Summary
          </h2>
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
                    <td className="border rounded-md  px-4 py-2 print:border-black">
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
                        className="text-red-500  hover:text-red-700 font-semibold"
                      >
                        <Trash2 size={20} className="text-red-500" />
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
              className="font-bold text-white bg-blue-950 drop-shadow-lg px-4 py-2 rounded-lg hover:bg-gray-600 text-sm"
            >
              + Add Row
            </button>
          </div>
        </section>

        {/* File Upload */}
        <section className="mt-6 print:hidden">
          
            <h2
            id="doctor-details-title"
            className="text-1xl font-bold text-center text-gray-900 mb-2 border-gray-200 pb-3"
          >
            Attach Sales Report
          </h2>
            <span className="block text-xs text-gray-500 mt-1">
              (Accepted formats: PDF, JPG, PNG, XLSX, DOCX)
            </span>
          

          <label
            htmlFor="salesReport"
            className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0 0l-3-3m3 3l3-3M12 3v9m0 0l3-3m-3 3l-3-3"
              />
            </svg>
            <span className="text-gray-700 font-medium">Click to Upload</span>
          </label>

          <input
            id="salesReport"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
            className="hidden"
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
            className="bg-blue-700 hover:bg-yellow-500 text-blue-950 font-semibold w-[400px] mt-6  px-8 py-3 rounded-lg shadow-md  transition-all duration-200 text-lg "
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
