import { NextRequest, NextResponse } from "next/server";
import { Novu } from "@novu/node";
const novu = new Novu(process.env.NOVU_API_KEY!);

export async function POST(req: NextRequest) {
    const { email, name, id, image,  } = await req.json();

    const subscriber = await novu.subscribers.identify(id, {
				email: email,
				avatar: image,
				firstName:name?.split(" ")[0],
				lastName: name?.split(" ")[1],
    })

    if (subscriber.data.data) {
        return NextResponse.json(
            { message: "Subscriber created successfully"},
            { status: 200 }
        );
    } else {
        return NextResponse.json(
            { message: "An error occurred while creating subscriber"},
            { status: 400 }
        );
    }
    
	
}