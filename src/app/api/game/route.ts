import { db } from "@/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function GET() {
  const data = await db.query.games.findMany({
    with: {
      categories: {
        columns: {},
        with: {
          category: {
            columns: {
              name: true,
            },
          },
        },
      },
      platforms: {
        columns: {},
        with: {
          platform: {
            columns: {
              name: true,
            },
          },
        },
      },
      media: {
        columns: {
          mediaType: true,
          mediaUrl: true,
        },
      },
    },
  });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const schema = z.object({
    title: z.string(),
    realeaseDate: z.string(),
    images: z.array(z.string().url()),
    categories: z.array(z.string()),
  });

  const req = await request.json();
  const r = schema.safeParse(req);
  if (!r.success) {
    const { errors } = r.error;
    return new Response("Invalid Data Format", {
      status: 400,
    });
  }
  const { title, images, realeaseDate, categories } = req;
  return NextResponse.json({ title, images, realeaseDate, categories });
}

export const revalidate = 1;
