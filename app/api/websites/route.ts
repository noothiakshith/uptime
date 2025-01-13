import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for validating website data
const websiteschema = z.object({
    name: z.string().min(1).max(100),
    url: z.string().url(),
});

// POST: Add a new website
export async function POST(req: NextRequest) {
    try {
        // Check if the user is authenticated
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Validate the request body
        const data = websiteschema.parse(await req.json());
        if (!data) {
            return NextResponse.json(
                { message: "Invalid input" },
                { status: 400 }
            );
        }

        // Create the website in the database
        const website = await db.website.create({
            data: {
                name: data.name,
                url: data.url,
            },
        });

        // Return the created website
        return NextResponse.json(website, { status: 201 });
    } catch (e) {
        // Handle validation errors
        if (e instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Validation error", errors: e.errors },
                { status: 400 }
            );
        }

        // Handle other errors
        console.error("Error creating website:", e);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET: Fetch all websites
export async function GET(req: NextRequest) {
    try {
        // Check if the user is authenticated
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Fetch all websites from the database
        const websites = await db.website.findMany();

        // Return the list of websites
        return NextResponse.json(websites, { status: 200 });
    } catch (e) {
        // Handle errors
        console.error("Error fetching websites:", e);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}