"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const SummaryPage = ({ data = [] }) => {
  const [visibleRows, setVisibleRows] = useState(20);

  return (
    <div className="overflow-x-auto  m-2 mt-4 bg-white">
      <table className="min-w-full table-auto   border border-gray-400 items-center text-center">
        <thead className="bg-blue-100 border">
          <tr>
            {[
              "Sr#",
              "Execution Date",
              "CSR-No.",
              "Doctor's Name",
              "Speciality",
              "Address",
              "Brick",
              "District",
              "Region",
              "Group",
              "Executed By",
              "Particulars",
              "Amount",
              "Action"
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-2 border-b text-[14px] font-bold text-gray-700 border border-gray-400 "
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, visibleRows).map((csr, idx) => (
            <tr key={idx} className="text-[12px] hover:bg-gray-50">
              <td className="px-2 py-2 border border-gray-300">{idx + 1}</td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.executeDate
                  ? new Date(csr.executeDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-2 py-2 border border-gray-300">{csr?.csrNumber || "N/A"}</td>
              <td className="px-2 py-2 border border-gray-300">{csr.doctorId?.name}</td>
              <td className="px-2 py-2 border border-gray-300">{csr.doctorId?.speciality}</td>
              <td className="px-2 py-2 border border-gray-300">{csr.doctorId?.address}</td>
              <td className="px-2 py-2 border border-gray-300">{csr.doctorId?.brick}</td>
              <td className="px-2 py-2 border border-gray-300">{csr.doctorId?.district}</td>
              <td className="px-2 py-2 border border-gray-300">{csr.doctorId?.zone}</td>
              <td className="px-2 py-2 border border-gray-300">{csr.doctorId?.group}</td>
              <td className="px-2 py-2 border border-gray-300">{csr.executedBy || "N/A"}</td>
              <td className="px-2 py-2 border border-gray-300">{csr.particulars}</td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.Business?.length > 0
                  ? Number(csr.Business[0].exactCost).toLocaleString()
                  : "N/A"}
              </td>
               <td className="px-2 py-2 border border-gray-300">
                {}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {visibleRows < data.length && (
        <div className="flex justify-center py-3">
          <Button onClick={() => setVisibleRows(visibleRows + 10)}>
            View More
          </Button>
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
