import { useLoaderData, useSubmit, useNavigate } from "@remix-run/react";
//
function Compo(props: any) {
  const submit = useSubmit();
//  console.log(props);
  //
  const closeButton = function(){
    const dlg = document.getElementById(props.idName);
    if(dlg) {
      //@ts-ignore
      dlg.close();
    }
  }
  //
  const okFunc = async function(){
    console.log("#okFunc");
    props.cbFunction();
  }
  //
  return (
  <div className="bg-white px-8 pt-3 pb-3 dialog_body_wrap">
    <form onSubmit={(e) => {
      e.preventDefault();
      const sendFormData = new FormData(e.currentTarget);
      console.log(sendFormData);
      submit(sendFormData, { method: "post" });
    }}>
      <input type="hidden" name="intent" value="create" /> 
      
        <div>
          <label htmlFor="title">タイトル : </label>
          <input id="title" name="title"
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue="" required />
        </div>
        <hr className="my-3" />
        <div className="text-center">
          <button type="submit" className="bg-blue-600 py-2 px-4 text-white rounded-md"
          >作成</button>
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
