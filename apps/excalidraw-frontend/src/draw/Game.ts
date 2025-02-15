import { getAllDiagram } from "./http";
import { v4 as uuid } from "uuid";

interface rectangle {
  id: string;
  type: string;
  x: number;
  y: number;
  height: number;
  width: number;
}

interface circle {
  id: string;
  type: string;
  centerX: number;
  centerY: number;
  radius: number;
}

interface arrow {
  id: string;
  type: string;
  x: number;
  y: number;
  toX: number;
  toY: number;
  angle: number;
  headlen: number;
}

interface pencil {
  id: string;
  type: "pencil";
  pencilValue: [{ x: number; y: number }];
}

interface ShapeProps {
  diagram: rectangle | circle | arrow | pencil;
}

export class Game {
  private allShapes: ShapeProps[] = [];
  private canvas: any;
  private socket: WebSocket;
  private roomId: string;
  private startDraw: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private ctx: CanvasRenderingContext2D;
  private selectedTool: string = "circle";
  private diagram: any;
  private pencilArray = [];
  private clickX: number = 0;
  private clickY: number = 0;
  private message;
  private diagramId;

  constructor(canvas: any, socket: WebSocket, roomId: string) {
    this.canvas = canvas;
    this.socket = socket;
    this.roomId = roomId;
    this.ctx = canvas.getContext("2d")!;
    this.initDraw();
    this.initHandler();
  }

  setTool(
    tool: "rectangle" | "circle" | "arrow" | "pencil" | "text" | "eraser"
  ) {
    this.selectedTool = tool;
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
    this.startDraw = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;

    if (this.selectedTool === "eraser") {
      this.clickX = e.offsetX;
      this.clickY = e.offsetY;

      this.allShapes.map((shape: any) => {
        const data = shape.diagram;
        if (data.type === "rectangle") {
          this.diagramId = this.rectEraseId(data);
        } else if (data.type === "circle") {
          this.diagramId = this.circeEraseId(data);
        } else if (data.type === "arrow") {
          this.diagramId = this.arrowEraseId(data);
        } else if (data.type === "pencil") {
          this.diagramId = this.pencilEraseId(data);
        }

        if (this.diagramId) {
          const message = {
            type: "erase",
            id: data.id,
            roomId: this.roomId,
          };
          this.socket.send(JSON.stringify(message));
          this.allShapes = this.allShapes.filter(
            (x) => x.diagram.id != data.id
          );
          this.redrawExistingDiagrams();
        }
      });
    }
  };

  rectEraseId(data: any) {
    const minX = data.x;
    const maxX = data.x + data.width;
    const minY = data.y;
    const maxY = data.y + data.height;

    const condition1 = minX <= this.clickX && this.clickX <= maxX;
    const condition2 = minY <= this.clickY && this.clickY <= maxY;

    console.log(" condition1 && condition2 : ", condition1 && condition2);
    if (condition1 && condition2) {
      return data.id;
    }
    return null;
  }

  circeEraseId(data: any) {
    let x = this.clickX - data.centerX;
    let y = this.clickY - data.centerY;
    x = x * x;
    y = y * y;

    const ans = Math.sqrt(x + y);

    if (ans <= data.radius) {
      return data.id;
    }
    return null;
  }

  handleMouseUp = (e: MouseEvent) => {
    this.startDraw = false;

    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;

    if (this.selectedTool === "rectangle") {
      this.createRectanlge(width, height);
    } else if (this.selectedTool === "circle") {
      this.createCirlce(width, height);
    } else if (this.selectedTool === "arrow") {
      this.createArrow(e.offsetX, e.offsetY);
    } else if (this.selectedTool === "pencil") {
      this.createPencil();
    }

    const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
    
    // this is code repetation solve after some time

    const fromX = this.startX;
    const fromY = this.startY;
    const toX = e.offsetX;
    const toY = e.offsetY;

    const distanceX = toX - fromX;
    const distanceY = toY - fromY;

    const angle = Math.atan2(distanceY, distanceX);

    if (
      height === 0 &&
      width === 0 &&
      radius === 0 &&
      this.pencilArray.length === 0 &&
      angle === 0
    )
      return;
    if (!this.diagram) return;

    this.allShapes.push({ diagram: this.diagram });

    const message = {
      type: "chat",
      message: this.diagram,
      roomId: this.roomId,
    };
    console.log(this.diagram);
    this.socket.send(JSON.stringify(message));
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.startDraw) return;

    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;
    const centerX = this.startX + width / 2;
    const centerY = this.startY + height / 2;
    const radius = Math.sqrt(width ** 2 + height ** 2) / 2;

    this.redrawExistingDiagrams();
    this.ctx.strokeStyle = "white";

    if (this.selectedTool === "rectangle") {
      this.printRectangle(this.startX, this.startY, width, height);
    } else if (this.selectedTool === "circle") {
      this.printCircle(centerX, centerY, radius);
    } else if (this.selectedTool === "arrow") {
      this.printArrowForMove(e.offsetX, e.offsetY);
    } else if (this.selectedTool === "pencil") {
      // @ts-ignore
      this.pencilArray.push({ x: e.offsetX, y: e.offsetY });
      this.drawPencil();
    } else if (this.selectedTool === "eraser") {
      // console.log('eraser')
    }
  };

  handleRecievingData = (message: MessageEvent) => {
    const data = JSON.parse(message.data);
    console.log(data);
    console.log(typeof data);
    // this is for erase
    if (typeof data === "string") {
      this.allShapes = this.allShapes.filter((x) => x.diagram.id != data);
      this.redrawExistingDiagrams();
      return;
    }

    this.allShapes.push({ diagram: data });

    this.allShapes.forEach((shape: any) => {
      const data = shape.diagram;

      if (data.type === "rectangle") {
        this.printRectangle(data.x, data.y, data.width, data.height);
      } else if (data.type === "circle") {
        this.printCircle(data.centerX, data.centerY, data.radius);
      } else if (data.type === "arrow") {
        this.printArrow(
          data.fromX,
          data.fromY,
          data.toX,
          data.toY,
          data.angle,
          data.headlen
        );
      } else if (data.type === "pencil") {
        this.ctx.beginPath();

        this.ctx.moveTo(data.pencilValue[0].x, data.pencilValue[0].y);

        data.pencilValue.map((p: any) => {
          this.ctx.lineTo(p.x, p.y);
        });
        this.ctx.stroke();
      }
    });
  };

  redrawExistingDiagrams() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "white";

    this.allShapes.forEach((shape: any) => {
      const data = shape.diagram;

      if (data.type === "rectangle") {
        this.printRectangle(data.x, data.y, data.width, data.height);
      } else if (data.type === "circle") {
        this.printCircle(data.centerX, data.centerY, data.radius);
      } else if (data.type === "arrow") {
        this.printArrow(
          data.fromX,
          data.fromY,
          data.toX,
          data.toY,
          data.angle,
          data.headlen
        );
      } else if (data.type === "pencil") {
        this.ctx.beginPath();
        // @ts-ignore
        this.ctx.moveTo(data.pencilValue[0].x, data.pencilValue[0].y);
        // @ts-ignore
        data.pencilValue.map((p) => {
          this.ctx.lineTo(p.x, p.y);
        });
        this.ctx.stroke();
      }
    });
  }

  redrawDiagramsFromDB() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "white";

    this.allShapes.forEach((shape: any) => {
      const data = shape.diagram;

      if (data.type === "rectangle") {
        this.printRectangle(data.x, data.y, data.width, data.height);
      } else if (data.type === "circle") {
        this.printCircle(data.centerX, data.centerY, data.radius);
      } else if (data.type === "arrow") {
        this.printArrow(
          data.fromX,
          data.fromY,
          data.toX,
          data.toY,
          data.angle,
          data.headlen
        );
      } else if (data.type === "pencil") {
        this.ctx.beginPath();
        // @ts-ignore
        this.ctx.moveTo(data.pencilValue[0].x, data.pencilValue[0].y);
        // @ts-ignore
        data.pencilValue.map((p) => {
          this.ctx.lineTo(p.x, p.y);
        });
        this.ctx.stroke();
      }
    });
  }

  createRectanlge(width: number, height: number) {
    this.diagram = {
      id: uuid(),
      type: "rectangle",
      x: this.startX,
      y: this.startY,
      height,
      width,
    };

    return this.diagram;
  }

  createCirlce(width: number, height: number) {
    const centerX = this.startX + width / 2;
    const centerY = this.startY + height / 2;

    const radius = Math.sqrt(width ** 2 + height ** 2) / 2;

    this.diagram = {
      id: uuid(),
      type: "circle",
      centerX,
      centerY,
      radius,
    };

    return this.diagram;
  }

  createArrow(offsetX: number, offsetY: number) {
    const fromX = this.startX;
    const fromY = this.startY;
    const toX = offsetX;
    const toY = offsetY;
    const headlen = 10;

    const distanceX = toX - fromX;
    const distanceY = toY - fromY;

    const angle = Math.atan2(distanceY, distanceX);

    this.diagram = {
      id: uuid(),
      type: "arrow",
      fromX,
      fromY,
      toX,
      toY,
      headlen,
      angle,
    };

    return this.diagramId;
  }

  createPencil() {
    const pencilValue = this.pencilArray;
    this.diagram = {
      id: uuid(),
      type: "pencil",
      pencilValue,
    };

    if (this.pencilArray.length > 0) {
      this.pencilArray = [];
    }
    return this.diagram;
  }

  printRectangle(
    startX: number,
    startY: number,
    width: number,
    height: number
  ) {
    this.ctx.strokeRect(startX, startY, width, height);
  }

  printCircle(centerX: number, centerY: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  printArrowForMove(offsetX: number, offsetY: number) {
    this.ctx.beginPath();
    const fromX = this.startX;
    const fromY = this.startY;
    const toX = offsetX;
    const toY = offsetY;

    const headlen = 10;
    const distanceX = toX - fromX;
    const distanceY = toY - fromY;

    const angle = Math.atan2(distanceY, distanceX);

    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.lineTo(
      toX - headlen * Math.cos(angle - Math.PI / 6),
      toY - headlen * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(
      toX - headlen * Math.cos(angle + Math.PI / 6),
      toY - headlen * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();
  }

  printArrow(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    angle: number,
    headlen: number
  ) {
    this.ctx.beginPath();

    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.lineTo(
      toX - headlen * Math.cos(angle - Math.PI / 6),
      toY - headlen * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(
      toX - headlen * Math.cos(angle + Math.PI / 6),
      toY - headlen * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();
  }

  drawPencil() {
    this.ctx.beginPath();
    // @ts-ignore
    this.ctx.moveTo(this.pencilArray[0].x, this.pencilArray[0].y);
    // @ts-ignore
    this.pencilArray.map((p) => {
      // @ts-ignore
      this.ctx.lineTo(p.x, p.y);
    });

    this.ctx.stroke();
  }

  arrowEraseId(data: any, exactThreshold = 2, nearThreshold = 8) {
    const { fromX, fromY, toX, toY } = data;

    const dx = toX - fromX;
    const dy = toY - fromY;
    const lengthSquared = dx * dx + dy * dy;

    let t =
      ((this.clickX - fromX) * dx + (this.clickY - fromY) * dy) / lengthSquared;

    t = Math.max(0, Math.min(1, t));

    const closestX = fromX + t * dx;
    const closestY = fromY + t * dy;

    const distance = Math.sqrt(
      (this.clickX - closestX) ** 2 + (this.clickY - closestY) ** 2
    );

    if (distance <= exactThreshold) {
      return data.id;
    } else if (distance <= nearThreshold) {
      return data.id;
    }
    return null;
  }

  pencilEraseId(data: any, exactThreshold = 2, nearThreshold = 8) {
    const pencilStroke = data.pencilValue;

    for (let i = 0; i < pencilStroke.length - 1; i++) {
      const fromX = pencilStroke[i].x;
      const fromY = pencilStroke[i].y;
      const toX = pencilStroke[i + 1].x;
      const toY = pencilStroke[i + 1].y;

      const dx = toX - fromX;
      const dy = toY - fromY;
      const lengthSquared = dx * dx + dy * dy;

      let t =
        ((this.clickX - fromX) * dx + (this.clickY - fromY) * dy) /
        lengthSquared;
      t = Math.max(0, Math.min(1, t)); // Clamp 't' between 0 and 1

      const closestX = fromX + t * dx;
      const closestY = fromY + t * dy;

      const distance = Math.sqrt(
        (this.clickX - closestX) ** 2 + (this.clickY - closestY) ** 2
      );

      if (distance <= exactThreshold || distance <= nearThreshold) {
        return data.id;
      }
    }

    return false;
  }
}
