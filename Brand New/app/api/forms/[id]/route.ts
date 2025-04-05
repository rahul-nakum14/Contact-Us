import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { db } = await connectToDatabase()

    const form = await db.collection("forms").findOne({ _id: new ObjectId(id) })

    if (!form) {
      return NextResponse.json({ message: "Form not found" }, { status: 404 })
    }

    // Check if this is a public form or if the user owns it
    const session = await getServerSession(authOptions)
    if (!form.isPublished && (!session || session.user.id !== form.userId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error("Error fetching form:", error)
    return NextResponse.json({ message: "An error occurred while fetching the form" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { title, fields, style, isPublished } = await req.json()
    const { db } = await connectToDatabase()

    // Check if form exists and belongs to user
    const form = await db.collection("forms").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    })

    if (!form) {
      return NextResponse.json({ message: "Form not found or unauthorized" }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (title !== undefined) updateData.title = title
    if (fields !== undefined) updateData.fields = fields
    if (style !== undefined) updateData.style = style
    if (isPublished !== undefined) updateData.isPublished = isPublished

    await db.collection("forms").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return NextResponse.json({ message: "Form updated successfully" })
  } catch (error) {
    console.error("Error updating form:", error)
    return NextResponse.json({ message: "An error occurred while updating the form" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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

    // Delete form
    await db.collection("forms").deleteOne({ _id: new ObjectId(id) })

    // Delete all responses for this form
    await db.collection("responses").deleteMany({ formId: id })

    return NextResponse.json({ message: "Form deleted successfully" })
  } catch (error) {
    console.error("Error deleting form:", error)
    return NextResponse.json({ message: "An error occurred while deleting the form" }, { status: 500 })
  }
}

