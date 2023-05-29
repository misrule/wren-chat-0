import clientPromise from "@/lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  function getLastPathComponent(url: string): string {
    const pathSegments = url.split('/');
    return pathSegments[pathSegments.length - 1];
  }
  try {
    const session = await getSession(req, res);
    const { prompt } = req.body;

    const currentChatId = getLastPathComponent(String(req.url));
    res.status(200).json({
      message: `You are trying to delete chat ${currentChatId}.`
    });
    
    // console.log("create-new-chat: ", prompt);
    // const client = await clientPromise;
    // const db = client.db("wren0");
    // const chat = await db.collection("chats").insertOne({
    //   userId: session?.user?.sub,
    //   messages: [newUserMessage],
    //   title: prompt,
    // });
    // res.status(200).json({
    //   _id: chat.insertedId.toString(),
    //   messages: [newUserMessage],
    //   title: prompt,
    // });
  } catch (error) {
    // res
    //   .status(400)
    //   .json({ error: "Something went wrong creating a new chat." });
    console.log("Error in createNewChat(): ", error);
  }
}
