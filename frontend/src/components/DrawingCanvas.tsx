'use client';

import { useRef, useEffect, useState } from 'react';
import { Eraser, Pencil, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawingCanvasProps {
    onDraw: (pixels: number[]) => void;
}

export default function DrawingCanvas({ onDraw }: DrawingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initialize black background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'white';
    }, []);

    const getPixelData = () => {
        const canvas = canvasRef.current;
        if (!canvas) return [];

        // Create a temporary 28x28 canvas for resizing
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 28;
        tempCanvas.height = 28;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return [];

        // Draw main canvas onto temp canvas
        tempCtx.drawImage(canvas, 0, 0, 28, 28);

        // Get pixel data
        const imageData = tempCtx.getImageData(0, 0, 28, 28);
        const data = imageData.data;
        const pixels: number[] = [];

        // Extract grayscale values (0-1)
        for (let i = 0; i < data.length; i += 4) {
            // R, G, B are same for grayscale. Alpha is ignored.
            // Normalize 0-255 to 0-1
            pixels.push(data[i] / 255.0);
        }

        return pixels;
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = (e as React.MouseEvent).clientX - rect.left;
            y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.beginPath();
        ctx.moveTo(x, y);

        // Draw a single dot in case it's just a click
        ctx.lineWidth = tool === 'pencil' ? 20 : 30;
        ctx.lineCap = 'round';
        ctx.strokeStyle = tool === 'pencil' ? 'white' : 'black';
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.beginPath(); // Reset path to avoid connecting to next stroke
        }
        const pixels = getPixelData();
        onDraw(pixels);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = (e as React.MouseEvent).clientX - rect.left;
            y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.lineWidth = tool === 'pencil' ? 20 : 30;
        ctx.lineCap = 'round';
        ctx.strokeStyle = tool === 'pencil' ? 'white' : 'black';

        ctx.lineTo(x, y);
        ctx.stroke();

        // Keep the path continuous for this stroke, but we need to ensure smooth curves
        // The previous implementation did beginPath/moveTo every frame which is one style
        // But standard is just lineTo. However, to keep it simple and working with the dot logic:
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        onDraw(new Array(784).fill(0));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden border border-white/10 shadow-inner">
                <canvas
                    ref={canvasRef}
                    width={280}
                    height={280}
                    className="w-full h-full touch-none cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                />
            </div>

            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => setTool('pencil')}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            tool === 'pencil' ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:text-white"
                        )}
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setTool('eraser')}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            tool === 'eraser' ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:text-white"
                        )}
                    >
                        <Eraser className="w-4 h-4" />
                    </button>
                </div>
                <button
                    onClick={clearCanvas}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
