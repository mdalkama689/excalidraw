import { Circle, Pencil, RectangleHorizontal } from "lucide-react"

interface IconBarProps {
    onClick: (tool: string)=> void,
    selectedTool: string 
}
export const IconBar = ({onClick, selectedTool}: IconBarProps) => {
  return(
    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[500px] flex items-center justify-center gap-3 bg-red-400 dark:bg-gray-800 p-2 rounded-lg shadow-md">
    <Pencil
      onClick={() => onClick("pencil")}
      size={64}
      className={`p-2 rounded-md transition-all ${
        selectedTool === "pencil"
          ? "bg-gray-900 text-white scale-125 shadow-lg"
          : "text-gray-200 hover:scale-110"
      }`}
    />
    <RectangleHorizontal 
      onClick={() => onClick('rectangle')}
      size={64}
      className={`p-2 rounded-md transition-all ${
        selectedTool === "rectangle"
          ? "bg-gray-900 text-white scale-125 shadow-lg"
          : "text-gray-200 hover:scale-110"
      }`}     
      />
    <Circle
      onClick={() => onClick('circle')}
      size={64}
      className={`p-2 rounded-md transition-all ${
        selectedTool === "circle"
          ? "bg-gray-900 text-white scale-125 shadow-lg"
          : "text-gray-200 hover:scale-110"
      }`}
    />
  </div>
  )
}