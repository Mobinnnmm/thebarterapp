// app/api/report/delete/route.js

import { connectToDB } from '../../../../../lib/mongodb';
import Report from '../../../../../models/Report';
import jwt from 'jsonwebtoken';

export async function DELETE(req) {
  try {
    await connectToDB();

    // 1. Auth check
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "No authorization token provided" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
      });
    }

    // 2. Parse body to get the report ID
    const body = await req.json();
    const { reportId } = body;

    if (!reportId) {
      return new Response(JSON.stringify({ error: "Missing reportId in request body" }), {
        status: 400,
      });
    }

    // 3. Delete the report
    const deleted = await Report.findByIdAndDelete(reportId);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Report not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Report deleted successfully" }), {
      status: 200,
    });

  } catch (error) {
    console.error("Delete report error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
