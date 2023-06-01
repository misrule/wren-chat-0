import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

type Props = {};
export default function AppHeader({}: Props) {
  const { user } = useUser();
  return (
    <div
      className="flex h-[var(--header-height)] items-center justify-between gap-4 bg-slate-950 px-6 py-4
      text-white"
    >
      {/* LEFT-SIDE CONTROLS */}
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 bg-slate-800">
          {/* menu icon or app-logo goes here*/}
        </div>
        <div className="text-xl font-medium text-white/80 hover:text-white">
          WrenChat
        </div>
        <div className="rounded-md border border-blue-300 px-2 py-0 font-mono text-xs text-blue-300">
          alpha-0
        </div>
      </div>

      {/* RIGHT-SIDE CONTROLS */}
      <div className="flex gap-4">
        
          <div>
            { user && 
              <Image
                src={String(user?.picture)}
                width={30}
                height={30}
                alt="User avatar"
                className="rounded-full"
              />
            }
          
        </div>
      </div>
    </div>
  );
}
