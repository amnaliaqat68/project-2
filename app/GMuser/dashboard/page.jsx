"use client";

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
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
                    label: "District",
                    value: selectedCSR.doctorId?.district,
                  },
                  {
                    label: "Full Address",
                    value: selectedCSR.doctorId?.address,
                  },
                  { label: "Brick", value: selectedCSR.doctorId?.brick },
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
                        <th className="p-2 border">
                          Business Value (Expected)
                        </th>
                        <th className="p-2 border">
                          Business Value (Addition)
                        </th>
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
      </main>
    </div>
  );
};

export default GMpage;
