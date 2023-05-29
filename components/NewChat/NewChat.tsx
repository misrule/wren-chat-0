import { faRobot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const NewChat = () => {

    return (
        <div className="m-auto flex flex-1 flex-col items-center justify-center text-center">
        <FontAwesomeIcon
          icon={faRobot}
          className="mb-2 text-6xl text-emerald-300"
        />
        <h1 className="mt-4 text-4xl font-bold text-white/50">
          Hello! I&apos;m Wren. How may I help you?
        </h1>
        <div className="p-2 mt-6 border border-white">
            <p>
                Please note that I am an experimental AI. I might act weird sometimes.   
            </p>
        </div>
      </div>
  )

}
