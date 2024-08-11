import { BiUpvote } from "react-icons/bi";
import { CiBookmark } from "react-icons/ci";
import { IoMdCopy } from "react-icons/io";
import { CiLink } from "react-icons/ci";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

export default function BlogCard({
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) {
  return (
    <div className="max-w-[330px] cursor-pointer h-[410px] bg-[#1C1F26] border border-gray-700 rounded-xl px-3 py-4">
      <div>
        <Avatar name="Appu" size={8} />
      </div>
      <div className="mt-3">
        <p className="font-bold text-[19px]">{title}</p>
      </div>
      <div className="flex gap-4  mb-3 mt-5 text-xs">
        <p>{publishedDate}</p>
        <p>.</p>
        <p>{Math.ceil(content.length / 100)} Minutes Read</p>
      </div>
      <div className="">
        <img
          className="w-full h-[170px] rounded-lg object-cover"
          src="https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_640.jpg"
          alt=""
        />
      </div>
      <div className="flex items-center justify-between mt-6 text-[20px]">
        <div className="flex cursor-pointer items-center hover:text-green-500 gap-1">
          <button className="">
            <BiUpvote />
          </button>
          <p>0</p>
        </div>
        <div className="flex cursor-pointer items-center hover:text-orange-500 gap-1">
          <button className="">
            <CiBookmark />
          </button>
        </div>
        <div className="flex cursor-pointer items-center hover:text-orange-500 gap-1">
          <button className="">
            <IoMdCopy />
          </button>
        </div>
        <div className="flex cursor-pointer items-center hover:bg-violet-600 hover:bg-opacity-25 rounded-md p-2 gap-1">
          <button className="">
            <CiLink />
          </button>
        </div>
      </div>
    </div>
  );
}

export const Avatar = ({ name, size = 6 }: { name: string; size?: number }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center w-${size} h-${size} p-2 overflow-hidden bg-violet-700 rounded-full dark:bg-gray-600`}
    >
      <span className="font-medium text-white dark:text-gray-300">
        {name[0]}
      </span>
    </div>
  );
};
