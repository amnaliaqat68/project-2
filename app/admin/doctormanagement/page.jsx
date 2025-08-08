'use client'
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

  const getRelationshipColor = (relationship) => {
    switch (relationship) {
      case "strong":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "new":
        return "bg-blue-100 text-blue-800";
      case "weak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Doctors
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.length}
                </p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Relationships
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.filter((d) => d.status === "active").length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Commitments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.reduce(
                    (sum, d) => sum + (d.totalCommitments || 0),
                    0
                  )}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {doctors
                    .reduce((sum, d) => sum + (Number(d.totalValue) || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Doctor Database</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              {["admin", "gm"].includes(userRole) && (
                <Button
                  onClick={() => setShowDrawer(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Add Doctors +
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto print-area">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Speciality</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Full Adress/clinic</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor._id} className="hover:bg-gray-50">
                    <TableCell>
                      <p className="font-medium text-gray-900">{doctor.name}</p>
                    </TableCell>
                    <TableCell>{doctor.speciality}</TableCell>
                    <TableCell>{doctor.district}</TableCell>
                    <TableCell>
                      <div className="text-sm">
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
                    <TableCell>
                      <span className="text-sm">{doctor.group}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{doctor.address}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getRelationshipColor(doctor.relationship)}
                      >
                        {doctor.relationship}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(doctor.status)}>
                        {doctor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {(userRole.includes("Admin") ||
                          userRole.includes("GM")) && (
                          <Button
                            onClick={() => handleDelete(doctor._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {showDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="relative ml-auto w-full max-w-xl h-full bg-white shadow-xl z-50 p-6 overflow-y-auto">
            <button
              onClick={() => setShowDrawer(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              ✖
            </button>
            <AddDoctorForm />
          </div>
        </div>
      )}
    </div>
  );
}
