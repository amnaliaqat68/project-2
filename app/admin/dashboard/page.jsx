"use client";

import { useState, useEffect } from "react";

import {
  FileText,
  Users,
  TrendingUp,
  User,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Edit,
} from "lucide-react";
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
import CreateUserpage from "../createUser/page";
import DoctorManagement from "../doctormanagement/page";
import ExecuteCSRPage from "../executeForm/[id]/page";
import CSRReportsTab from "../reports/page";
import { toast } from "react-toastify";

export default function Admin() {
  const [userRole, setUserRole] = useState("Admin");
  const [user, setUser] = useState(null);
  const [showcreateUser, setShowcreateUser] = useState(false);
  const [totalCSR, settotalCSR] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [csrList, setCsrList] = useState([]);
  const [selectedCSR, setSelectedCSR] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const [stats, setStats] = useState({
    totalCSR: 0,
    completedThisMonth: 0,
    totalDoctors: 0,
  });

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
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/auth/getDSMusers", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };
  useEffect(() => {
    const fetchCSR = async () => {
      const res = await fetch("/api/csrInfo/getadminCSR");
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
        const activeDoctors = data.filter((doc) => doc.isDeleted === false);
        setDoctors(activeDoctors);
      }
    };
    fetchDoctors();
  }, []);
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

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/auth/deleteUser/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
      } else {
        toast.error("failed to delete users.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-indigo-100 to-teal-100">
      {/* Header */}
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

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {userRole}
          </h2>
          <p className="text-gray-600">
            Manage your pharmaceutical sales requests and track doctor
            commitments
          </p>
        </div>

        {/* Stats Cards */}
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

          <Card className="border-l-4 border-l-teal-500">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Execution This month</p>
                  <p className="text-2xl font-bold">
                    {stats.completedThisMonth}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full max-w-3xl grid-cols-5">
              <TabsTrigger value="dashboard">User Management</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="csrs">Approved CSRs</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {userRole === "Admin" && (
              <Button
                onClick={() => setShowcreateUser(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Users
              </Button>
            )}
          </div>

          {/* ✅ User Management Tab */}
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Users Database</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && <p className="text-red-500">{error}</p>}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user._id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {user.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {user._id}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {user.phone}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span className="text-sm">
                                  {user.designation}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {user.area}
                              </div>
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  onClick={() => deleteUser(user._id)}
                                  variant="outline"
                                  size="sm"
                                >
                                  Delete
                                </Button>
                                {userRole === "Admin" && (
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6">
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ✅ Doctors Tab */}
          <TabsContent value="doctors">
            <DoctorManagement />
          </TabsContent>
          <TabsContent value="csrs">
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

                          <Button
                            variant="default"
                            onClick={() => {
                              console.log("Navigating to:", csr._id);
                              router.push(`/admin/executeForm/${csr._id}`);
                            }}
                            className="bg-green-500 hover:bg-blue-700 text-white"
                          >
                            Execute
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
          <TabsContent value="reports">
            <CSRReportsTab />
          </TabsContent>
        </Tabs>

        {/* Drawer for Create User */}
        {showcreateUser && (
          <div className="fixed inset-0 z-50 flex">
            <div className="relative ml-auto w-full max-w-xl h-full bg-white shadow-xl z-50 p-6 overflow-y-auto">
              <button
                onClick={() => setShowcreateUser(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
              >
                ✖
              </button>
              <CreateUserpage />
            </div>
          </div>
        )}

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
}
