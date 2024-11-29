import type { MetaFunction } from "@remix-run/cloudflare";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/cloudflare";
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
  console.log(todos.results);
  return json({ todos: todos.results });
}
//
export default function Index() {
  const { todos } = useLoaderData<typeof loader>();
  console.log(todos);
  return (
    <div className="">
      test1
      <hr className="" />
      {JSON.stringify(todos)}
      <hr className="" />

    </div>
  );
}
