import { NextRequest, NextResponse } from "next/server";
import { Novu } from "@novu/node";
const novu = new Novu(process.env.NOVU_API_KEY!);

export async function POST(req: NextRequest) {
	const { type, name, image, subscriberID, content } = await req.json();

	if (type === "comment") {
		await novu.trigger("inapp", {
			to: {
                subscriberId: subscriberID,
                avatar: image,
			},
			payload: {
				content: `${name} commented on your post: ${content}`,
				avatar: image,
			},
        });
	} else if (type === "like") {
		await novu.trigger("inapp", {
			to: {
                subscriberId: subscriberID,
                avatar: image,
			},
			payload: {
				content: `${name} reacted to your post`,
				avatar: image,
			},
		});
	}

	return NextResponse.json(
		{ message: "Notification sent" },
		{ status: 200 }
	);
}