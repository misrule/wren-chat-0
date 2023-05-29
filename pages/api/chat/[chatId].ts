import clientPromise from "@/lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  try {
    const session = await getSession(req, res);
    const { prompt } = req.body;
    const { chatId } = req.query;
  
    let result = { status: 0, message: "" };
    if (req.method === "DELETE") {  
      result.status = 200;
      result.message = `You are trying to delete chat ${chatId}.`;
    } else if (req.method === "PUT") {
      result.status = 200;
      result.message = `You are trying to update chat ${chatId}.`;
    } else {
      result.status = 400;
      result.message = `Unsupported HTTP method: ${req.method}.`;
    }
    res.status(result.status).json({
      message: result.message,
    });
     
    // validate chat id.
    // TODO: DRY this object id validation/redirect logic.
    let objectId;
    try {
      objectId = new ObjectId(String(chatId));
    } catch (e) {
      res.status(422).json({ message: "Invalid chat id." });
      return;
    }

    const client = await clientPromise;
    const db = client.db("wren0");
    const chat = await db.collection("chats").deleteOne({
      _id: objectId,
      userId: session?.user?.sub,
    });    
  
  } catch (error) {
    res
      .status(500)
      .json({ 
        message: `An error occurred deleting chat.`,
        error: error,
      });
    console.log(error);
  }
}
