import { getAllDiagram } from "./http";

interface rectangle {
  type: string;
  x: number;
  y: number;
  height: number;
  width: number;
}

interface circle {
  type: string;
  centerX: number;
  centerY: number;
  radius: number;
}

interface ShapeProps {
  diagram: rectangle | circle;
}

export class Game {
  private allShapes: ShapeProps[] = [];
  private canvas: HTMLCanvasElement;
  private socket: WebSocket;
  private roomId: string;
  private startDraw: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private ctx: CanvasRenderingContext2D;
  private selectedTool: string;

  constructor(
    canvas: HTMLCanvasElement,
    socket: WebSocket,
    roomId: string,
    selectedTool: string
  ) {
    this.canvas = canvas;
    this.socket = socket;
    this.roomId = roomId;
    this.selectedTool = selectedTool;
    this.ctx = canvas.getContext("2d")!;
    this.initDraw();
    this.initHandler();
  }

  async initDraw() {
    const response = await getAllDiagram(this.roomId);
    this.allShapes = [...response];
    this.redrawDiagramsFromDB();
  }

  initHandler() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.socket.addEventListener("message", this.handleRecievingData);
  }

  destroyHandler() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.socket.removeEventListener("message", this.handleRecievingData);
  }

  handleMouseDown = (e: MouseEvent) => {
    console.log("mouse down");
    this.startDraw = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    console.log(this.selectedTool);
  };

  handleMouseUp = (e: MouseEvent) => {
    console.log("mouseup");
    this.startDraw = false;

    if (this.selectedTool === "rectangle") {
      const width = e.offsetX - this.startX;
      const height = e.offsetY - this.startY;

      const diagram = {
        type: "rectangle",
        x: this.startX,
        y: this.startY,
        height,
        width,
      };

      this.allShapes.push({ diagram });
      const message = {
        type: "chat",
        message: diagram,
        roomId: this.roomId,
      };

      this.socket.send(JSON.stringify(message));
    } else if (this.selectedTool === "circle") {
      const width = e.offsetX - this.startX;
      const height = e.offsetY - this.startY;

      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;
      const radius = Math.sqrt(width ** 2 + height ** 2) / 2;

      const diagram = {
        type: "circle",
        centerX,
        centerY,
        radius,
      };

      this.allShapes.push({ diagram });
      const message = {
        type: "chat",
        message: diagram,
        roomId: this.roomId,
      };

      this.socket.send(JSON.stringify(message));
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.startDraw) return;

    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;

    this.redrawExistingDiagrams();

    if (this.selectedTool === "rectangle") {
      this.ctx.strokeStyle = "white";
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    } else if (this.selectedTool === "circle") {
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;
      const radius = Math.sqrt(width ** 2 + height ** 2) / 2;

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  };

  handleRecievingData = (e: MessageEvent) => {
    const data = JSON.parse(e.data);

    this.allShapes.push({ diagram: data });

    this.allShapes.forEach((shape) => {
      const data = shape.diagram;

      if (data.type === "rectangle") {
        this.ctx.strokeRect(data.x, data.y, data.width, data.height);
      } else if (data.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(data.centerX, data.centerY, data.radius, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    });
  };

  redrawExistingDiagrams() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "white";

    this.allShapes.forEach((shape) => {
      const data = shape.diagram;

      if (data.type === "rectangle") {
        this.ctx.strokeRect(data.x, data.y, data.width, data.height);
      } else if (data.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(data.centerX, data.centerY, data.radius, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    });
  }

  redrawDiagramsFromDB() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "white";

    this.allShapes.forEach((shape) => {
      const data = shape.diagram;

      if (data.type === "rectangle") {
        this.ctx.strokeRect(data.x, data.y, data.width, data.height);
      } else if (data.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(data.centerX, data.centerY, data.radius, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    });
  }
}
