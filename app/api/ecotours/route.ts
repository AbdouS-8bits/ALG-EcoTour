import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const tourSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().min(0, "Price must be a positive number"),
    location: z.string().min(3, "Location must be at least 3 characters"),
    maxParticipants: z.number().min(1, "Max Participants must be at least 1"),
});

export async function GET() {
  
try {
  const ecoTours = await prisma.ecoTour.findMany();
  if (ecoTours) {
    return NextResponse.json({ ecoTours }, { status: 200 });
  } else {
    return NextResponse.json({ error: "No tours found" }, { status: 404 });
  }
} catch (error) {
   
   return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
}
export async function POST(req: NextRequest) {

    try {
    const body =  await req.json();
    // Validate input
    const validation = tourSchema.safeParse(body);
    if (!validation.success) {
        const errorMessage = validation.error.issues[0]?.message || "Validation failed";
        return NextResponse.json(
            { error: errorMessage },
            { status: 400 }
        );
    }
    const { title, description, price, location, maxParticipants } = validation.data;

    // Create new tour in database
   const  newTour = await prisma.ecoTour.create({
        data: {
            title,
            description,
            price,
            location,
            maxParticipants,
            photoUrl: "", // Placeholder, can be updated later
        },
    });

  return NextResponse.json(
    {
      success: true,
      message: "Tour created successfully.",
      Tour: {
        id: newTour.id,
        title: newTour.title,
        description: newTour.description,
        price: newTour.price,
        location: newTour.location,
        maxParticipants: newTour.maxParticipants,
        photoUrl: newTour.photoUrl,

      }
    },
    { status: 201 }
  );
    } catch (error) {

    console.error("❌ Tour creation error:", error);
    return NextRequest.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

}