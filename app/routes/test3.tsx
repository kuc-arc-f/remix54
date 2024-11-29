import type { MetaFunction } from "@remix-run/cloudflare";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, type ActionFunction, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { env, cf, ctx } = context.cloudflare;
  console.log("MY_VARIABLE=", env.MY_VARIABLE);
  const todos = await env.DB.prepare(
      `SELECT * FROM Customers `
    ).all();
  //console.log(todos.results);
  return json({ todos: todos.results });
}

export const action: ActionFunction = async ({ request, context }) => {
    const formData = await request.formData();
    const title = formData.get("title");
    const content = formData.get("content");
  
    if (!title || !content) {
      return json({ error: "Title and content are required" }, { status: 400 });
    }
    const item = {
      title: title,
      content: content,
    }
  console.log(item);

    return json({ message: "Data received successfully", title, content });    
}

export default function Example() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [response, setResponse] = useState("");
  const submit = useSubmit();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    //console.log(formData)
    submit(formData, { method: "post" });
    return;
    const res = await fetch("/test3", {
      method: "POST",
      body: formData,
    });
console.log("ok=", res.ok);
console.log(res);
    if (!res.ok) {
      const errorData = await res.json();
      setResponse(`Error: ${errorData.error}`);
    } else {
      //const data = await res.json();
      const data = await res.text();
      console.log(data);
      //setResponse(`Success: ${data.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Custom POST without Form</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
      {response && <p className="mt-4 text-red-500">{response}</p>}
    </div>
  );
}