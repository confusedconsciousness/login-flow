import { connectToDB } from "@/helpers/mongoose";
import { NextResponse } from "next/server";
import User from "@/models/user.models";
import bcrypt from "bcrypt";

export async function POST(request) {
  await connectToDB();

  try {
    const body = await request.json();
    const { username, email, password } = body;
    // let's check if the user already exists, if that's case we don't want to create a duplicate user
    const user = User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // hash the password, you don't want to save it as a plain text
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // save the user
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    return NextResponse.json(
      { message: "User created successfully", success: true, savedUser },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return request;
}
