import { IVideo } from "../models/Video";


export type videoFormData  = Omit<IVideo,"_id">
interface fetchOptions{
    method?: "GET"| "POST"|"PUT"|"DELETE";
    body?: any;
    headers?: Record<string,string>; //key value pair
}
class ApiClient {
    private async myFetch<T>(
        endpoint: string,
        options: fetchOptions ={}
    ):Promise<T>{
        const {method="GET",body,headers={}}=options;

        const defaultHeaders={
            "Content-Type":"application/json",
            ...headers
        }

        const res = await fetch(`/api${endpoint}`,{
            method,
            headers:defaultHeaders,
            body: body ? JSON.stringify(body):null
        });
        if(!res.ok){
            throw new Error(await res.text());
        }
        return res.json() as Promise<T>;
    }

    async getVideos(){
        return this.myFetch<IVideo[]>("/videos");
    }

    async getAVideo(id:string){
        return this.myFetch<IVideo>(`/videos/${id}`); // for single video
    }

    async createVideo(videoData: videoFormData){
        return this.myFetch<IVideo>("/videos",{
            method:"POST",
            body:videoData
        });
    }
}


export const apiClient = new ApiClient();