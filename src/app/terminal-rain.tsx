import type { CSSProperties } from "react";

function scatter(index: number, salt: number, range: number) {
  return (index * (salt + 17) + index * index * 7 + salt * 13) % range;
}

const rainColumns = Array.from({ length: 34 }, (_, index) => {
  const bitCount = 13 + scatter(index, 19, 47);
  const horizontalJitter = (scatter(index, 31, 19) - 9) / 5;

  return {
    id: index,
    left: `${-2 + index * (104 / 33) + horizontalJitter}%`,
    top: `${-12 - scatter(index, 7, 34)}vh`,
    delay: `${-(scatter(index, 23, 91) / 10)}s`,
    duration: `${3.6 + scatter(index, 11, 58) / 10}s`,
    opacity: 0.08 + scatter(index, 29, 24) / 100,
    fontSize: `${10 + scatter(index, 5, 9)}px`,
    lineHeight: 1.05 + scatter(index, 17, 47) / 100,
    startX: `${-14 + scatter(index, 37, 29)}px`,
    endX: `${-18 + scatter(index, 43, 37)}px`,
    bits: Array.from({ length: bitCount }, (_, bit) => {
      const signal = scatter(bit + index * 3, index + 5, 17);

      if (signal === 0 || signal === 8) {
        return " ";
      }

      return signal % 3 === 0 ? "1" : "0";
    }).join("\n"),
  };
});

export default function TerminalRain() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {rainColumns.map((column) => (
        <span
          key={column.id}
          className="terminal-rain-column absolute whitespace-pre text-terminal-green"
          style={
            {
              left: column.left,
              top: column.top,
              opacity: column.opacity,
              fontSize: column.fontSize,
              lineHeight: column.lineHeight,
              animationDelay: column.delay,
              "--rain-duration": column.duration,
              "--rain-start-x": column.startX,
              "--rain-end-x": column.endX,
            } as CSSProperties
          }
        >
          {column.bits}
        </span>
      ))}
    </div>
  );
}
