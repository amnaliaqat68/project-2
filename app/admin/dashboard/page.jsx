"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";

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
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
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
import SummaryPage from "../nationalSummary/page";
import getFilterPage from "../fetFilter/page";

export default function Admin() {
  const [userRole, setUserRole] = useState("Admin");
  const [user, setUser] = useState(null);
  const [showcreateUser, setShowcreateUser] = useState(false);
  const [totalCSR, settotalCSR] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [csrList, setCsrList] = useState([]);
  const [selectedCSR, setSelectedCSR] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [ district, setDistrict] = useState("");
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [stats, setStats] = useState({
    totalCSR: 0,
    completedThisMonth: 0,
    totalDoctors: 0,
  });

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

//   const fetchFilteredReports = async () => {
//   setLoading(true);
//   try {
//     const res = await fetch(
//       `/api/csrInfo/getFilteredCSR?region=${region}&startDate=${startDate}&endDate=${endDate}`
//     );
//     const data = await res.json();
//    console.log("Applied filters:", { region, startDate, endDate });
//     setReports(data);
//   } catch (err) {
//     console.error("Fetch failed", err);
//   }
//   setLoading(false);
// };
const handleSearch = () => {
  router.push(
    `/admin/fetFilter?district=${district}&startDate=${startDate}&endDate=${endDate}`
  );
};

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-indigo-100 to-teal-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-3 sm:py-0 space-y-3 sm:space-y-0">
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
              <div className="flex items-center gap-1 text-sm sm:text-base">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <TabsList
              className=" flex overflow-x-auto md:grid w-full md:max-w-3xl
    md:grid-cols-5 gap-1 scrollbar-hide"
            >
              <TabsTrigger
                value="dashboard"
                className="flex-shrink-0 whitespace-nowrap  md:w-full text-center"
              >
                User Management
              </TabsTrigger>
              <TabsTrigger
                value="doctors"
                className="flex-shrink-0 whitespace-nowrap  md:w-full text-center"
              >
                Doctors
              </TabsTrigger>
              <TabsTrigger
                value="csrs"
                className="flex-shrink-0 whitespace-nowrap  md:w-full text-center"
              >
                CSRs
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex-shrink-0 whitespace-nowrap  md:w-full text-center"
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex-shrink-0 whitespace-nowrap  md:w-full text-center"
              >
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ✅ User Management Tab */}
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Users Database</span>
                  <div className="flex justify-end mb-1">
                    {userRole === "Admin" && (
                      <Button
                        onClick={() => setShowcreateUser(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Create Users +
                      </Button>
                    )}
                  </div>
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
                                  className="bg-white hover:bg-blue-700 text-black border-gray"
                                >
                                  Delete
                                </Button>
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
            <Tabs defaultValue="list" className="space-y-2">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="approved">Approved CSRs</TabsTrigger>
                <TabsTrigger value="completed">Completed CSRs</TabsTrigger>
              </TabsList>
              <TabsContent value="approved">
                <section className="mt-2">
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
                                onClick={() => setSelectedCSR(csr)}
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
              <TabsContent value="completed">
                <CSRReportsTab />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="reports">
            <Tabs defaultValue="reportList">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="nationalSummary">
                  National Summary
                </TabsTrigger>
                <TabsTrigger value="comingSoon">Coming Soon</TabsTrigger>
              </TabsList>
              <TabsContent value="nationalSummary">
                <Card className="p-4 space-y-4">
                  <h2 className="text-lg font-bold">Filter National Summary</h2>

                  {/* Filter Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Region */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Region
                      </label>
                      <select
                        className="w-full border rounded-md p-2"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      >
                         <option value="">Select Area</option>
              <option value="multan">Multan</option>
              <option value="faisalabad">Faisalabad</option>
              <option value="karachi">Karachi</option>
              <option value="lahore">Lahore</option>
              <option value="abbottabad">Abbottabad</option>
              <option value="sheikhupura">Sheikhupura</option>
              <option value="kasur">Kasur</option>
              <option value="dgk">DGK</option>
              <option value="jampur">Jampur</option>
              <option value="layyah">Layyah</option>
              <option value="ryk">RYK</option>
              <option value="bhp">BHP</option>
              <option value="khanewal">Khanewal</option>
              <option value="sargodha">Sargodha</option>
              <option value="chiniot">Chiniot</option>
              <option value="peshawar">Peshawar</option>
              <option value="charsadda">Charsadda</option>
              <option value="mardan">Mardan</option>
              <option value="nowshera">Nowshera</option>
              <option value="swat">Swat</option>
              <option value="sahiwal">Sahiwal</option>
              <option value="timergara">Timergara</option>
              <option value="burewala">Burewala</option>
              <option value="bhakkar">Bhakkar</option>
              <option value="jhang">Jhang</option>
              <option value="toba">Toba</option>
              <option value="gojra">Gojra</option>
              <option value="gujranwala">Gujranwala</option>
              <option value="sialkot">Sialkot</option>
                      </select>
                    </div>

                    {/* From Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        From Date
                      </label>
                      <input
                        type="date"
                        className="w-full border rounded-md p-2"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    {/* To Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        To Date
                      </label>
                      <input
                        type="date"
                        className="w-full border rounded-md p-2"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <Button 
                   onClick={ handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white">
                    Search
                  </Button>
                </Card>

                {/* Results */}
                <div className="mt-4">
                  {loading ? (
                    <p>Loading...</p>
                  ) : reports.length > 0 ? (
                    <SummaryPage data={reports} />
                  ) : (
                    <p className="text-gray-500">No results found.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
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

        {selectedCSR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[80%] h-[90%] overflow-y-auto rounded-lg shadow-lg p-6 relative">
              {/* Header Buttons */}
              <div className="flex justify-between items-center mb-4  top-0 bg-white p-2 z-10">
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
                <div className="hidden print:flex items-center justify-between mb-4 border-b pb-2">
                  <div className="text-xs font-bold text-gray-700">
                    <p>CSR #</p>
                    <p>{selectedCSR.csrNumber}</p>
                  </div>

                  <div className="text-lg font-bold text-center uppercase flex-1">
                    Customer Service Request
                  </div>

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
                                {first?.sale != null
                                  ? Number(first.sale).toLocaleString()
                                  : ""}
                                {first?.sale || ""}
                              </td>
                              <td className="border text-[9px] p-1">
                                {second?.month || ""}
                              </td>
                              <td className="border text-[9px] p-1">
                                {second?.sale != null
                                  ? Number(second.sale).toLocaleString()
                                  : ""}
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
}
