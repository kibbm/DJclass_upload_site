// netlify/functions/upload.js
import { Octokit } from "https://cdn.skypack.dev/octokit";

export default async (req, context) => {
  try {
    const body = await req.formData();
    const file = body.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const contentBase64 = Buffer.from(arrayBuffer).toString("base64");

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // 학생 파일이 저장될 목적지 repo 설정
    const owner = "kibbm";
    const repo = "DJclass_PBL";
    const path = `uploads/${Date.now()}_${file.name}`;

    // GitHub에 파일 업로드
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path,
      message: "Student upload",
      content: contentBase64,
    });

    return new Response(JSON.stringify({ success: true, path }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
