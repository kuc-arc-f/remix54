import { json, type ActionFunction, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, useActionData, useSubmit, useNavigate } from "@remix-run/react";
import { useState , useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const loader: LoaderFunction = async ({ context, request }) => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q") || "";
  const { env, cf, ctx } = context.cloudflare;
  let todos;
  
  let query = "SELECT * FROM posts";
  let params: any[] = [];

  if (searchTerm) {
    query += " WHERE title LIKE ? OR content LIKE ?";
    params = [`%${searchTerm}%`, `%${searchTerm}%`];
  }

  query += " ORDER BY created_at DESC";

  const posts = await env.DB.prepare(query).bind(...params).all();
  console.log(posts);
  
  return json({ posts: posts.results });  
  //return json({ todos: posts.results });
};

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const { env, cf, ctx } = context.cloudflare;
  const intent = formData.get("intent");
  console.log("intent=", intent);

  if (intent === "create") {
    const post = Object.fromEntries(formData);
    
    const query = `
      INSERT INTO posts (
        title, content, content_type, age, public,
        food_orange, food_apple, food_banana, food_melon, food_grape,
        date_publish, date_update, post_number,
        address_country, address_pref, address_city, address_1, address_2,
        text_option1, text_option2
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      post.title, post.content, post.content_type, post.age, post.public === "true",
      post.food_orange === "on", post.food_apple === "on", 
      post.food_banana === "on", post.food_melon === "on", post.food_grape === "on",
      post.date_publish, post.date_update, post.post_number,
      post.address_country, post.address_pref, post.address_city, 
      post.address_1, post.address_2,
      post.text_option1, post.text_option2
    ];
    console.log(params);

    await env.DB.prepare(query).bind(...params).run();
    return json({ success: true });
  }

  if (intent === "update") {
    const id = formData.get("id");
    const post = Object.fromEntries(formData);

    const query = `
      UPDATE posts SET
        title = ?, content = ?, content_type = ?, age = ?, public = ?,
        food_orange = ?, food_apple = ?, food_banana = ?, food_melon = ?, food_grape = ?,
        date_publish = ?, date_update = ?, post_number = ?,
        address_country = ?, address_pref = ?, address_city = ?, address_1 = ?, address_2 = ?,
        text_option1 = ?, text_option2 = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      post.title, post.content, post.content_type, post.age, post.public === "true",
      post.food_orange === "on", post.food_apple === "on", 
      post.food_banana === "on", post.food_melon === "on", post.food_grape === "on",
      post.date_publish, post.date_update, post.post_number,
      post.address_country, post.address_pref, post.address_city, 
      post.address_1, post.address_2,
      post.text_option1, post.text_option2,
      id
    ];

    await env.DB.prepare(query).bind(...params).run();
    return json({ success: true });
  }

  if (intent === "delete") {
    const id = formData.get("id");
    await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
    return json({ success: true });
  }

  return json({ error: "Invalid intent" }, { status: 400 });
};

import { useState , useEffect } from "react";
import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, useSubmit, useNavigate } from "@remix-run/react";
import { postSchema, type PostSchemaType } from './posts/schemas';
import { PostForm } from './posts/PostForm'
const DIALOG_CREATE = "dialog_create";
const DIALOG_DIT = "dialog_edit";
import Head from '../components/Head';

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostSchemaType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = useSubmit();
  const navigate = useNavigate();

  useEffect(() => {
    if(actionData){
      if(actionData?.success){

      }
      console.log(actionData);
    }
  }, [actionData]);

  const validateForm = (formData: FormData) => {
    const target = Object.fromEntries(formData);
    if(target.public && target.public==="false"  ){
      target.public = false;
    }else{
      target.public = true;
    }
    //console.log(target);
    console.log(target);

    //const result = postSchema.safeParse(Object.fromEntries(formData));
    const result = postSchema.safeParse(target);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      console.log(formattedErrors);
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    if (!validateForm(formData)) {
      return;
    }

    submit(formData, { method: "post" });
    setIsCreateOpen(false);
    setIsEditOpen(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    navigate(`?q=${searchTerm}`);
  };

  const addOpen = function(){
    const modalDialog = document.getElementById(DIALOG_CREATE);
    if(modalDialog) {
      modalDialog.showModal();
    }
  }

  const editOpen = function(){
    const modalDialog = document.getElementById(DIALOG_DIT);
    if(modalDialog) {
      modalDialog.showModal();
    }
  }

  return (
  <>
    <Head />
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">posts</h1>
      <div className="flex justify-between items-center mb-6">
        <input
          type="search"
          placeholder="検索..."
          className="max-w-xs"
          onChange={handleSearch}
        />
        <hr />
        <button onClick={()=>{addOpen()}}
          className="bg-blue-600 mx-2 py-2 px-4 text-white rounded-md"
        >Create</button>
        <dialog id={DIALOG_CREATE} className="shadow-lg rounded-lg p-2">
          <div className="sm:min-w-[600px] py-4">
            <div>
              <h3 className="text-3xl font-bold">新規投稿</h3>
            </div>
            <PostForm onSubmit={handleSubmit} errors={errors} 
            idName={DIALOG_CREATE} post={null}/>
          </div>
        </dialog>
        {/* edit_dialog */}
        <dialog id={DIALOG_DIT} className="dialog shadow-lg rounded-lg p-2">
          <div className="sm:min-w-[600px] py-4">
            <div>
              <h3 className="text-3xl font-bold">Edit</h3>
            </div>
            <PostForm onSubmit={handleSubmit} errors={errors} 
            idName={DIALOG_DIT}
            post={selectedPost} />
          </div>
        </dialog>


      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg">
            <h3 className="font-bold">{post.title}</h3>
            <p className="mt-2">{post.content}</p>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                onClick={() => {
                  setSelectedPost(post);
                  editOpen();
                }}
              >
                編集
              </button>
              <button
                variant="destructive"
                onClick={() => {
                  if (confirm("本当に削除しますか？")) {
                    const formData = new FormData();
                    formData.append("intent", "delete");
                    formData.append("id", post.id);
                    submit(formData, { method: "post" });
                  }
                }}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>  
  </>

  );
}

