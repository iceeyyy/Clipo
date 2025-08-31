import { NextResponse,NextRequest } from "next/server"
import User from "../../../../../models/User";
import { dbConnect } from "../../../../../lib/db";

export async function POST (request: NextRequest) {
    try{
        const {email, password} = await request.json();

        if(!email || !password) {
            return NextResponse.json(
                {message:"Email and password are required"}, 
                {status:400}
            );
        }

        await dbConnect(); // Ensure the database connection is established

        const existingUser = await User.findOne({email}); 
        if(existingUser){
            return NextResponse.json(
                {message:"Email already exists"}, 
                {status:400}
            );
        }

        await User.create({
            email,
            password
        })

        return NextResponse.json( 
            {message:"User Created Successfully"},
            {status: 201}
        );
    } 
    catch (error) {
        console.error("Registration error",error);
        return NextResponse.json(
            {message:"Failed to Create User"},
            {status: 500}
        );
    }
}

