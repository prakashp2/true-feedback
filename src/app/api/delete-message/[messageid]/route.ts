import UserModel from "../../../../model/user";
import { getServerSession } from "next-auth/next";
import dbConnect from "../../../../lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  await dbConnect();

  try {
    // Next.js 16: params is a Promise
    const { messageid } = await params;

    console.log("Deleting message:", messageid);

    const session = await getServerSession(authOptions);
    const user = session?.user as User & { _id?: string };

    if (!session || !user?._id) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      {
        $pull: {
          messages: {
            _id: messageid,
          },
        },
      }
    );

    console.log("Delete result:", updateResult);

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);

    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}