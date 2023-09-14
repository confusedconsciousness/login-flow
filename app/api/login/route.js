import { connectToDB } from "@/helpers/mongoose";
import { NextResponse } from "next/server";
import User from "@/models/user.models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
  await connectToDB();
  try {
    const body = await request.json();
    console.log(body);
    const { email, password } = body;
    // check if the user already exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exists" },
        { status: 400 },
      );
    }

    // check if the password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 },
      );
    }

    // after we verified the user is valid, we can create a JWT token and return it to the user cookies
    // first create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // create a next response
    const response = NextResponse.json({
      message: "Logged in successfully",
      success: true,
    });
    // set this token in the user cookies
    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
