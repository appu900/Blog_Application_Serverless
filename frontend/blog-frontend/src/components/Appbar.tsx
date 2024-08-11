import { Avatar } from "./BlogCard";
import logo from ".././assets/logo.png";

export default function Appbar() {
  return (
    <div className="border-b flex flex-col justify-between items-center px-10 py-4">
      <div>
        <img className="max-w-[200px]" src={logo} alt="" />
      </div>
      <div className="">
        <Avatar size={10} color="black" name="Rahul" />
      </div>
    </div>
  );
}
