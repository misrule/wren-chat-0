type Props = {}
export default function AppHeader({}: Props) {
  return (

    <div className="flex justify-between items-center gap-4 text-white bg-slate-950 py-4 px-6
      h-[var(--header-height)]">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-slate-800">
          {/* menu icon goes here*/}
        </div>
        <div className="text-xl text-white/80 hover:text-white">
          WrenChat
        </div>
        <div className="text-xs text-blue-300 font-mono border rounded-md border-blue-300 px-2 py-0">
          alpha-0
        </div>
      </div>
      <div className="flex gap-4">
        <div className="h-8 aspect-square bg-gray-600 rounded-full"></div>
      </div>
    </div>
  )
}