// import { faRobot } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ResponseLoader from "../ResponseLoader";

export const NewChat = () => {
  return (
    <div
      className="m-auto flex w-full flex-1 flex-col items-center 
        justify-center overflow-hidden rounded-t-2xl
        bg-gray-700 text-center"
    >
      <div className="p-12 bg-gray-800 rounded-xl 
      shadow-lg">
      {/* <FontAwesomeIcon
        icon={faRobot}
        className="mb-2 text-6xl text-emerald-300"
      /> */}
      {/* <h1 className="mt-4 text-4xl font-bold text-white/50"> */}
      <h1 className="animate-text bg-gradient-to-r 
      from-teal-500 via-purple-500 to-orange-500 
      bg-clip-text text-transparent text-4xl font-black
      ">
        Hi!&nbsp;I&apos;m Wren.&nbsp;How may I help you?
      </h1>
      {/* <ResponseLoader textSize={'xl'}/> */}
      {/* <div
        className="mt-6 rounded-lg border border-blue-300/30
        p-2 tracking-wider text-blue-300/60"
      >
        <p className="font-mono text-xs">
          Please note that I am an <span className="font-bold text-white/70">experimental</span> AI. Things could get weird.
        </p>
      </div> */}
      </div>
    </div>
  );
};
