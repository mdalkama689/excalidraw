import { ArrowRight, Circle, Eraser, Pencil, RectangleHorizontal } from "lucide-react";

interface IconBarProps {
  onClick: (tool: string) => void;
  selectedTool: string;
}
export const IconBar = ({ onClick, selectedTool }: IconBarProps) => {
  return (
    <div className="absolute top-2 w-fit flex items-center justify-center gap-6 bg-gray-700 p-2 rounded-lg shadow-md">
      <div
        className={`cursor-pointer  ${selectedTool === "pencil" ? "bg-gray-900 px-1 py-1 rounded" : "hover:scale-110"}`}
      >
        <Pencil
          onClick={() => onClick("pencil")}
          size={`${selectedTool === "pencil" ? "28" : "22"}`}
        />
      </div>
      <div
        className={`cursor-pointer  ${selectedTool === "rectangle" ? "bg-gray-900 px-0.5 py-0 rounded" : "hover:scale-110"}`}
      >
        <RectangleHorizontal
          onClick={() => onClick("rectangle")}
          size={`${selectedTool === "rectangle" ? "28" : "22"}`}
        />
      </div>
      <div
        className={`cursor-pointer  ${selectedTool === "circle" ? "bg-gray-900 rounded-full" : "hover:scale-110"}`}
      >
        <Circle
          onClick={() => onClick("circle")}
          size={`${selectedTool === "circle" ? "28" : "22"}`}
        />
      </div>

      <div
        className={`cursor-pointer  ${selectedTool === "arrow" ? "bg-gray-900 rounded-full" : "hover:scale-110"}`}
      >
        <ArrowRight
          onClick={() => onClick("arrow")}
          size={`${selectedTool === "arrow" ? "28" : "22"}`}
        />
        </div>
        <div
          className={`cursor-pointer  ${selectedTool === "eraser" ? "bg-gray-900 rounded-full" : "hover:scale-110"}`}
        >
          <Eraser
            onClick={() => onClick("eraser")}
            size={`${selectedTool === "eraser" ? "28" : "22"}`}
          />

      </div>
    </div>
  );
};
