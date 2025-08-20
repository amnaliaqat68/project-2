"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Edit,
  FileText,
} from "lucide-react";
import AddDoctorForm from "../addDoctors/page";

export default function DoctorManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  // ✅ Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctorsManage/getDoctors", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setDoctors(data);
      } else {
        setError(data.error || "Failed to fetch doctors");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/doctorsManage/DeleteDoc/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Doctor deleted successfully");
        fetchDoctors();
      } else {
        const error = await res.json();
        toast.error(error.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting doctor");
    }
  };
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/userinfo");
      const data = await res.json();
      if (res.ok && data.user?.role) {
        setUserRole(data.user.role);
      } else {
        console.error("Failed to get user role");
      }
    }

    fetchUser();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "potential":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"></div>

      {/* Search + Add Button */}
      <div className="bg-white rounded-md ">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 ">
            <span className="text-lg sm:text-xl">Doctor Database</span>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex items-center border rounded-md px-2 w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none focus:ring-0 text-sm w-full"
                />
              </div>
              {["admin", "gm"].includes(userRole) && (
                <Button
                  onClick={() => setShowDrawer(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Add Doctors +
                </Button>
              )}
             
            </div>
          </CardTitle>
        </CardHeader>

        {/* Table */}
        <div className="overflow-x-auto print-area m-2">
          <Table className="min-w-full text-xs sm:text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Speciality</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Group</TableHead>
                <TableHead className="hidden xl:table-cell whitespace-normal break-words">
                  Address
                </TableHead>
                <TableHead className="hidden xl:table-cell">
                  investment
                </TableHead>
                <TableHead className="hidden xl:table-cell">Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor._id} className="hover:bg-gray-50">
                  <TableCell className="whitespace-nowrap">
                    {doctor.name}
                  </TableCell>
                  <TableCell>{doctor.speciality}</TableCell>
                  <TableCell>{doctor.district}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs sm:text-sm">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{doctor.contact}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{doctor.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {doctor.group}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell whitespace-normal break-words max-w-[200px]">
                    {doctor.address}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {doctor.investmentLastYear
                      ? Number(doctor.investmentLastYear).toLocaleString()
                      : "NA"}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <Badge className={getStatusColor(doctor.status)}>
                      {doctor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {["admin", "gm"].includes(userRole) && (
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(doctor._id)}
                        className="bg-white hover:bg-blue-700 text-black border-gray px-2 py-1 text-xs sm:text-sm"
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                   <TableCell>
                   <Button
                variant="outline"
                onClick={() => {
                  setEditingDoc(doctor);
                  setShowDrawer(true);
                }}
                className="bg-white hover:bg-yellow-500 text-black border-gray px-2 py-1 text-xs sm:text-sm"
              >
                Edit
              </Button>
              </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="relative ml-auto w-full max-w-xl h-full bg-white shadow-xl z-50 p-6 overflow-y-auto">
            <button
              onClick={() => {
                setShowDrawer(false);
                setEditingDoc(null);
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              ✖
            </button>
            <AddDoctorForm
              doctor={editingDoc}
              onSuccess={() => {
                setShowDrawer(false);
                setEditingDoc(null);
                fetchDoctors();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

