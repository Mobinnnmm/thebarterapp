import { connectToDB } from "../../../../lib/mongodb";
import Categories from "../../../../models/Categories";

export async function GET() {
  try {
    await connectToDB();
    const categories = await Categories.find();

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }, null, 2),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
