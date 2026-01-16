'use client';
import { useEffect, useRef } from 'react';

interface BookingsChartProps {
  data: Array<{
    month: string;
    count: number;
  }>;
}

export default function BookingsChart({ data }: BookingsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Format data
    const formattedData = data.map(item => ({
      ...item,
      month: new Date(item.month).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      })
    }));

    if (formattedData.length === 0) return;

    // Calculate dimensions
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / formattedData.length * 0.6;
    const barSpacing = chartWidth / formattedData.length * 0.4;

    // Find max value for scaling
    const maxValue = Math.max(...formattedData.map(d => d.count));
    const scale = chartHeight / (maxValue || 1);

    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw bars
    formattedData.forEach((item, index) => {
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
      const barHeight = item.count * scale;
      const y = canvas.height - padding - barHeight;

      // Draw bar
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value on top of bar
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.count.toString(), x + barWidth / 2, y - 5);

      // Draw month label
      ctx.save();
      ctx.translate(x + barWidth / 2, canvas.height - padding + 15);
      ctx.rotate(-Math.PI / 4);
      ctx.textAlign = 'right';
      ctx.fillText(item.month, 0, 0);
      ctx.restore();
    });

    // Draw grid lines
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      const value = Math.round(maxValue - (maxValue / 5) * i);
      ctx.fillText(value.toString(), padding - 5, y + 3);
    }
  }, [data]);

  return (
    <div className="w-full h-64">
      <canvas
        ref={canvasRef}
        width={800}
        height={256}
        className="w-full h-full"
      />
    </div>
  );
}
