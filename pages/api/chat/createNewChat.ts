import clientPromise from "@/lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

const MAX_PROMPT_LENGTH = 2000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession(req, res);
    const { prompt } = req.body;

    // validate prompt data.
    // TODO: DRY this validation logic.
    if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
      res.status(422).json({
        message: `Prompt is required and must be less than ${MAX_PROMPT_LENGTH} characters.`,
      });
      return;
    }

    const newUserMessage = {
      role: "user",
      content: prompt,
    };
    console.log("create-new-chat: ", prompt);
    const client = await clientPromise;
    const db = client.db("wren0");
    const chat = await db.collection("chats").insertOne({
      userId: session?.user?.sub,
      messages: [newUserMessage],
      title: prompt,
    });
    res.status(200).json({
      _id: chat.insertedId.toString(),
      messages: [newUserMessage],
      title: prompt,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Something went wrong creating a new chat." });
    console.log("Error in createNewChat(): ", error);
  }
}
