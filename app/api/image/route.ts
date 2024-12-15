import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import mime from "mime";
import { dbPromise } from "@/lib/database";
import { put } from "@vercel/blob";

const baseFolder = '/uploads'

export async function POST(req: NextRequest) {
    const data = await req.formData();

    const user = data.get("user") as string;

    if (!user) {
        return NextResponse.json(
            { error: "user not provided!" },
            { status: 500 }
        );
    }

    const content = data.get("content") as string || null;
    const image = data.get("image") as File || null;

    const buffer = Buffer.from(await image.arrayBuffer());
    const dir = `${baseFolder}/${new Date(Date.now()).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
    }).replace(/\//g, "-")}`;


    const uploadDir = join(process.cwd(), 'public', dir);

    //Manege folder
    // try {
    //     await stat(uploadDir);
    // } catch (e: any) {
    //     if (e.code === "ENOENT") {
    //         await mkdir(uploadDir, { recursive: true });
    //     } else {
    //         console.error("Error while trying to create directory when uploading a file\n", e);
    //         return NextResponse.json(
    //             { error: "Something went wrong." },
    //             { status: 500 }
    //         );
    //     }
    // }

    //Save file
    try {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniqueName}.${mime.getExtension(image.type)}`
        // await writeFile(`${uploadDir}/${filename}`, buffer);
        const blob = await put(filename, buffer, {
            access: 'public',
        });

        // Save to database
        // const path = `${dir}/${filename}`;
        const db = await dbPromise;

        await db.run(
            'INSERT INTO images (user, path, content, uploaded_at) VALUES (?, ?, ?, ?)',
            user,
            blob,
            content,
            new Date()
        );

        return NextResponse.json(blob);
    } catch (e) {
        console.error("Error while trying to upload a file\n", e);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}