import { useEffect, useRef } from "react";
import { Logbook, Increment } from "../../types/logbook";

const LogbookVisualizer = ({ logbook }: { logbook: Logbook }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  useEffect(() => {

    if (!window) return;

    const canvas = canvasRef.current;
    if (canvas == null) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageWidth = 1027;
    const imageHeight = 563;
    const aspectR = imageWidth / imageHeight;
    let squareW = 32.4;
    let squareH = 35;

    let width = imageWidth, height = imageHeight;
    let chartStartPoint: [number, number] = [130, 385];

    let ratioW = 1;
    let ratioH = 1;

    if (window.innerWidth < 600) {
      width = window.innerWidth;
      height = window.innerWidth / aspectR;

      ratioW = width / imageWidth;
      ratioH = height / imageHeight;

      squareW = squareW * ratioW;
      squareH = squareH * ratioH;
      chartStartPoint = [130 * ratioW, 385 * ratioH];
    }



    const date = new Date(logbook.date);
  
    const totalHours: Record<string, number> = {
      "OFF DUTY": 0,
      "SLEEPER BERTH": 0,
      "DRIVING": 0,
      "ON DUTY": 0,
    };
  
    logbook.increments.forEach((inc) => {
      totalHours[inc.dutyStatus] += 0.5;
    });
  
    const statusPositions: Record<string, number> = {
      "OFF DUTY": chartStartPoint[1],
      "SLEEPER BERTH": chartStartPoint[1] + squareH,
      "DRIVING": chartStartPoint[1] + squareH * 2,
      "ON DUTY": chartStartPoint[1] + squareH * 3,
    };
  
    const remarkHeight = chartStartPoint[1] + squareH * 4.9;


    const drawLogBookData = (ctx: CanvasRenderingContext2D, logBook: Logbook) => {
      const { increments }: { increments: Increment[] } = logBook;
      let lastStatus = increments[0].dutyStatus;
      let lastPoint: [number, number] = [...chartStartPoint];
  
      increments.forEach((inc, i) => {
        const x = chartStartPoint[0] + ((i + 1) * squareW) / 2;
        const y = statusPositions[inc.dutyStatus];
        
        if (lastStatus !== inc.dutyStatus) {
          ctx.beginPath();
          ctx.moveTo(...lastPoint);
          ctx.lineTo(lastPoint[0], y);
          ctx.stroke();
        }
  
        ctx.beginPath();
        ctx.moveTo(lastPoint[0], y);
        ctx.lineTo(x, y);
        ctx.stroke();
  
        if (inc.remark) {
          ctx.save();
          ctx.translate(x - squareW * 1.8, remarkHeight);
          ctx.rotate((-30 * Math.PI) / 180);
          ctx.font = `${16 * ratioW}px Arial`;
          ctx.fillText(`${inc.remark.city}, ${inc.remark.state}`, 0, 0);
          ctx.restore();
  
          ctx.save();
          ctx.translate(x - squareW * 1.6, remarkHeight + squareH / 2);
          ctx.rotate((-30 * Math.PI) / 180);
          ctx.font = `${16 * ratioW}px Arial`;
          ctx.fillText(`${inc.remark.detail}`, 0, 0, squareH * 4);
          ctx.restore();
        }
  
        lastPoint = [x, y];
        lastStatus = inc.dutyStatus;
      });
    };

    const img = new Image();
    img.src = "/blank-logbook.jpeg";
    img.onload = () => {


      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      
      ctx.font = `${24 * ratioW}px Arial`;
      ctx.fillText(`${(date.getMonth() + 1).toString().padStart(2, "0")}`, 366 * ratioW, 34 * ratioH);
      ctx.fillText(`${date.getDate().toString().padStart(2, "0")}`, 450 * ratioW, 34 * ratioH);
      ctx.fillText(`${date.getFullYear()}`, 520 * ratioW, 34 * ratioH);
      ctx.fillText(logbook.initials, 665 * ratioW, 88 * ratioH);
      
      ctx.textAlign = "center";
      ctx.fillText(totalHours["OFF DUTY"].toString(), chartStartPoint[0] + squareW * 25 + 21 * ratioW, statusPositions["OFF DUTY"] + 14 * ratioH);
      ctx.fillText(totalHours["SLEEPER BERTH"].toString(), chartStartPoint[0] + squareW * 25 + 21 * ratioW, statusPositions["SLEEPER BERTH"] + 14 * ratioH);
      ctx.fillText(totalHours["DRIVING"].toString(), chartStartPoint[0] + squareW * 25 + 21 * ratioW, statusPositions["DRIVING"] + 13 * ratioH);
      ctx.fillText(totalHours["ON DUTY"].toString(), chartStartPoint[0] + squareW * 25 + 21 * ratioW, statusPositions["ON DUTY"] + 13 * ratioH);
      
      drawLogBookData(ctx, logbook);
    };
  }, []);


  return <canvas ref={canvasRef} className="border-b-2 border-r-2 border-black" />;
};

export default LogbookVisualizer;