import clientPromise from "@/lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("wren0");

    const chats = await db
      .collection("chats")
      .find(
        {
          userId: session?.user?.sub,
        },
        {
          projection: {
            userId: 0,
            messages: 0,
          },
        }
      )
      .sort({
        _id: -1,
      })
      .toArray();

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "There was an error getting chat list" });
    console.log(error);
  }
}
