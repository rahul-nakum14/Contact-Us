import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const forms = await db.collection("forms").find({ userId: session.user.id }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(forms)
  } catch (error) {
    console.error("Error fetching forms:", error)
    return NextResponse.json({ message: "An error occurred while fetching forms" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, fields, style } = await req.json()

    if (!title || !fields || !style) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const form = {
      userId: session.user.id,
      title,
      fields,
      style,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
    }

    const result = await db.collection("forms").insertOne(form)

    return NextResponse.json(
      {
        message: "Form created successfully",
        formId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating form:", error)
    return NextResponse.json({ message: "An error occurred while creating the form" }, { status: 500 })
  }
}

