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
  
  if (searchTerm) {
    todos = await env.DB.prepare(
      "SELECT * FROM todo6 WHERE title LIKE ? ORDER BY id DESC"
    )
    .bind(`%${searchTerm}%`)
    .all();
  } else {
    todos = await env.DB.prepare(
      "SELECT * FROM todo6 ORDER BY id DESC"
    ).all();
  }
  
  return json({ todos: todos.results });
};

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const { env, cf, ctx } = context.cloudflare;

  switch (intent) {
    case "create": {
      const title = formData.get("title");
      await env.DB.prepare(
        "INSERT INTO todo6 (title, completed) VALUES (?, false)"
      )
      .bind(title)
      .run();
      break;
    }
    
    case "update": {
      const id = formData.get("id");
      const title = formData.get("title");
      await env.DB.prepare(
        "UPDATE todo6 SET title = ? WHERE id = ?"
      )
      .bind(title, id)
      .run();
      break;
    }
    
    case "delete": {
      const id = formData.get("id");
      await env.DB.prepare(
        "DELETE FROM todo6 WHERE id = ?"
      )
      .bind(id)
      .run();
      break;
    }
  }
  
  return json({ success: true });
};
import Head from '../components/Head';
import ConfirmDialog from '../components/ConfirmDialog'
import FormDialog from './todo6/Form';
const DIALOG_NAME_1 = "confirm_dialog1";
//
export default function Todos() {
  const { todos } = useLoaderData<{ todos: Todo[] }>();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if(actionData){
      if(actionData?.success){

      }
      console.log(actionData);
    }
  }, [actionData]);


  const handleSearch = (value: string) => {
    setSearchTerm(value);
    navigate(`/todo6?q=${value}`);
  };

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    submit(form, { method: "post" });
    setIsNewDialogOpen(false);
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    submit(form, { method: "post" });
    setIsEditDialogOpen(false);
    setEditingTodo(null);
  };

  const handleDelete = (id: number) => {
    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("id", id.toString());
    submit(formData, { method: "post" });
  };
  
  const addOpen = function(){
    const modalDialog = document.getElementById(DIALOG_NAME_1);
    if(modalDialog) {
      modalDialog.showModal();
    }
  }

  const addClose = function(){
    const modalDialog = document.getElementById(DIALOG_NAME_1);
    if(modalDialog) { modalDialog.close();}
  }
  const cbFunc = function(){

  };

  return (
  <>
    <Head />
    <div className="max-w-4xl mx-auto p-6">
      <div className="">
        <h1 className="text-3xl font-bold">TODOリスト</h1>
        <div className="">
          <div className="relative">
            <input
              placeholder="タスクを検索..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <hr />
          {/* form_add */}
          <hr />
          <button onClick={()=>{addOpen()}}>[ Create ]</button>
          <dialog id={DIALOG_NAME_1} className="dialog shadow-lg rounded-lg p-2">
            <div className="text-end mx-2">
              <button onClick={()=>addClose()} className="">close</button>
            </div>
            <h1 className="text-2xl font-bold">TODO-New</h1>
            <hr className="my-2" />
            <FormDialog mode="create" idName={DIALOG_NAME_1} />
          </dialog>
          <hr className="my-2" />
        </div>
      </div>

      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <span>{todo.title}</span>
            <div className="flex gap-2">
              {/*
              <Dialog open={isEditDialogOpen && editingTodo?.id === todo.id} 
                     onOpenChange={(open) => {
                       setIsEditDialogOpen(open);
                       if (!open) setEditingTodo(null);
                     }}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setEditingTodo(todo)}
                  >
                    編集
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>TODOの編集</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdate}>
                    <input type="hidden" name="intent" value="update" />
                    <input type="hidden" name="id" value={todo.id} />
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`edit-title-${todo.id}`}>タイトル</Label>
                        <Input
                          id={`edit-title-${todo.id}`}
                          name="title"
                          defaultValue={todo.title}
                          required
                        />
                      </div>
                      <Button type="submit">更新</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              */}

              <button
                variant="destructive"
                onClick={() => handleDelete(todo.id)}
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
