import db from '@/lib/db';
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        // Check if the user is authenticated
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse the request body
        const data = await req.json();
        if (!data?.id) {
            return NextResponse.json(
                { message: "Website ID is required" },
                { status: 400 }
            );
        }

        // Delete the website from the database
        await db.website.delete({
            where: {
                id: data.id,
            },
        });

        // Return a success message
        return NextResponse.json(
            { message: "Website deleted successfully" },
            { status: 200 }
        );
    } catch (e) {
        // Handle errors
        console.error("Error deleting website:", e);
        // Handle case where the website does not exist
        if ((e as any).code === "P2025") {
            return NextResponse.json(
                { message: "Website not found" },
                { status: 404 }
            );
        }

        // Handle other errors
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}