"use client";
import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const PAGE_WIDTH = 816;
const MINIMUM_SPACE = 100;

const rulerMarks = Array.from({ length: 83 }, (_, i) => {
  const position = (i * PAGE_WIDTH) / 82;
  const isMajorMark = i % 10 === 0;
  const isMediumMark = i % 5 === 0 && i % 10 !== 0;

  return {
    position,
    isMajorMark,
    isMediumMark,
    label: isMajorMark ? (i / 10 + 1).toString() : null,
  };
});

export const Ruler = () => {
  const [leftMargin, setLeftMargin] = useState(56);
  const [rightMargin, setRightMargin] = useState(56);

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  const rulerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if ((isDraggingLeft || isDraggingRight) && rulerRef.current) {
      const container = rulerRef.current.querySelector("#ruler-container");

      if (container) {
        const containerRect = container.getBoundingClientRect();
        const relativeX = e.clientX - containerRect.left;
        const rawPosition = Math.max(0, Math.min(PAGE_WIDTH, relativeX));

        if (isDraggingLeft) {
          const maxLeftPosition = PAGE_WIDTH - rightMargin - MINIMUM_SPACE;
          const newLeftPosition = Math.min(rawPosition, maxLeftPosition);
          setLeftMargin(newLeftPosition);
        } else if (isDraggingRight) {
          const maxRightPosition = PAGE_WIDTH - leftMargin - MINIMUM_SPACE;
          const newRightPosition = Math.max(815 - rawPosition, 0);
          const constrainedRightPosition = Math.min(
            newRightPosition,
            maxRightPosition,
          );
          setRightMargin(constrainedRightPosition);
        }
      }
    }
  };

  return (
    <div
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={() => {
        setIsDraggingLeft(false);
        setIsDraggingRight(false);
      }}
      onMouseLeave={() => {
        setIsDraggingLeft(false);
        setIsDraggingRight(false);
      }}
      className="relative flex items-end h-6 border-b select-none print:hidden"
    >
      <div
        id="ruler-container"
        className="max-w-[816px] mx-auto size-full relative"
      >
        <Marker
          position={leftMargin}
          isLeft={true}
          isDragging={isDraggingLeft}
          onMouseDown={() => {
            setIsDraggingLeft(true);
          }}
          onDoubleClick={() => {
            setLeftMargin(56);
          }}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          onMouseDown={() => {
            setIsDraggingRight(true);
          }}
          onDoubleClick={() => {
            setRightMargin(56);
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-full">
          <div className="relative h-full w-[816px]">
            {rulerMarks.map(
              ({ position, isMajorMark, isMediumMark, label }) => (
                <div
                  key={position}
                  className="absolute bottom-0"
                  style={{ left: `${position}px` }}
                >
                  {isMajorMark && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-muted-foreground" />
                      <span className="absolute text-xs transform -translate-x-1/2 bottom-2 text-muted-foreground">
                        {label}
                      </span>
                    </>
                  )}
                  {isMediumMark && (
                    <div className="absolute bottom-0 w-[1px] h-1.5 bg-muted-foreground" />
                  )}
                  {!isMajorMark && !isMediumMark && (
                    <div className="absolute bottom-0 w-[1px] h-1 bg-muted-foreground" />
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  isDragging,
  isLeft,
  onDoubleClick,
  onMouseDown,
  position,
}: MarkerProps) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
      style={{
        [isLeft ? "left" : "right"]: `${position}px`,
      }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute top-0 h-full transform -translate-x-1/2 left-1/2 fill-blue-500" />
      <div
        className="absolute transform -translate-x-1/2 top-4 left-1/2 bg-muted-foreground"
        style={{
          height: "100vh",
          width: "1px",
          transform: "scaleX(0.5)",
          display: isDragging ? "block" : "none",
        }}
      ></div>
    </div>
  );
};
