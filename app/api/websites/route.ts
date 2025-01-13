import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const websiteschema = z.object({
    name: z.string().min(1).max(100),
    url: z.string().url(),
})
export async function Post(req:NextRequest){
    try{
        const session = await getServerSession();
        if(!session?.user?.email){
            return NextResponse.json({
                message:"unauthorized"
            })
        }
        else{
            const data = websiteschema.parse(await req.json());
            if(!data){
                return NextResponse.json({
                    message:"enter the right data"
                })
            }
            else{
                await db.website.create({
                    data:{
                        name:data.name,
                        url:data.url
                    }
                })
            }
        }
    }
    catch(e){}
}