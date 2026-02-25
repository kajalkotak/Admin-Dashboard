// route.ts

// app/api/tasks/route.ts

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ================= GET =================

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db("userTask");

    const tasks = await db.collection("tasks").find().toArray();

    return Response.json(tasks);
  } catch {
    return Response.json([]);
  }
}

// ================= POST =================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const client = await clientPromise;

    const db = client.db("userTask");

    await db.collection("tasks").insertOne({
      task: body.task,

      dueDate: body.dueDate,

      email: body.userEmail,

      completed: false,

      createdAt: new Date(),
    });

    return Response.json({
      success: true,
    });
  } catch {
    return Response.json({
      success: false,
    });
  }
}

// ================= DELETE =================

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const client = await clientPromise;

    const db = client.db("userTask");

    await db.collection("tasks").deleteOne({
      _id: new ObjectId(body.id),
    });

    return Response.json({
      success: true,
    });
  } catch {
    return Response.json({
      success: false,
    });
  }
}

// ================= UPDATE =================

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const client = await clientPromise;

    const db = client.db("userTask");

    await db.collection("tasks").updateOne(
      {
        _id: new ObjectId(body.id),
      },

      {
        $set: {
          completed: body.completed,
        },
      },
    );

    return Response.json({
      success: true,
    });
  } catch {
    return Response.json({
      success: false,
    });
  }
}
  