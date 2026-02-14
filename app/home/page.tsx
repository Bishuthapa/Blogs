import UnderDevelopment from "@/components/under-construction";
import axios from "axios";

export default  async function Home(){
  
  const isLive = true;
  const res = await axios.get("http://localhost:3000/api/blogs");

  console.log("res", res);

  return isLive ?  (
    <>
    <p>This is a home page</p>
    {
      res.data.map((blog: any) => (
        <div key={blog.id}>
          <h2>Title:{blog.title}</h2>
          <p>Content:{blog.content}</p>
        </div>
      ))
    }
    </>
  ) : (
    <UnderDevelopment />
  )
}