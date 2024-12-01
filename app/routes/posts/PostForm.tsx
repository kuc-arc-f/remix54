// app/components/PostForm.tsx
//import { type PostSchemaType } from "~/schemas/post";
import { type PostSchemaType } from "./schemas";
//import { Label } from "@/components/ui/label";
//import { Input } from "@/components/ui/input";
//import { Button } from "@/components/ui/button";
//import { Alert, AlertDescription } from "@/components/ui/alert";

interface PostFormProps {
  post?: PostSchemaType;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  errors: Record<string, string>;
}

export function PostForm(
  { post, onSubmit, errors , idName}: PostFormProps) 
{

  const closeButton = function(){
    const dlg = document.getElementById(idName);
    if(dlg) {
      //@ts-ignore
      dlg.close();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* post ? "update" : "create" 
        post && <input type="hidden" name="id" value={post.id} />
      */}
      {post ? (
      <>
        <input type="hidden" name="intent" value="update" />
        <input type="hidden" name="id" value={post.id} /> 
      </>
      )
      : (
        <input type="hidden" name="intent" value="create" /> 
      )}

      <div className="space-y-2">
        <label htmlFor="title">タイトル</label>
        {/* errors.title ? "border-red-500" : "" */}
        <input
          required
          id="title"
          name="title"
          defaultValue={post?.title}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && (
          <Alert variant="destructive">
            <AlertDescription>{errors.title}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="content">内容</label>
        <input 
          required
          id="content"
          name="content"
          defaultValue={post?.content}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/*
          <Alert variant="destructive">
            <AlertDescription>{errors.content}</AlertDescription>
          </Alert>
        */}
        {errors.content && (
          <div>{errors.content}</div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="content_type">コンテンツタイプ</label>
        <input
          id="content_type" 
          name="content_type"
          defaultValue={post?.content_type}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="age">年齢</label>
        <input
          id="age"
          name="age"
          defaultValue={post?.age}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label>公開設定</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="public"
              value={true}
              defaultChecked={post?.public}
            />
            公開
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="public"
              value={false}
              defaultChecked={!post?.public}
            />
            非公開
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label>食べ物</label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="food_orange"
              defaultChecked={post?.food_orange}
            />
            オレンジ
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="food_apple"
              defaultChecked={post?.food_apple}
            />
            りんご
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="food_banana"
              defaultChecked={post?.food_banana}
            />
            バナナ
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="food_melon"
              defaultChecked={post?.food_melon}
            />
            メロン
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="food_grape"
              defaultChecked={post?.food_grape}
            />
            ぶどう
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="date_publish">公開日</label>
        <input
          type="date"
          id="date_publish"
          name="date_publish"
          defaultValue={post?.date_publish}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="date_update">更新日</label>
        <input
          type="date"
          id="date_update"
          name="date_update"
          defaultValue={post?.date_update}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        /> 
      </div>

      <div className="space-y-2">
        <label htmlFor="post_number">郵便番号</label>
        <input
          id="post_number"
          name="post_number"
          defaultValue={post?.post_number}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address_country">国</label>
        <input
          id="address_country"
          name="address_country"
          defaultValue={post?.address_country}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address_pref">都道府県</label>
        <input
          id="address_pref"
          name="address_pref"
          defaultValue={post?.address_pref}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address_city">市区町村</label>
        <input
          id="address_city"
          name="address_city"
          defaultValue={post?.address_city}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address_1">住所1</label>
        <input
          id="address_1"
          name="address_1"
          defaultValue={post?.address_1}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address_2">住所2</label>
        <input
          id="address_2"
          name="address_2"
          defaultValue={post?.address_2}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="text_option1">オプション1</label>
        <input
          id="text_option1"
          name="text_option1"
          defaultValue={post?.text_option1}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="text_option2">オプション2</label>
        <input
          id="text_option2" 
          name="text_option2"
          defaultValue={post?.text_option2}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button type="button"   
      className="bg-gray-200 rounded-md py-2 px-4 mx-2"
      onClick={()=>closeButton()}> Close
      </button>

      <button type="submit"
      className="bg-blue-600 mx-2 py-2 px-4 text-white rounded-md"
      >
        {post ? "更新" : "作成"}
      </button>
    </form>
  );
}
