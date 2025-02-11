import { getAllDiagram } from "./http";

interface ShapeProps {
  diagram: {
    type: string;
    x: number;
    y: number;
    height: number;
    width: number;
  };
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

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    this.canvas = canvas;
    this.socket = socket;
    this.roomId = roomId;
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
  };

  handleMouseUp = (e: MouseEvent) => {
    console.log("mouseup");
    this.startDraw = false;
    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;

    const diagram = {
      type: "rect",
      x: this.startX,
      y: this.startY,
      height,
      width,
    };
    console.log('diagram send : ', diagram)
    this.allShapes.push({ diagram });
    const message = {
      type: "chat",
      message: diagram,
      roomId: this.roomId,
    };

    this.socket.send(JSON.stringify(message));
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.startDraw) return;

    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;

    this.redrawExistingDiagrams();
    this.ctx.strokeStyle = "white";
    this.ctx.strokeRect(this.startX, this.startY, width, height);
  };

  handleRecievingData = (e: MessageEvent) => {
    const data = JSON.parse(e.data);

    this.allShapes.push({ diagram: data });
    this.allShapes.forEach((shape) => {
      const data = shape.diagram;
      this.ctx.strokeRect(data.x, data.y, data.width, data.height);
    });
  };

  redrawExistingDiagrams() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "white";
    this.allShapes.forEach((shape) => {
      const data = shape.diagram;
      this.ctx.strokeRect(data.x, data.y, data.width, data.height);
    });
  }

  redrawDiagramsFromDB() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "white";
    this.allShapes.forEach((shape) => {
      const data = shape.diagram;
      this.ctx.strokeRect(data.x, data.y, data.width, data.height);
    });
  }
}
