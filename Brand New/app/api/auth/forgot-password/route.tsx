import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { randomBytes } from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user exists
    const user = await db.collection("users").findOne({ email })
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return NextResponse.json(
        { message: "If your email is registered, you will receive a reset link" },
        { status: 200 },
      )
    }

    // Generate a reset token
    const resetToken = randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save the reset token to the database
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        },
      },
    )

    // Get the base URL for the reset link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Send the reset email
    await sendPasswordResetEmail(email, resetToken, baseUrl)

    return NextResponse.json({ message: "If your email is registered, you will receive a reset link" })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ message: "An error occurred during password reset" }, { status: 500 })
  }
}

