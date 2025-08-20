import { NextResponse } from "next/server";
import CSRfom from "@/app/model/CSRfom";
import connectDB from "@/app/config/db";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const zone = searchParams.get("zone");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  let filter = {};

  //  if (zone) {
  //   filter["doctorId.zone"] = new RegExp(`^${zone}$`, "i");
  // }

  if (zone && startDate && endDate) {
    filter = {
      $or: [
        { "doctorId.zone": new RegExp(`^${zone}$`, "i") },
        { executeDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
      ],
    };
  } else if (zone) {
    filter = { "doctorId.zone": new RegExp(`^${zone}$`, "i") };
  } else if (startDate && endDate) {
    filter = {
      executeDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };
  }
  if (startDate && endDate) {
    filter.executeDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  try {
    const data = await CSRfom.find(filter)
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

// import { NextResponse } from "next/server";
// import CSRfom from "@/app/model/CSRfom";
// import connectDB from "@/app/config/db";

// export async function GET(req) {
//   await connectDB();
//   const { searchParams } = new URL(req.url);
//   const zone = searchParams.get("zone");
//   const startDate = searchParams.get("startDate");
//   const endDate = searchParams.get("endDate");

//   // Build date filter (on CSRform)
//   let dateFilter = {};
//   if (startDate && endDate) {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     end.setHours(23, 59, 59, 999); // inclusive end
//     if (!isNaN(start) && !isNaN(end)) {
//       dateFilter.executeDate = { $gte: start, $lte: end };
//     }
//   }

//   const zoneRegex = zone ? new RegExp(`^${zone}$`, "i") : null;

//   let data;

//   if (zone && startDate && endDate) {
//     // OR logic: (zone) OR (date range)
//     const dateMatches = await CSRfom.find(dateFilter)
//       .populate("doctorId", "name speciality address brick district zone group")
//       .lean();

//     const zoneMatchesRaw = await CSRfom.find({})
//       .populate({
//         path: "doctorId",
//         select: "name speciality address brick district zone group",
//         match: { zone: zoneRegex },
//       })
//       .lean();
//     const zoneMatches = zoneMatchesRaw.filter(d => d.doctorId);

//     const seen = new Set();
//     data = [...dateMatches, ...zoneMatches].filter(doc => {
//       const id = String(doc._id);
//       if (seen.has(id)) return false;
//       seen.add(id);
//       return true;
//     });
//   } else if (zone) {
//     // Only zone
//     const zoneMatchesRaw = await CSRfom.find({})
//       .populate({
//         path: "doctorId",
//         select: "name speciality address brick district zone group",
//         match: { zone: zoneRegex },
//       })
//       .lean();
//     data = zoneMatchesRaw.filter(d => d.doctorId);
//   } else if (startDate && endDate) {
//     // Only dates
//     data = await CSRfom.find(dateFilter)
//       .populate("doctorId", "name speciality address brick district zone group")
//       .lean();
//   } else {
//     // No filters
//     data = await CSRfom.find({})
//       .populate("doctorId", "name speciality address brick district zone group")
//       .lean();
//   }

//   return NextResponse.json(data);
// }
