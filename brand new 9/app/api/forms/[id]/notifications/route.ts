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

    const notifications = await db.collection("notifications").find({ formId: id }).toArray()

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ message: "An error occurred while fetching notifications" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { notifyOnSubmission } = await req.json()
    const { db } = await connectToDatabase()

    // Check if form exists and belongs to user
    const form = await db.collection("forms").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    })

    if (!form) {
      return NextResponse.json({ message: "Form not found or unauthorized" }, { status: 404 })
    }

    // Update form notification settings
    await db.collection("forms").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          notifyOnSubmission,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Notification settings updated successfully" })
  } catch (error) {
    console.error("Error updating notification settings:", error)
    return NextResponse.json({ message: "An error occurred while updating notification settings" }, { status: 500 })
  }
}

