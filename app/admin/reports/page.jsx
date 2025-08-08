"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function CSRReportsTab() {
  const [reports, setReports] = useState([]);
  const [selectedCSR, setSelectedCSR] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
  const fetchReports = async () => {
    try {
      const res = await fetch("/api/csrInfo/getreportsCSR", {
        credentials: "include",
      });

      const data = await res.json();
      console.log("Fetched CSR Reports:", data); 
      setReports(data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };
  fetchReports();
}, []);

const openDetails = (csr) => {
    setSelectedCSR(csr);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setSelectedCSR(null);
    setIsModalOpen(false);
  };
 
  return (
    <section className="p-4">
      <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Decisons For CSRs</h2>

        {reports.length === 0 ? (
          <p>No CSR available for review.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((csr) => (
              <div
                key={csr._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold">
                      Executed By: {csr.executedBy || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      date:{" "}
                      {csr. executeDate}
                    </p>
                    <p className="text-gray-600">
                    Particulars: {csr.particulars}
                    </p>
                  </div>
                  <div className="space-x-2">
                    

                    <Button
                      variant="default"
                      
                    
                      className="bg-green-500 hover:bg-blue-700 text-white"
                    >
                      Download
                    </Button>

                    <Button
                      onClick={() => openDetails(csr)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && selectedCSR && (
        <div
          className="print-area fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4
  print:static print:p-0 print:m-0 print:bg-white print:block print:shadow-none print:overflow-visible print:rounded-none"
        >
          <div
            className="print-area bg-white rounded-2xl shadow-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto relative p-6
  print:static  print:max-h-full print:shadow-none print:overflow-visible print:rounded-none print:w-full print:p-0 print:m-0 print:h-auto"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition print:hidden"
              onClick={closeDetails}
            >
              ✕
            </button>

            <div className="flex justify-between items-center mr-6 mb-6 print:mb-0">
              <h2 className="text-2xl font-bold text-gray-800 print:text-xl">
                CSR #{selectedCSR?.csrNumber || "N/A"}
              </h2>
              <div className="hidden print:flex justify-center items-center mb-4">
                <img
                  src="/Medlife logo.png"
                  alt="Company Logo"
                  className="h-20 print:h-16"
                />
              </div>
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition print:hidden"
              >
                Print
              </button>
            </div>

            <div className="grid grid-cols-1 print:grid-cols-4 print:p-0 print:mb-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:gap-0 mb-6">
              {[
                { label: "FE/MIO/SMIO", value: selectedCSR.filledBy },
                { label: "Submitted By", value: selectedCSR.creatorId?.name },
                { label: "DSM District", value: selectedCSR.creatorId?.area },
                { label: "DSM Group", value: selectedCSR.creatorId?.group },
                { label: "Doctor", value: selectedCSR.doctorId?.name },
                {
                  label: "Qualification",
                  value: selectedCSR.doctorId?.qualification,
                },
                {
                  label: "Designation",
                  value: selectedCSR.doctorId?.designation,
                },
                {
                  label: "Speciality",
                  value: selectedCSR.doctorId?.speciality,
                },
                {
                  label: "Hospital Address",
                  value: selectedCSR.doctorId?.location,
                },
                {
                  label: "Full Address",
                  value: selectedCSR.doctorId?.address,
                },
                {
                  label: "  Executed By",
                  value: selectedCSR.executedBy,
                },
                {
                  label: "  Execute Date",
                  value: selectedCSR.executeDate,
                },
                 {
                  label: "particulars",
                  value: selectedCSR.particulars,
                },
                { label: "Brick", value: selectedCSR.Brick },
                { label: "Customer Type", value: selectedCSR.customerType },
                {
                  label: "Patients (Morning/Evening)",
                  value: `${selectedCSR.patientsMorning || 0} / ${
                    selectedCSR.patientsEvening || 0
                  }`,
                },
              ].map(({ label, value }, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 print:border-none print:m-0 print:text-sm"
                >
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-sm text-gray-800 font-semibold">
                    {value || "N/A"}
                  </p>
                </div>
              ))}
            </div>

            {selectedCSR.products?.length > 0 && (
              <div className="mb-6 print:mb-0  ">
                <h3 className="text-xl font-bold mb-4">Products</h3>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600">
                      <th className="p-2 border print:p-0">Product</th>
                      <th className="p-2 border print:p-0">Strength</th>
                      <th className="p-2 border print:p-0">Present Units</th>
                      <th className="p-2 border print:p-0">Expected Units</th>
                      <th className="p-2 border print:p-0">Addition Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCSR.products.map((product, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 border">
                          {product.product || "N/A"}
                        </td>
                        <td className="p-2 border">
                          {product.strength || "N/A"}
                        </td>
                        <td className="p-2 border">
                          {product.presentUnits || "N/A"}
                        </td>
                        <td className="p-2 border">
                          {product.expectedUnits || "N/A"}
                        </td>
                        <td className="p-2 border">
                          {product.additionUnits || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedCSR.Business?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 print:mb-0 print:p-0">
                  Business Details
                </h3>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600">
                      <th className="p-2 border">Required Date</th>
                      <th className="p-2 border">Exact Cost</th>
                      <th className="p-2 border">BY HO</th>
                      <th className="p-2 border">ROI%</th>
                      <th className="p-2 border">Exp. Total Business</th>
                      <th className="p-2 border">Business Period</th>
                      <th className="p-2 border">Business Value (Present)</th>
                      <th className="p-2 border">Business Value (Expected)</th>
                      <th className="p-2 border">Business Value (Addition)</th>
                      <th className="p-2 border">Activity</th>
                      <th className="p-2 border">Investment Last Year</th>
                      <th className="p-2 border">Activity Month</th>
                      <th className="p-2 border">Items Requested</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCSR.Business.map((business, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 border print:p-0">
                          {business.requiredDate || "N/A"}
                        </td>
                        <td className="p-2 border print:p-0">
                          {business.exactCost || "N/A"}
                        </td>
                        <td className="p-2 border print:p-0">
                          {business.byHo || "N/A"}
                        </td>
                        <td className="p-2 border print:p-0">
                          {business.roi || "N/A"}
                        </td>
                        <td className="p-2 border">
                          {business.expectedTotalBusiness || "N/A"}
                        </td>
                        <td className="p-2 border print:p-0">
                          {business.businessPeriod || "N/A"}
                        </td>
                        <td className="p-2 border">
                          {business.businessValuePresent || "N/A"}
                        </td>
                        <td className="p-2 border print:p-0">
                          {business.businessValueExpected || "N/A"}
                        </td>
                        <td className="p-2 border print:p-0">
                          {business.businessValueAddition || "N/A"}
                        </td>
                        <td className="p-2 border print:p-0">
                          {business.activity || "N/A"}
                        </td>
                        <td className="p-2 border print:p-0">
                          {business.investmentLastYear || "N/A"}
                        </td>
                        <td className="p-2 border print:p-0">
                          {business.activityMonth || "N/A"}
                        </td>
                        <td className="p-2 border print:p-0">
                          {business.itemRequested || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedCSR.chemists?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Chemists</h3>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600">
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Business Share</th>
                      <th className="p-2 border">Other Doctors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCSR.chemists.map((chemist, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 border">
                          {chemist.chemistName || "N/A"}
                        </td>
                        <td className="p-2 border">
                          {chemist.businessShare || "N/A"}
                        </td>
                        <td className="p-2 border">
                          {chemist.otherDoctors || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedCSR.ledgerSummary?.length > 0 && (
              <div className="mb-6 print:mb-0">
                <h3 className="text-xl font-bold mb-4">Ledger Summary</h3>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600">
                      <th className="p-2 border print:p-0">Month</th>
                      <th className="p-2 border print:p-0">Sale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCSR.ledgerSummary.map((summary, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 border print:p-0">
                          {summary.month || "N/A"}
                        </td>
                        <td className="p-2 border print:p-0">
                          {summary.sale || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 space-y-3 print:mt-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2 print:border">
                <p>
                  <strong>Investment Instructions:</strong>{" "}
                  {selectedCSR.investmentInstructions || "N/A"}
                </p>
                <p>
                  <strong>Comments:</strong> {selectedCSR.comments || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
     
    </section>
  );
}
