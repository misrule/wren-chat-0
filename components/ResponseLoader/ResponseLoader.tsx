
export default function ResponseLoader() {
  return (
  <div className="flex gap-2 items-center justify-center bg-transparent m-8 w-fit h-6
  absolute top-4 left-6">
    <div className="loading-dot p1 animate-pingslow bg-cyan-300"></div>
    <div className="loading-dot p2 animate-pingslow bg-blue-400"></div>
    <div className="loading-dot p3 animate-pingslow bg-purple-400"></div>
    <div className="loading-dot p4 animate-pingslow bg-pink-500"></div>
    <div className="loading-dot p5 animate-pingslow bg-orange-500"></div>
  </div>  
  )
}