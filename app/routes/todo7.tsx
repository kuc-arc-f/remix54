// app/types/todo.ts
import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です" }),
  content: z.string().min(1, { message: "内容は必須です" }),
  public: z.enum(["public", "private"]),
  foodOrange: z.boolean().optional(),
  foodApple: z.boolean().optional(),
  foodBanana: z.boolean().optional(),
  pubDate: z.string(),
  qty1: z.string(),
  qty2: z.string(),
  qty3: z.string(),
});

export type Todo = z.infer<typeof todoSchema>;

// app/routes/_index.tsx
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useSubmit, useNavigate } from "@remix-run/react";
import { useState } from "react";
//import { todoSchema } from "~/types/todo";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./todo7/db.server";
//import { Dialog } from '@/components/ui/dialog';

export async function loader({ context, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("search") || undefined;
  const { env, cf, ctx } = context.cloudflare;

  const todos = await getTodos(env.DB, searchQuery);
  console.log(todos.results);
  return json({ todos: todos.results });
}

export async function action({ context, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  console.log("action=", action);
  const { env, cf, ctx } = context.cloudflare;
  
  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    public: formData.get("public"),
    foodOrange: formData.get("foodOrange") === "on",
    foodApple: formData.get("foodApple") === "on",
    foodBanana: formData.get("foodBanana") === "on",
    pubDate: formData.get("pubDate"),
    qty1: formData.get("qty1"),
    qty2: formData.get("qty2"),
    qty3: formData.get("qty3"),
  };

  try {
    if(action === "delete") {
      const deleteId = formData.get("id") as string;
      await deleteTodo(env.DB, deleteId);
      return json({ success: true });      
    }
    const validatedData = todoSchema.parse(rawData);

    switch (action) {
      case "create":
        await createTodo(env.DB, validatedData);
        break;
      case "update":
        const id = formData.get("id") as string;
        await updateTodo(env.DB, id, validatedData);
        break;
      //case "delete":
      //  const deleteId = formData.get("id") as string;
      //  await deleteTodo(env.DB, deleteId);
      //  break;
    }
    return json({ success: true });
  } catch (error) {
    return json({ error: error.errors }, { status: 400 });
  }
}
import Head from '../components/Head';
import FormDialog from './todo7/FormDialog';
const DIALOG_CREATE_NAME = "confirm_create";
const DIALOG_EDIT_NAME = "confirm_edit";
const initialData = {
  title: "",
  content: "",
  public: "public",
  foodOrange: 0,
  foodApple: 0,
  foodBanana: 0,
  pubDate: "",
  qty1: "",
  qty2: "",
  qty3: "",
}
//
export default function Index() {
  const { todos } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const rawData = {
        title: formData.get("title"),
        content: formData.get("content"),
        public: formData.get("public"),
        foodOrange: formData.get("foodOrange") === "on",
        foodApple: formData.get("foodApple") === "on",
        foodBanana: formData.get("foodBanana") === "on",
        pubDate: formData.get("pubDate"),
        qty1: formData.get("qty1"),
        qty2: formData.get("qty2"),
        qty3: formData.get("qty3"),
      };

      todoSchema.parse(rawData);
      submit(form);
      setIsDialogOpen(false);
      setErrors({});
    } catch (error) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
    }
  };

  const addOpen = function(){
    setEditingTodo(initialData)
    const modalDialog = document.getElementById(DIALOG_CREATE_NAME);
    if(modalDialog) {
      modalDialog.showModal();
    }
  }

  const editOpen = function(){
    const modalDialog = document.getElementById(DIALOG_EDIT_NAME);
    if(modalDialog) {
      modalDialog.showModal();
    }
  }

  return (
  <>
    <Head />
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TODOリスト</h1>
        <button
          onClick={() => {
            setEditingTodo(null);
            //setIsDialogOpen(true);
            addOpen();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          新規作成
        </button>
      </div>

      <div className="mb-4">
        <form className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="検索..."
            className="border p-2 rounded flex-grow"
          />
          <button
            type="submit"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            検索
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {todos.map((todo: any) => (
          <div key={todo.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{todo.title}</h2>
            <p>{todo.content}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  console.log(todo);
                  setEditingTodo(todo);
                  editOpen();
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                編集
              </button>
              <button
                onClick={() => {
                  if (confirm("本当に削除しますか？")) {
                    const formData = new FormData();
                    formData.append("_action", "delete");
                    formData.append("id", todo.id);
                    submit(formData, { method: "post" });
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* dialog */}
      <hr />
      <div>
        <div className="">
          {/* <button onClick={()=>{addOpen()}}>[ Create ]</button> */}
          <dialog id={DIALOG_CREATE_NAME} className="dialog shadow-lg rounded-lg p-2">
            <FormDialog editingTodo={editingTodo} idName={DIALOG_CREATE_NAME}
            mode="create" errors={errors}
            />
          </dialog>
          {/* edit */}
          <dialog id={DIALOG_EDIT_NAME} className="dialog shadow-lg rounded-lg p-2">
            <FormDialog editingTodo={editingTodo} idName={DIALOG_EDIT_NAME}
            mode="edit" errors={errors}
            />
          </dialog>          

        </div>
      </div>
    </div>  
  </>

  );
}
