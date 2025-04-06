import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get("token")
    const email = url.searchParams.get("email")

    if (!token || !email) {
      return NextResponse.json({ valid: false, message: "Missing token or email" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Find user with matching token and email
    const user = await db.collection("users").findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // Token must not be expired
    })

    if (!user) {
      return NextResponse.json({ valid: false, message: "Invalid or expired token" }, { status: 400 })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json({ valid: false, message: "An error occurred during token validation" }, { status: 500 })
  }
}

