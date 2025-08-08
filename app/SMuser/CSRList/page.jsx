"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CSRPrintPage from "../print/[id]/page";

const CSRList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [csrList, setCsrList] = useState([]);
  const router = useRouter();

  const [totalCSR, settotalCSR] = useState([]);
  const [selectedCSR, setSelectedCSR] = useState(null);

  const userRole = "sm";

  useEffect(() => {
    const fetchCSR = async () => {
      const res = await fetch("/api/csrInfo/getCSR");
      const data = await res.json();
      console.log("Fetched CSR Data:", data);
      console.log("Sample CSR:", data[0]);
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
  const openDetails = (csr) => {
    setSelectedCSR(csr);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setSelectedCSR(null);
    setIsModalOpen(false);
  };
  const filteredCSRs = csrList.filter((csr) => {
    const name = csr.doctorId?.name?.toLowerCase() || "";
    const matchesSearch =
      !searchTerm || name.includes(searchTerm.toLowerCase());

    const overallStatus = getOverallStatus(csr);
    const matchesStatus =
      statusFilter === "all" || overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function getOverallStatus(csr) {
    const { smStatus, gmStatus, adminStatus } = csr;

    if ([smStatus, gmStatus, adminStatus].includes("rejected")) {
      return "Rejected";
    }

    if (adminStatus === "completed") {
      return "Completed";
    }

    if (smStatus === "approved" && gmStatus === "approved") {
      return "Waitning for the admin approval";
    }

    return "Pending";
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Service Requests</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search CSRs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Commitment Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCSRs.map((csr) => (
                  <TableRow key={csr._id}>
                    <TableCell>
                      <p className="font-medium text-sm text-muted-foreground">
                        {csr.doctorId?.name || "N/A"}
                      </p>
                    </TableCell>
                    <TableCell>{csr.doctorId?.district || "N/A"}</TableCell>
                    <TableCell>
                      {csr.products?.length > 0
                        ? csr.products
                            .map((product) => product.product)
                            .join(", ")
                        : "No Products"}
                    </TableCell>
                    <TableCell>
                      {csr.Business?.[0]?.exactCost || "N/A"}
                    </TableCell>
                    <TableCell>{getOverallStatus(csr)}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => router.push(`/SMuser/print/${csr._id}`)}
                        className="bg-blue-600 text-white"
                      >
                        Print View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default CSRList;
