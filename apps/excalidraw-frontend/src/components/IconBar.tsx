import { Circle, Pencil, RectangleHorizontal } from "lucide-react"

export const IconBar = ({onClick, setSelectedTool}) => {
  return(
    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[10%] flex items-center justify-center gap-3 bg-red-400 dark:bg-gray-800 p-2 rounded-lg shadow-md">
    <Pencil 
    onClick={() => onClick('pencil')}
    />
    <RectangleHorizontal 
      onClick={() => onClick('rectangle')}
    />
    <Circle
      onClick={() => onClick('circle')}
    />
  </div>
  )
}