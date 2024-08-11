import React, { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { RiFireLine } from "react-icons/ri";
import { FaHashtag } from "react-icons/fa6";
import { CiBookmarkPlus } from "react-icons/ci";
import { MdOutlineFeedback } from "react-icons/md";
import { MdOutlineExplore } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const tabs = [
  {
    name: "My Feed",
    icon: IoHomeOutline,
    location: "/",
  },
  {
    name: "search",
    icon: IoSearchOutline,
    location: "/signin",
  },
  {
    name: "write",
    icon: IoMdAdd,
  },
  {
    name: "Tending",
    icon: RiFireLine,
  },
  {
    name: "Explore",
    icon: MdOutlineExplore,
  },
  {
    name: "Tags",
    icon: FaHashtag,
  },
  {
    name: "Bookmarks",
    icon: CiBookmarkPlus,
  },
  {
    name: "Feedback",
    icon: MdOutlineFeedback,
  },
];

export default function RootLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("");
  function handleRouting(tab: any) {
    setActiveTab(tab.name);
    if (tab.location) {
      navigate(tab.location);
    }
  }
  return (
    <div className="w-[100%] flex">
      <div className="w-[15%] h-screen sticky top-0 bottom-0 border-r border-gray-800 left-0">
        <div className="mt-10 flex flex-col gap-1">
          {tabs.map((tab, index) => (
            <div
              key={index}
              onClick={() => handleRouting(tab)}
              className={`flex cursor-pointer items-center px-4 hover:bg-[#1C1F26] py-2 ${
                activeTab === tab.name ? "bg-[#1C1F26]" : ""
              }`}
            >
              <tab.icon className="text-violet-200" />
              <button className="pl-3 capitalize font-thin">{tab.name}</button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[85%] h-[4000px] py-10  max-w-5xl mt-10 m-auto">
        <Outlet />
      </div>
    </div>
  );
}
