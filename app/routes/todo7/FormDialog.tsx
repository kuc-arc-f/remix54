import { useLoaderData, useSubmit, useNavigate } from "@remix-run/react";

//
function Compo({idName, editingTodo, errors, mode}) {
  const submit = useSubmit(); 
  console.log("mode=", mode);
  console.log(editingTodo);

  const closeButton = function(){
    const dlg = document.getElementById(idName);
    if(dlg) {
      //@ts-ignore
      dlg.close();
    }
  }

  return (
  <div className="bg-white px-8 pt-3 pb-3 dialog_body_wrap">
    <form onSubmit={(e) => {
      e.preventDefault();
      const sendFormData = new FormData(e.currentTarget);
      console.log(sendFormData);
      submit(sendFormData, { method: "post" });
    }}>
      {/*  
      <input type="hidden" name="intent" value="create" /> 
      */}
      <input 
        type="hidden"
        name="_action"
        value={mode !== "create" ? "update" : "create"}
        />
      {mode !== "create" ? ( 
        <input type="hidden" name="id" value={editingTodo?.id} />
      ): (
        <input type="hidden" name="id" value="" />
      )}

      <div>
        <label htmlFor="title">タイトル : </label>
        <input id="title" name="title"
        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue={editingTodo?.title}
          required />
        {errors?.title && (
        <p className="text-red-500 text-sm">{errors?.title}</p>
        )} 
      </div>

      <div> 
        <label className="block mb-1">内容</label>
        <input
          type="text"
          name="content"
          defaultValue={editingTodo?.content}
          className="w-full border p-2 rounded"
        />
        {errors?.content && (
          <p className="text-red-500 text-sm">{errors?.content}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">公開設定</label>
        <div className="space-x-4">
          <label>
            <input
              type="radio"
              name="public"
              value="public"
              defaultChecked={editingTodo?.public === "public"}
            />{" "}
            公開
          </label> 
          <label>
            <input
              type="radio"
              name="public"
              value="private"
              defaultChecked={editingTodo?.public === "private"}
            />{" "}
            非公開
          </label>
        </div>
        <div>
          <label className="block mb-1">フルーツ</label>
          <div className="space-x-4">
            <label>
              <input
                type="checkbox"
                name="foodOrange"
                defaultChecked={editingTodo?.foodOrange}
              />{" "}
              オレンジ
            </label>
            <label>
              <input
                type="checkbox"
                name="foodApple"
                defaultChecked={editingTodo?.foodApple}
              />{" "}
              りんご
            </label>
            <label>
              <input
                type="checkbox"
                name="foodBanana"
                defaultChecked={editingTodo?.foodBanana}
              />{" "}
              バナナ
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-1">公開日</label>
          <input
            type="date"
            name="pubDate"
            defaultValue={editingTodo?.pubDate}
            className="border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">数量1</label>
            <input
              type="text"
              name="qty1"
              defaultValue={editingTodo?.qty1}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">数量2</label>
            <input
              type="text"
              name="qty2"
              defaultValue={editingTodo?.qty2}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">数量3</label>
            <input
              type="text"
              name="qty3"
              defaultValue={editingTodo?.qty3}
              className="w-full border p-2 rounded"
            />
          </div> 
        </div>
      </div>

      <hr className="my-3" />
      <div className="text-center">
        <button type="submit" className="bg-blue-600 py-2 px-4 text-white rounded-md"
        >{mode !== "create" ? "更新" : "作成"}</button>
        <button type="button" className="bg-gray-200 rounded-md py-2 px-4 mx-2"
        onClick={()=>closeButton()}>close</button>
      </div> 
    </form>  
  </div>
  );
}
export default Compo;
/*
*/
