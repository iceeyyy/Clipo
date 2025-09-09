import { stat } from "fs";
import { dbConnect } from "../../../../lib/db";
import Video, { IVideo } from "../../../../models/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function GET() {
    try{
        await dbConnect();
        const videos = await Video.find({}).sort({createdAt:-1}).lean(); //lean method is used to convert mongoose documentst to plain js objects which optimizes db query performance

        if(!videos || videos.length===0){
            return  NextResponse.json([],{status:200});
        }
        return NextResponse.json(videos,{status:200}); 
    }
    catch(err){
        return NextResponse.json(
            {error:"Failed to fetch videos"},
            {status:500}
        );
    }
}
export async function POST(request:NextRequest){ 
    try{
        const session= await getServerSession(authOptions);

        if(!session){
            return NextResponse.json({error:"Unauthorized"},{status:401}); //session is only created when user is logged in
        }
        await dbConnect();

        const body:IVideo = await request.json();

        if(!body.title || !body.videoUrl || !body.thumbnailUrl|| !body.description){
            return NextResponse.json({error:"Missing required fields"},{status:400});
        }

        const videoData={
            ...body,
            controls: body.controls ?? true,
            transformation:{
                width: body.transformation?.width || 1080,
                height: body.transformation?.height || 1920,
                quality: body.transformation?.quality || 100
            }
        }

        const newVideo=Video.create(videoData);

        return NextResponse.json(newVideo,{status:201});

    }
    catch(error){
        return NextResponse.json(
            {error:"Failed to create a video"},
            {status:500}
        );
    }

}