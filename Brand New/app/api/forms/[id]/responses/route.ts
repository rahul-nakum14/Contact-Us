import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { db } = await connectToDatabase()

    // Check if form exists and belongs to user
    const form = await db.collection("forms").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    })

    if (!form) {
      return NextResponse.json({ message: "Form not found or unauthorized" }, { status: 404 })
    }

    // Get responses
    const responses = await db.collection("responses").find({ formId: id }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(responses)
  } catch (error) {
    console.error("Error fetching responses:", error)
    return NextResponse.json({ message: "An error occurred while fetching responses" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { data } = await req.json()
    const { db } = await connectToDatabase()

    // Check if form exists and is published
    const form = await db.collection("forms").findOne({
      _id: new ObjectId(id),
      isPublished: true,
    })

    if (!form) {
      return NextResponse.json({ message: "Form not found or not available" }, { status: 404 })
    }

    // Check if form has expired
    if (form.expiresAt && new Date(form.expiresAt) < new Date()) {
      return NextResponse.json({ message: "This form has expired" }, { status: 400 })
    }

    // Create response
    const response = {
      formId: id,
      data,
      createdAt: new Date(),
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    }

    await db.collection("responses").insertOne(response)

    return NextResponse.json({ message: "Response submitted successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error submitting response:", error)
    return NextResponse.json({ message: "An error occurred while submitting your response" }, { status: 500 })
  }
}

