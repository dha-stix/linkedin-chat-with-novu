import { NextRequest, NextResponse } from "next/server";
import { Novu } from "@novu/node";
const novu = new Novu(process.env.NOVU_API_KEY!);

export async function POST(req: NextRequest) {
	const { type, name, id, subscriberID, content } = await req.json();

	if (type === "comment") {
		await novu.trigger("inapp", {
			to: {
                subscriberId: subscriberID,
			},
			payload: {
				content: `${name} commented on your post: ${content}`,
			},
			actor: id,
        });
	} else if (type === "like") {
		await novu.trigger("inapp", {
			to: {
                subscriberId: subscriberID,
			},
			payload: {
				content: `${name} reacted to your post`,
			},
			actor: id,
		});
	}

	return NextResponse.json(
		{ message: "Notification sent" },
		{ status: 200 }
	);
}