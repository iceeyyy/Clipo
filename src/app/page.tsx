import Image from "next/image";
import { useEffect, useState } from "react";
import { IVideo } from "../../models/Video";
import { apiClient } from "../../lib/api-client";

export default function Home() {

  const [videos,setVideos] = useState<IVideo[]>([]);

  useEffect(()=>{
    const fetchVideos = async()=>{
      try{
        const data = await apiClient.getVideos();
        setVideos(data);
      }
      catch(error){
        throw new Error("Failed to fetch videos");
      }
    }
    fetchVideos();
  },[]);

  return (
    <div>
      <h1>
        ladu 
      </h1>
    </div>
    
  );
}
