import { NextResponse } from "next/server";
import CSRfom from "@/app/model/CSRfom";
import connectDB from "@/app/config/db";

import { NextResponse } from "next/server";
import CSRfom from "@/app/model/CSRfom";
import connectDB from "@/app/config/db";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const district = searchParams.get("district");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  let filter = { adminStatus: "completed" };

  if (startDate && endDate) {
    filter.executeDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  try {
    let data = await CSRfom.find(filter)
      .lean()
      .populate({
        path: "doctorId",
        select: "name speciality address brick district zone group",
      });

    console.log("All doctor districts:", data.map(d => d.doctorId?.district));

    // ✅ Apply district filter after populate
    if (district) {
      data = data.filter(
        item =>
          item.doctorId &&
          item.doctorId.district &&
          item.doctorId.district.toLowerCase() === district.toLowerCase()
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error fetching data", { status: 500 });
  }
}
