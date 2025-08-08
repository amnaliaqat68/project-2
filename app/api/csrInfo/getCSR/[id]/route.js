import { NextResponse } from "next/server";
import dbConnect from '../../../../config/db.js'
import CSRfom from "@/app/model/CSRfom.js";



export async function GET(req, { params }) {
  await dbConnect();
  try {
    const csr = await CSRfom.findById(params.id)
      .populate("creatorId")
      .populate("doctorId");
    if (!csr) {
      return new NextResponse(JSON.stringify({ message: "Not found" }), { status: 404 });
    }
    return new NextResponse(JSON.stringify(csr), { status: 200 });
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
