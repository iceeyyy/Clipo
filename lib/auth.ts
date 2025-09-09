import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import User from "../models/User";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials:{
        email: {label:"Email",type:"text"},
        password: {label:"Password",type:"password"}
    },
    async authorize(credentials) {

        if(!credentials?.email|| credentials?.password) {
            throw new Error("Email and Password are required");
        }

        try{
            await dbConnect(); // Ensure the database connection is established
            const user = await User.findOne({email:credentials.email}) //check if user exists

            if(!user){
                throw new Error("No user found with the given email"); 
            }

            const isValid = await bcrypt.compare(credentials.password, user.password); //compare the password with hashed password stored in db

            if(!isValid){
                throw new Error("Incorrect password");
            } 
            return{
                id: user._id.toString(),
                email: user.email
            }
        }
        catch(error){
            console.error("Authorize error",error);
            throw error
        }
    }
    })
  ],
  callbacks: {
    //once user is authenticated, this callback is called
    //override for changes in token
    async jwt({token,user}){
        if(user){
            token.id = user.id;
        }
        return token;
    }, 
    //override for changes in session
    async session({session,token}){
        if(session.user){
            session.user.id = token.id as string;
        }
        return session;
    }  
  },
  pages:{
        signIn: "/auth/login",
        error: "/auth/login"  //Error code passed in query string as ?error=
    },
    session:{
        strategy: "jwt",
        maxAge: 30*24*60*60 //30 days

    },
    secret: process.env.NEXTAUTH_SECRET,
};