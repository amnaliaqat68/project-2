import connectDB from "../../../config/db.js";
import Doctor from "../../../model/addDoctor.js";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  try {
    await connectDB();
    const body = await req.json();

    const updatedDoc = await Doctor.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedDoc) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Doctor updated successfully", doctor: updatedDoc },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
