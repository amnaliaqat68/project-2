"use client";
import React from "react";
import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DoctorManagement from "../../admin/doctormanagement/page";
import CSRList from "@/app/SMuser/CSRList/page";
import { toast } from "react-toastify";

const SSMpage = () => {
  const [currentuserRole, setCurrentuserRole] = useState("SM");
  const [createdCSR, setCreatedCSR] = useState(false);
  const [csrList, setCsrList] = useState([]);
  const [selectedCSR, setSelectedCSR] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [user, setUser] = useState(null);
  const [approvingCSR, setApprovingCSR] = useState(null);
  const [approvedCSRIds, setApprovedCSRIds] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [stats, setStats] = useState({
    totalCSR: 0,
    completedThisMonth: 0,
    totalDoctors: 0,
  });

  const router = useRouter();
  const pathname = usePathname();
  const userRole = pathname.includes("SMuser")
    ? "sm"
    : pathname.includes("GMuser")
    ? "gm"
    : pathname.includes("admin")
    ? "admin"
    : "";

  const openDetails = (csr) => {
    setSelectedCSR(csr);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setSelectedCSR(null);
    setIsModalOpen(false);
  };

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
      const res = await fetch("/api/csrInfo/getCSR");
      const data = await res.json();
      setCsrList(data);
      console.log("data", data);
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
      } else if (status === "rejected") {
        setCsrList((prevList) => prevList.filter((csr) => csr._id !== csrId));
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
                  <p className="text-2xl font-bold">{csrList.length}</p>
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
                                Commitment: {csr.Business?.[0]?.exactCost || 0}
                              </p>
                              <p className="text-gray-600">
                                Created By: {csr.creatorId?.name || "N/A"}
                              </p>
                            </div>
                            <div className="space-x-2">
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
              </TabsContent>
              <TabsContent value="list">
                <CSRList />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
        {isModalOpen && selectedCSR && (
          <div
            className="print-area fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-2
  print:static print:p-0 print:m-0 print:bg-white print:block print:shadow-none print:overflow-visible print:rounded-none"
          >
            <div
              className="print-area bg-white rounded-2xl shadow-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto relative p-6
  print:static print:max-h-full print:shadow-none print:overflow-visible print:rounded-none print:w-full print:p-0 print:m-0 print:h-auto"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition print:hidden"
                onClick={closeDetails}
              >
                ✕
              </button>

              <div className="flex justify-between items-center mr-6 mb-2 print:mb-0 print:top-0">
                <h2 className="text-xl font-bold text-gray-800 pint:text-center print:text-[14px]">
                  CSR #{selectedCSR?.csrNumber || "N/A"}
                </h2>
                <div className="hidden print:flex print:justify-center print:text-center mt-0">
                  <img
                    src="/Medlife logo.png"
                    alt="Company Logo"
                    className="h-15 print:h-12 mb-2"
                  />
                </div>
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition print:hidden"
                >
                  Print
                </button>
              </div>

              <div className="grid grid-cols-1 print:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-1 print:gap-x-2 print:gap-y-1 mb-4 print:mb-0 print:p-0">
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
                  { label: "District", value: selectedCSR.doctorId?.district },
                  {
                    label: "Full Address/clinic Adress",
                    value: selectedCSR.doctorId?.address,
                  },
                  { label: "Brick", value: selectedCSR.doctorId?.brick },
                  { label: "Group", value: selectedCSR.doctorId?.group },
                  { label: "Customer Type", value: selectedCSR.customerType },
                  {
                    label: "Patients (M/E)",
                    value: `${selectedCSR.patientsMorning || 0} / ${
                      selectedCSR.patientsEvening || 0
                    }`,
                  },
                ].map(({ label, value }, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-md p-1.5 print:p-1"
                  >
                    <p className="text-[10px] text-gray-500 font-medium leading-tight print:font-bold">
                      {label}
                    </p>
                    <p className="text-xs text-gray-800 font-semibold leading-snug">
                      {value || "N/A"}
                    </p>
                  </div>
                ))}
              </div>

              {selectedCSR.products?.length > 0 && (
                <div className="mb-6 print:mb-0 print:p-0">
                  <h3 className="text-xl font-bold mb-4 print:mb-2 print:text-[14px] print:font-semibold">
                    Products
                  </h3>
                  <table className="min-w-full table-auto border-collapse text-center text-sm print:text-[11px]">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th className="border p-2 print:p-1">Product</th>
                        <th className="border p-2 print:p-1">Strength</th>
                        <th className="border p-2 print:p-1">
                          Present / Units
                        </th>
                        <th className="border p-2 print:p-1">
                          Expected / Units
                        </th>
                        <th className="border p-2 print:p-1">
                          Addition / Units
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCSR.products.map((product, index) => (
                        <tr key={index} className="border-b text-center">
                          <td className="border p-2 print:p-1">
                            {product.product || "N/A"}
                          </td>
                          <td className="border p-2 print:p-1">
                            {product.strength || "N/A"}
                          </td>
                          <td className="border p-2 print:p-1">
                            {product.presentUnits || "N/A"}
                          </td>
                          <td className="border p-2 print:p-1">
                            {product.expectedUnits || "N/A"}
                          </td>
                          <td className="border p-2 print:p-1">
                            {product.additionUnits || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold text-gray-600 text-center bg-gray-50">
                        <td
                          colSpan={2}
                          className="border p-2 print:p-1 print:text-[12px]"
                        >
                          Business Value
                        </td>
                        <td className="border p-2 print:p-1">
                          {selectedCSR.Business?.[0]?.businessValuePresent
                            ? Number(
                                selectedCSR.Business?.[0]?.businessValuePresent
                              ).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="border p-2 print:p-1">
                          {selectedCSR.Business?.[0]?.businessValueExpected
                            ? Number(
                                selectedCSR.Business?.[0]?.businessValueExpected
                              ).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="border p-2 print:p-1">
                          {selectedCSR.Business?.[0]?.businessValueAddition
                            ? Number(
                                selectedCSR.Business?.[0]?.businessValueAddition
                              ).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {selectedCSR.Business?.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2 print:mb-0">
                  {/* Heading */}
                  <h3 className="text-xl font-bold mb-4 col-span-full print:mb-2 print:text-[14px]">
                    Business Details
                  </h3>

                  {/* Business Info Table */}
                  <table className="min-w-full table-auto border-collapse border border-gray-300 text-center text-sm print:text-[12px]">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th colSpan={2} className="p-2 border text-center">
                          Activity Info
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCSR.Business.map((business, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td className="p-1 border">Required Date</td>
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
                  <table className="min-w-full table-auto border-collapse border border-gray-300 text-center text-sm print:text-[12px]">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th colSpan={2} className="p-2 border text-center">
                          Financial Summary
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCSR.Business.map((business, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td className="p-1 border">ROI</td>
                            <td className="p-1 border">
                              {business.roi || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 border">Exp. Total Business</td>
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

              {(selectedCSR.chemists?.length > 0 ||
                selectedCSR.ledgerSummary?.length > 0) && (
                <div className="flex flex-col md:flex-row gap-4 mb-6 print:flex-row print:gap-2 print:mb-0 text-center print:text-center">
                  {/* Chemists Table */}
                  {selectedCSR.chemists?.length > 0 && (
                    <div className="w-full md:w-1/2 print:w-1/2">
                      <h3 className="text-xl font-bold mb-4 print:mb-2 print:text-[14px]">
                        Chemists
                      </h3>
                      <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm print:text-[12px]">
                        <thead>
                          <tr className="bg-gray-100 text-gray-600">
                            <th className="p-1 border">Name</th>
                            <th className="p-1 border">Business Share</th>
                            <th className="p-1 border">Other Doctors</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCSR.chemists.map((chemist, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-1 border">
                                {chemist.chemistName || "N/A"}
                              </td>
                              <td className="p-1 border">
                                {chemist.businessShare || "N/A"}
                              </td>
                              <td className="p-1 border">
                                {chemist.otherDoctors || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Ledger Summary Table */}
                  {selectedCSR.ledgerSummary?.length > 0 && (
                    <div className="w-full md:w-1/2 print:w-1/2">
                      <h3 className="text-xl font-bold mb-4 print:mb-2 print:text-[14px]">
                        Ledger Summary
                      </h3>
                      <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm print:text-[12px]">
                        <thead>
                          <tr className="bg-gray-100 text-gray-600">
                            <th className="p-1 border">Month</th>
                            <th className="p-1 border">Sale</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCSR.ledgerSummary.map((summary, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-1 border">
                                {summary.month || "N/A"}
                              </td>
                              <td className="p-1 border">
                                {summary.sale
                                  ? Number(summary.sale).toLocaleString()
                                  : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Instructions & Comments Section */}
              <div className="w-full md:w-1/2 print:w-full mt-4">
                <h3 className="text-xl font-bold mb-4 print:mb-2 print:text-[14px]">
                  Instructions & Comments
                </h3>
                <div className="border border-gray-300 rounded-md overflow-hidden print:border print:rounded-none">
                  <div className="flex border-b border-gray-200">
                    <div className="w-1/3 bg-gray-100 p-2 text-gray-800 text-sm print:text-[12px]">
                      Investment Instructions:
                    </div>
                    <div className="w-2/3 p-2 text-gray-700 text-sm print:text-[12px]">
                      {selectedCSR.investmentInstructions || "N/A"}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/3 bg-gray-100 p-2 text-sm print:text-[12px] text-gray-800">
                      Comments:
                    </div>
                    <div className="w-2/3 p-2 text-gray-700 text-sm print:text-[12px]">
                      {selectedCSR.comments || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="flex flex-wrap justify-between gap-y-8 mt-8">
                {["sm", "gm", "pm", "md"].map((role) => {
                  const approver = selectedCSR?.approvedBy?.[role];
                  return (
                    <div
                      key={role}
                      className="flex flex-col items-start w-64 relative"
                    >
                      {/* Approval Label Above Line */}
                      {approver && (
                        <span className="absolute -top-5 text-sm text-green-700 font-semibold">
                          Approved by {role.toUpperCase()} - {approver.name}
                        </span>
                      )}

                      {/* Signature Line */}
                      <div className="w-full border-b border-gray-400 h-6"></div>

                      {/* Role Label */}
                      <p className="mt-2 text-sm text-gray-700 font-medium">
                        {role.toUpperCase()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SSMpage;
