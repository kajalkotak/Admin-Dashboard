// app/api/register/route.ts

import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email;
  const password = body.password;

  const client = await clientPromise;
  const db = client.db("userDB");

  const user = await db.collection("users").findOne({
    email: email,
  });

  if (!user) {
    return Response.json({
      success: false,
      message: "User not found",
    });
  }

  if (user.password !== password) {
    return Response.json({
      success: false,
      message: "Wrong Password",
    });
  }

  return Response.json({
    success: true,
    message: "Login successful",
    user: user,
  });
}
