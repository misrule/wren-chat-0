import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const MAX_PROMPT_LENGTH = 2000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("wren0");

    const { chatId, role, content } = req.body;

    // validate chat id.
    // TODO: DRY this object id validation/redirect logic.
    let objectId;
    try {
      objectId = new ObjectId(chatId);
    } catch (e) {
      res.status(422).json({ message: "Invalid chat id." });
      return;
    }

    // validate prompt data.
    // TODO: DRY this validation logic.
    if (!content || content.length > MAX_PROMPT_LENGTH) {
      res.status(422).json({
        message: `Prompt is required and must be less than ${MAX_PROMPT_LENGTH} characters.`,
      });
      return;
    }
    
    // validate role
    if (role !== "user" && role !== "assistant") {
      res.status(422).json({
        message: `Role must be either "user" or "assistant".`,
      });
      return;
    }

    const chat = await db.collection("chats").findOneAndUpdate(
      {
        _id: objectId,
        userId: session?.user?.sub,
      },
      {
        $push: {
          messages: {
            role,
            content,
          } as any,
        },
      },
      {
        returnDocument: "after",
      }
    );

    res.status(200).json({
      chat: {
        ...chat.value,
        _id: chat.value?._id.toString(),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred adding a message to a chat." });
    console.log(error);
  }
}
