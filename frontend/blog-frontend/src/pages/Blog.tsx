import { Avatar } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

// ** profile
// ** title
// ** image
// * content

export default function Blog() {
  return (
    <div className=" px-[10%] py-5 ">
      <div className="flex items-center gap-3 ">
        <div className="">
          <Avatar
            className="h-14 w-14"
            name=""
            src="https://img.freepik.com/free-photo/anime-style-character-space_23-2151134190.jpg?uid=R32368678&ga=GA1.1.280991500.1720899505&semt=ais_hybrid"
          />
        </div>
        <div>
          <p className="">Pabitra Dakua</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <p>pabitra85@gmail.com</p>
            <p className="text-green-400">25th Aug 2024</p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-bold max-w-2xl">
          How i earn $600K per month by doing remote job ? Here Is the Roadmap
        </h1>
      </div>
      <div className="mt-10 w-full">
        <Image
          isBlurred
          src="https://cdn.pixabay.com/photo/2024/02/18/13/13/ai-generated-8581189_960_720.jpg"
          alt="NextUI Album Cover"
          className=" w-full h-auto object-cover"
        />
      </div>
      <div className="mt-10">
        <p className="text-xl">
          {" "}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione,
          maiores nemo. Totam at molestias, dolorem id quis in, qui explicabo
          voluptatum, consectetur aut pariatur assumenda repellat dolorum! Quia
          sit optio nihil nobis
        </p>
      </div>
    </div>
  );
}
