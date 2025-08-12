"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import {
  FileText,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  User,
  Link,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReactToPrint } from "react-to-print";
import DoctorManagement from "../../admin/doctormanagement/page";
import CSRList from "@/app/SMuser/CSRList/page";

const GMpage = () => {
  const [currentuserRole, setCurrentuserRole] = useState("gm");
  const [createdCSR, setCreatedCSR] = useState(false);
  const [totalCSR, settotalCSR] = useState([]);
  const [csrList, setCsrList] = useState([]);
  const [selectedCSR, setSelectedCSR] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvingCSR, setApprovingCSR] = useState(null);
  const [approvedCSRIds, setApprovedCSRIds] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [stats, setStats] = useState({
    totalCSR: 0,
    completedThisMonth: 0,
    totalDoctors: 0,
  });
  const pathname = usePathname();

  const userRole = pathname.includes("SMuser")
    ? "sm"
    : pathname.includes("GMuser")
    ? "gm"
    : pathname.includes("admin")
    ? "admin"
    : "";

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedCSR ? `CSR-${selectedCSR.csrNumber}` : "CSR-Form",
  });

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/landing-page/Home");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during logout.");
    }
  };
  useEffect(() => {
    const fetchCSR = async () => {
      const res = await fetch("/api/csrInfo/getGMCSR");
      const data = await res.json();
      setCsrList(data);
    };
    fetchCSR();
  }, []);
  useEffect(() => {
    const fetchCSR = async () => {
      const res = await fetch("/api/csrInfo/getCSR");
      const data = await res.json();
      settotalCSR(data);
    };
    fetchCSR();
  }, []);
  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await fetch("/api/doctorsManage/getDoctors");
      const data = await res.json();
      if (res.ok) {
        setDoctors(data);
      }
    };
    fetchDoctors();
  }, []);

  const handleDecision = async (csrId, status) => {
    try {
      const res = await fetch("/api/csrInfo/updateCSR", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csrId,
          role: userRole,
          status,
        }),
      });

      const updated = await res.json();

      if (!res.ok) {
        toast.error(updated.message || "Failed to update CSR");
        return;
      }

      toast.success(updated.message);

      if (status === "approved") {
        setApprovedCSRIds((prev) => [...prev, csrId]);
      }
    } catch (error) {
      console.error("Error updating CSR:", error);
      toast.error("An error occurred. Try again.");
    } finally {
      setApprovingCSR(null);
    }
  };
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/userinfo");
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-indigo-100 to-teal-100">
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">MedLife CSR</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <div className="p-4 flex">
                <User className="w-5 h-5 text-gray-500" />
                {user ? <h1>Welcome, {user.name}!</h1> : <p>Loading...</p>}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {currentuserRole}
          </h2>
          <p className="text-gray-600">
            Manage your pharmaceutical sales requests and track doctor
            commitments
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total CSRs</p>
                  <p className="text-2xl font-bold">{totalCSR.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">
                    {stats.completedThisMonth}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Doctors</p>
                  <p className="text-2xl font-bold">{doctors.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="csrs">CSRs</TabsTrigger>
            </TabsList>

            {userRole === "dsm" && (
              <Button
                onClick={() => router.push("/SMuser/CreatedCSR")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create CSR
              </Button>
            )}
          </div>

          <TabsContent value="dashboard">
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      Empower Your{" "}
                      <span className="text-blue-600">Pharma Sales</span>{" "}
                      Journey
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                      Streamline CSR requests, manage doctor commitments, and
                      track your sales performance all in one smart platform.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-10 rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src="https://images.pexels.com/photos/7088486/pexels-photo-7088486.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Medical professionals"
                        className="w-full h-96 object-cover rounded-2xl"
                      />
                    </div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full opacity-20 blur-xl"></div>
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"></div>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="doctors">
            <DoctorManagement />
          </TabsContent>
          <TabsContent value="csrs">
            <Tabs defaultValue="list" className="space-y-4">
              {/* Nested Tabs for CSRs */}
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="list">CSR List</TabsTrigger>
                <TabsTrigger value="decision">Decision Making</TabsTrigger>
              </TabsList>
              <TabsContent value="decision">
                <section className="mt-6">
                  <h2 className="text-xl font-bold mb-4">Decisons For CSRs</h2>

                  {csrList.length === 0 ? (
                    <p>No CSR available for review.</p>
                  ) : (
                    <div className="space-y-4">
                      {csrList.map((csr) => (
                        <div
                          key={csr._id}
                          className="border rounded-lg p-4 shadow-sm bg-white"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <p className="font-semibold">
                                Doctor: {csr.doctorId?.name || "N/A"}
                              </p>
                              <p className="text-gray-600">
                                Commitment:{" "}
                                {csr.Business?.[0]?.businessValueExpected || 0}
                              </p>
                              <p className="text-gray-600">
                                Created By: {csr.creatorId?.name || "N/A"}
                              </p>
                            </div>
                            <div className="space-x-2">
                              {/* Action Buttons */}

                              {approvedCSRIds.includes(csr._id) ? (
                                <Button
                                  size="sm"
                                  disabled
                                  className="bg-green-700 text-white cursor-not-allowed"
                                >
                                  Approved
                                </Button>
                              ) : (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() =>
                                    handleDecision(csr._id, "approved")
                                  }
                                  className="bg-green-500 hover:bg-blue-700 text-white"
                                >
                                  Approve
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleDecision(csr._id, "rejected")
                                }
                              >
                                Reject
                              </Button>

                              <Button
                                className="bg-blue-600 text-white"
                                onClick={() => setSelectedCSR(csr)}
                              >
                                Detail View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </TabsContent>
              <TabsContent value="list">
                <CSRList />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
        {selectedCSR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[80%] h-[90%] overflow-y-auto rounded-lg shadow-lg p-6 relative">
              {/* Header Buttons */}
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white p-2 z-10">
                <div className="text-[10px] font-bold flex-col">
                  <p>CSR #</p>
                  {selectedCSR.csrNumber}
                </div>
                <div className="text-lg font-bold">
                  <h1>CUSTOMER SERVICE REQUEST</h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (printRef.current) handlePrint();
                    }}
                    className="bg-green-600 text-white"
                  >
                    Print
                  </Button>
                  <Button
                    onClick={() => setSelectedCSR(null)}
                    className="bg-red-600 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div
                ref={printRef}
                className="bg-white p-6 max-w-[250mm] mx-auto text-sm"
              >
                {/* Print-Only Header */}
                <div className="hidden print:flex items-center justify-between mb-4 border-b pb-2">
                  {/* Left: CSR Number */}
                  <div className="text-xs font-bold text-gray-700">
                    <p>CSR #</p>
                    <p>{selectedCSR.csrNumber}</p>
                  </div>

                  {/* Center: Title */}
                  <div className="text-lg font-bold text-center uppercase flex-1">
                    Customer Service Request
                  </div>

                  {/* Right: Logo */}
                  <div className="flex justify-end">
                    <img
                      src="/Medlife logo.png"
                      alt="Company Logo"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                </div>

                <div className="grid w-[800px] grid-cols-4 gap-6 mb-2  ">
                  <p>
                    <strong>Submitted By:</strong>{" "}
                    {selectedCSR.creatorId?.name || "N/A"}
                  </p>
                  <p>
                    <strong>District:</strong>{" "}
                    {selectedCSR.creatorId?.area || "N/A"}
                  </p>
                  <p>
                    <strong> FE/MIO/SMIO:</strong>{" "}
                    {selectedCSR.filledBy || "N/A"}
                  </p>
                  <p>
                    <strong>Doctor:</strong>{" "}
                    {selectedCSR.doctorId?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Qualification:</strong>{" "}
                    {selectedCSR.doctorId?.qualification || "N/A"}
                  </p>
                  <p>
                    <strong>Designation:</strong>{" "}
                    {selectedCSR.doctorId?.designation || "N/A"}
                  </p>
                  <p>
                    <strong>Speciality:</strong>{" "}
                    {selectedCSR.doctorId?.speciality || "N/A"}
                  </p>
                  <p>
                    <strong>District:</strong>{" "}
                    {selectedCSR.doctorId?.district || "N/A"}
                  </p>
                  <p className="col-span-2">
                    <strong>Address:</strong>{" "}
                    {selectedCSR.doctorId?.address || "N/A"}
                  </p>
                  <p>
                    <strong>Brick:</strong>{" "}
                    {selectedCSR.doctorId?.brick || "N/A"}
                  </p>
                  <p>
                    <strong>Group:</strong>{" "}
                    {selectedCSR.doctorId?.group || "N/A"}
                  </p>
                  <p className="text-[12px]">
                    <strong>Customer Type:</strong>{" "}
                    {selectedCSR.customerType || "N/A"}
                  </p>
                  <p className="text-[12px]">
                    <strong>Patients (M/E):</strong>{" "}
                    {selectedCSR.patientsMorning || 0} /{" "}
                    {selectedCSR.patientsEvening || 0}
                  </p>
                </div>

                {/* Products */}
                {selectedCSR.products?.length > 0 && (
                  <>
                    <h2 className="font-semibold text-xs mb-1">Products</h2>
                    <table className="w-full border-collapse  border mb-2 text-xs">
                      <thead className="bg-gray-100 text-[8px]">
                        <tr>
                          <th className="border p-1">Product</th>
                          <th className="border p-1">Strength</th>
                          <th className="border p-1">Present</th>
                          <th className="border p-1">Expected</th>
                          <th className="border p-1">Addition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCSR.products.map((p, i) => (
                          <tr key={i}>
                            <td className="border p-1 text-[9px]">
                              {p.product}
                            </td>
                            <td className="border p-1 text-[9px]">
                              {p.strength}
                            </td>
                            <td className="border p-1 text-[9px]">
                              {p.presentUnits}
                            </td>
                            <td className="border p-1 text-[9px]">
                              {p.expectedUnits}
                            </td>
                            <td className="border p-1 text-[9px]">
                              {p.additionUnits}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="font-bold text-[9px] text-gray-600 text-center bg-gray-50">
                          <td
                            colSpan={2}
                            className="border p-1 print:p-1 print:text-[9px]"
                          >
                            Business Value
                          </td>
                          <td className="border p-1 print:p-1">
                            {selectedCSR.Business?.[0]?.businessValuePresent
                              ? Number(
                                  selectedCSR.Business?.[0]
                                    ?.businessValuePresent
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="border p-1 print:p-1">
                            {selectedCSR.Business?.[0]?.businessValueExpected
                              ? Number(
                                  selectedCSR.Business?.[0]
                                    ?.businessValueExpected
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="border p-1 print:p-1">
                            {selectedCSR.Business?.[0]?.businessValueAddition
                              ? Number(
                                  selectedCSR.Business?.[0]
                                    ?.businessValueAddition
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </>
                )}

                {/* Business Details */}

                {selectedCSR.Business?.length > 0 && (
                  <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2 print:mb-0">
                    {/* Heading */}
                    <h3 className="text-sm font-bold mb-1 col-span-full print:mb-0 print:text-[9px]">
                      Business Details
                    </h3>

                    {/* Business Info Table */}
                    <table className="min-w-full table-auto border-collapse border border-gray-300 text-center text-[8px] print:text-[9px]">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600">
                          <th colSpan={2} className="p-1 border text-center">
                            Activity Info
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCSR.Business.map((business, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <td className="p-1 border print:w-[100px]">
                                Required Date
                              </td>
                              <td className="p-1 border">
                                {business.requiredDate
                                  ? new Date(
                                      business.requiredDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 border">Exact Cost</td>
                              <td className="p-1 border">
                                {business.exactCost
                                  ? Number(business.exactCost).toLocaleString()
                                  : "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 border">BY HO</td>
                              <td className="p-1 border">
                                {business.byHo || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 border">Items Requested</td>
                              <td className="p-1 border">
                                {business.itemRequested || "N/A"}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>

                    {/* Financial Summary Table */}
                    <table className="min-w-full table-auto border-collapse border border-gray-300 text-center text-[9px] print:text-[9px]">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600">
                          <th colSpan={2} className="p-1 border text-center">
                            Financial Summary
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCSR.Business.map((business, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <td className="p-1 border">ROI%</td>
                              <td className="p-1 border">
                                {business.roi || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 border">
                                Exp. Total Business
                              </td>
                              <td className="p-1 border">
                                {business.expectedTotalBusiness
                                  ? Number(
                                      business.expectedTotalBusiness
                                    ).toLocaleString()
                                  : "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 border">Business Period</td>
                              <td className="p-1 border">
                                {business.businessPeriod || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 border">
                                Investment Last 12 Months
                              </td>
                              <td className="p-1 border">
                                {business.investmentLastYear
                                  ? Number(
                                      business.investmentLastYear
                                    ).toLocaleString()
                                  : "N/A"}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Chemists */}
                {selectedCSR.chemists?.length > 0 && (
                  <>
                    <h2 className="font-semibold text-sm mb-2">Chemists</h2>
                    <table className="w-full border-collapse border text-xs mb-6">
                      <thead className="bg-gray-100 text-[10px]">
                        <tr>
                          <th className="border p-1">Name</th>
                          <th className="border p-1">Business Share</th>
                          <th className="border p-1">Other Doctors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCSR.chemists.map((c, i) => (
                          <tr key={i}>
                            <td className="border p-1 text-[9px]">
                              {c.chemistName}
                            </td>
                            <td className="border p-1 text-[9px]">
                              {c.businessShare}
                            </td>
                            <td className="border p-1 text-[9px]">
                              {c.otherDoctors}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {/* Ledger Summary */}
                {selectedCSR.ledgerSummary?.length > 0 && (
                  <>
                    <h2 className="font-semibold text-sm mb-2">
                      Ledger Summary
                    </h2>
                    <table className="w-full border-collapse border text-xs mb-6">
                      <thead className="bg-gray-100 text-[10px]">
                        <tr>
                          <th className="border p-1">Month</th>
                          <th className="border p-1">Sale</th>
                          <th className="border p-1">Month</th>
                          <th className="border p-1">Sale</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({
                          length: Math.ceil(
                            selectedCSR.ledgerSummary.length / 2
                          ),
                        }).map((_, rowIndex) => {
                          const first = selectedCSR.ledgerSummary[rowIndex * 2];
                          const second =
                            selectedCSR.ledgerSummary[rowIndex * 2 + 1];
                          return (
                            <tr key={rowIndex}>
                              <td className="border text-[9px] p-1">
                                {first?.month || ""}
                              </td>
                              <td className="border text-[9px] p-1">
                                {first?.sale || ""}
                              </td>
                              <td className="border text-[9px] p-1">
                                {second?.month || ""}
                              </td>
                              <td className="border text-[9px] p-1">
                                {second?.sale || ""}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}

                {/* Comments */}
                <h2 className="font-semibold text-sm mb-2">
                  Instructions & Comments
                </h2>
                <p className="text-[8px]">
                  <strong>Investment Instructions:</strong>{" "}
                  {selectedCSR.investmentInstructions || "N/A"}
                </p>
                <p className="text-[8px]">
                  <strong>Comments:</strong> {selectedCSR.comments || "N/A"}
                </p>

                {/* Approval Signatures */}
                <div className="grid grid-cols-4 gap-6 mt-8">
                  {["sm", "gm", "pm", "md"].map((role) => {
                    const approver = selectedCSR?.approvedBy?.[role];

                    const roleStatus = selectedCSR?.[`${role}Status`];

                    return (
                      <div key={role} className="flex flex-col items-center">
                        <div className="w-full border-b h-6"></div>

                        <p className="mt-2 text-xs font-medium">
                          {role.toUpperCase()}
                        </p>

                        {approver ? (
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-xs">{`Approved by ${approver.name}`}</span>
                            {roleStatus === "approved" && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Pending Approval
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GMpage;
