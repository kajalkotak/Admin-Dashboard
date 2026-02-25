// app/api/register/route.ts

import clientPromise from "@/lib/mongodb";


// ---------- POST ----------

export async function POST(request: Request) {

  try {

    const body = await request.json();

    const client = await clientPromise;

    const db = client.db("userDB");

    const result = await db.collection("users").insertOne({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    return Response.json({
      success: true,
      message: "User registered",
      result
    });

  } catch (error) {

    return Response.json({
      success: false,
      message: "Error",
      error
    });

  }

}



// ---------- GET ----------

export async function GET() {

  try {

    const client = await clientPromise;

    const db = client.db("userDB");

    const users = await db.collection("users").find().toArray();

    return Response.json(users);

  } catch (error) {

    return Response.json({
      success: false,
      error
    });

  }

}
