"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CSRPrintPage() {
 
 const { id } = useParams();
  const [csr, setCsr] = useState(null);
  
    const [totalCSR, settotalCSR] = useState([]);
    const [selectedCSR, setSelectedCSR] = useState(null);

  useEffect(() => {
  if (!id) return;
  const fetchCSR = async () => {
    const res = await fetch(`/api/csrInfo/getCSR/${id}`);
    if (!res.ok) {
      console.error("CSR not found");
      return;
    }
    const data = await res.json();
    setCsr(data); // ✅ this is the important change
  };
  fetchCSR();
}, [id]);

    
  // Auto-open print dialog when loaded
  

  if (!csr) {
    return <p className="p-10 text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-white text-black p-10 max-w-[210mm] mx-auto font-sans text-sm print:p-6">
         <div className="mb-6 text-right print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Print CSR
        </button>
      </div>
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">CSR #{csr.csrNumber || "N/A"}</h1>
          <p className="text-xs text-gray-600">FE/MIO/SMIO: {csr.filledBy || "N/A"}</p>
        </div>
        <img src="/Medlife logo.png" alt="Company Logo" className="h-12" />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <p><strong>Submitted By:</strong> {csr.creatorId?.name || "N/A"}</p>
        <p><strong>DSM District:</strong> {csr.creatorId?.area || "N/A"}</p>
        <p><strong>DSM Group:</strong> {csr.creatorId?.group || "N/A"}</p>
        <p><strong>Doctor:</strong> {csr.doctorId?.name || "N/A"}</p>
        <p><strong>Qualification:</strong> {csr.doctorId?.qualification || "N/A"}</p>
        <p><strong>Designation:</strong> {csr.doctorId?.designation || "N/A"}</p>
        <p><strong>Speciality:</strong> {csr.doctorId?.speciality || "N/A"}</p>
        <p><strong>District:</strong> {csr.doctorId?.district || "N/A"}</p>
        <p className="col-span-2"><strong>Address:</strong> {csr.doctorId?.address || "N/A"}</p>
        <p><strong>Brick:</strong> {csr.doctorId?.brick || "N/A"}</p>
        <p><strong>Customer Type:</strong> {csr.customerType || "N/A"}</p>
        <p><strong>Patients (M/E):</strong> {csr.patientsMorning || 0} / {csr.patientsEvening || 0}</p>
      </div>

      {/* Products */}
      {csr.products?.length > 0 && (
        <>
          <h2 className="font-semibold text-lg mb-2">Products</h2>
          <table className="w-full border-collapse border mb-6 text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">Strength</th>
                <th className="border p-2">Present</th>
                <th className="border p-2">Expected</th>
                <th className="border p-2">Addition</th>
              </tr>
            </thead>
            <tbody>
              {csr.products.map((p, i) => (
                <tr key={i}>
                  <td className="border p-2">{p.product}</td>
                  <td className="border p-2">{p.strength}</td>
                  <td className="border p-2">{p.presentUnits}</td>
                  <td className="border p-2">{p.expectedUnits}</td>
                  <td className="border p-2">{p.additionUnits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Business Details */}
      {csr.Business?.length > 0 && (
        <>
          <h2 className="font-semibold text-lg mb-2">Business Details</h2>
          <table className="w-full border-collapse border text-xs mb-6">
            <tbody>
              <tr><td className="border p-2">Required Date</td><td className="border p-2">{csr.Business[0].requiredDate || "N/A"}</td></tr>
              <tr><td className="border p-2">Exact Cost</td><td className="border p-2">{csr.Business[0].exactCost || "N/A"}</td></tr>
              <tr><td className="border p-2">BY HO</td><td className="border p-2">{csr.Business[0].byHo || "N/A"}</td></tr>
              <tr><td className="border p-2">Items Requested</td><td className="border p-2">{csr.Business[0].itemRequested || "N/A"}</td></tr>
              <tr><td className="border p-2">ROI%</td><td className="border p-2">{csr.Business[0].roi || "N/A"}</td></tr>
              <tr><td className="border p-2">Expected Total Business</td><td className="border p-2">{csr.Business[0].expectedTotalBusiness || "N/A"}</td></tr>
              <tr><td className="border p-2">Business Period</td><td className="border p-2">{csr.Business[0].businessPeriod || "N/A"}</td></tr>
              <tr><td className="border p-2">Investment Last Year</td><td className="border p-2">{csr.Business[0].investmentLastYear || "N/A"}</td></tr>
            </tbody>
          </table>
        </>
      )}

      {/* Chemists */}
      {csr.chemists?.length > 0 && (
        <>
          <h2 className="font-semibold text-lg mb-2">Chemists</h2>
          <table className="w-full border-collapse border text-xs mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Business Share</th>
                <th className="border p-2">Other Doctors</th>
              </tr>
            </thead>
            <tbody>
              {csr.chemists.map((c, i) => (
                <tr key={i}>
                  <td className="border p-2">{c.chemistName}</td>
                  <td className="border p-2">{c.businessShare}</td>
                  <td className="border p-2">{c.otherDoctors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Ledger Summary */}
      {csr.ledgerSummary?.length > 0 && (
        <>
          <h2 className="font-semibold text-lg mb-2">Ledger Summary</h2>
          <table className="w-full border-collapse border text-xs mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Month</th>
                <th className="border p-2">Sale</th>
              </tr>
            </thead>
            <tbody>
              {csr.ledgerSummary.map((l, i) => (
                <tr key={i}>
                  <td className="border p-2">{l.month}</td>
                  <td className="border p-2">{l.sale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Comments */}
      <h2 className="font-semibold text-lg mb-2">Instructions & Comments</h2>
      <p><strong>Investment Instructions:</strong> {csr.investmentInstructions || "N/A"}</p>
      <p><strong>Comments:</strong> {csr.comments || "N/A"}</p>

      {/* Approval Signatures */}
      <div className="grid grid-cols-4 gap-6 mt-8">
        {["sm", "gm", "pm", "md"].map((role) => {
          const approver = csr?.approvedBy?.[role];
          return (
            <div key={role} className="flex flex-col items-center">
              <div className="w-full border-b h-6"></div>
              <p className="mt-2 text-xs font-medium">{role.toUpperCase()}</p>
              {approver && (
                <span className="text-green-700 text-xs">
                  Approved by {approver.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
