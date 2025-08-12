"use client";

import { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import CSRList from "../CSRList/page";
import Image from "next/image";
import DoctorManagement from "../../admin/doctormanagement/page";

const SMpage = () => {
  const [userRole, setUserRole] = useState("dsm");
  const [user, setUser] = useState(null);

  const [createdCSR, setCreatedCSR] = useState(false);
  const [totalCSR, settotalCSR] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [stats, setStats] = useState({
    totalCSR: 0,
    completedThisMonth: 0,
    totalDoctors: 0,
  });
  const router = useRouter();

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
        toast.success("Logout successful!");
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-3 h-auto py-3 sm:h-16">
            {/* Logo + Title */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                <img src="/Medlife logo.png" alt="logo" />
              </div>
              <h1 className="text-[12px] sm:text-xl font-bold text-gray-900">
                MedLife CSR
              </h1>
            </div>
            {/* User Info + Logout */}
            <div className="flex items-center gap-1">
              <Button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center w-[80px]
             px-1 py-1 text-[12px] sm:px-4 sm:py-2 sm:text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Logout
              </Button>
              <User className="w-5 h-5 text-gray-500" />
              <div className="text-sm sm:text-base">
                {user ? ` ${user.name}!` : "Loading..."}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {userRole}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your pharmaceutical sales requests and track doctor
            commitments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total CSRs</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {totalCSR.length}
                  </p>
                </div>
                <FileText className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {stats.completedThisMonth}
                  </p>
                </div>
                <CheckCircle className="w-6 sm:w-8 h-6 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Total Doctors
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {doctors.length}
                  </p>
                </div>
                <Users className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <TabsList className="grid grid-cols-3 w-full sm:max-w-xs text-xs sm:text-sm">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="csrs">CSRs</TabsTrigger>
            </TabsList>

            {userRole === "dsm" && (
              <Button
                onClick={() => router.push("/SMuser/CreatedCSR")}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create CSR
              </Button>
            )}
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      Empower Your{" "}
                      <span className="text-blue-600">Pharma Sales</span>{" "}
                      Journey
                    </h2>
                    <p className="text-sm sm:text-lg text-gray-600 mb-6">
                      Streamline CSR requests, manage doctor commitments, and
                      track your sales performance all in one smart platform.
                    </p>
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.pexels.com/photos/7088486/pexels-photo-7088486.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Medical professionals"
                      className="w-full h-56 sm:h-96 object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors">
            <DoctorManagement />
          </TabsContent>

          {/* CSRs Tab */}
          <TabsContent value="csrs">
            <CSRList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SMpage;
