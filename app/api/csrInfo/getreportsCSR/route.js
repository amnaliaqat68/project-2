import { NextResponse } from "next/server";

import CSRfom from "@/app/model/CSRfom";

import connectDB from "@/app/config/db";

export async function GET() {
  await connectDB();

  try {
    const data = await CSRfom.find({ adminStatus: "completed" })
      .lean()
      .populate(
        "doctorId",
        "name speciality address brick district zone group"
      );
    return Response.json(data);
  } catch (error) {
    return new Response("Error fetching data", { status: 500 });
  }
}
