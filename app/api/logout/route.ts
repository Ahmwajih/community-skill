import { NextResponse, NextRequest } from "next/server";
import { auth as firebaseAuth } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "No token found. You are already logged out.", success: false },
        { status: 400 }
      );
    }

    // Clear Firebase session (if using Firebase authentication)
    try {
      await firebaseAuth.signOut();
    } catch (err) {
      console.warn("Error during Firebase logout:", err.message);
    }

    // Remove the cookie
    const response = NextResponse.json(
      { message: "Logout successful", success: true },
      { status: 200 }
    );
    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "An error occurred during logout.", success: false, error: error.message },
      { status: 500 }
    );
  }
}