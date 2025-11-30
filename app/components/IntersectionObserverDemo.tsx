"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type BoxInfo = {
  id: number;
  ratio: number;
  isIntersecting: boolean;
};

// Generate threshold array for smooth ratio updates
const buildThresholdList = (): number[] => {
  const thresholds: number[] = [];
  const numSteps = 20;

  for (let i = 0; i <= numSteps; i++) {
    thresholds.push(i / numSteps);
  }

  return thresholds;
};

// Calculate background color based on ratio
const getBackgroundColor = (ratio: number): string => {
  // Transition from blue (not visible) to green (fully visible)
  const r = Math.round(75 - 75 * ratio);
  const g = Math.round(75 + 180 * ratio);
  const b = Math.round(200 - 50 * ratio);
  return `rgb(${r}, ${g}, ${b})`;
};

const IntersectionObserverDemo = () => {
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [boxInfos, setBoxInfos] = useState<BoxInfo[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      ratio: 0,
      isIntersecting: false,
    }))
  );

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      setBoxInfos((prev) => {
        const updated = [...prev];
        entries.forEach((entry) => {
          const id = parseInt(entry.target.getAttribute("data-id") || "0", 10);
          const index = updated.findIndex((info) => info.id === id);
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              ratio: entry.intersectionRatio,
              isIntersecting: entry.isIntersecting,
            };
          }
        });
        return updated;
      });
    },
    []
  );

  useEffect(() => {
    // Create Intersection Observer
    const options: IntersectionObserverInit = {
      root: null, // Use viewport as root
      rootMargin: "0px",
      threshold: buildThresholdList(), // Multiple thresholds for smooth updates
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    // Observe all boxes
    boxRefs.current.forEach((box) => {
      if (box) {
        observer.observe(box);
      }
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [handleIntersection]);

  return (
    <div className="min-h-screen py-8 px-4">
      <header className="text-center mb-8 sticky top-0 bg-white dark:bg-gray-900 py-4 z-10 shadow-md">
        <h1 className="text-3xl font-bold mb-2">Intersection Observer API Demo</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          スクロールして、ボックスがビューポートに入ると色が変わります
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          {boxInfos.map((info) => (
            <div
              key={info.id}
              className="px-3 py-1 rounded-full text-white text-xs"
              style={{ backgroundColor: getBackgroundColor(info.ratio) }}
            >
              Box {info.id + 1}: {Math.round(info.ratio * 100)}%
            </div>
          ))}
        </div>
      </header>

      <div className="flex flex-col items-center gap-8">
        {/* Spacer to ensure scrolling is needed */}
        <div className="h-48 flex items-center justify-center text-gray-400">
          ↓ スクロールしてください ↓
        </div>

        {boxInfos.map((info, index) => (
          <div
            key={info.id}
            ref={(el) => {
              boxRefs.current[index] = el;
            }}
            data-id={info.id}
            className="w-64 h-64 rounded-lg shadow-lg flex flex-col items-center justify-center text-white font-bold transition-all duration-100"
            style={{ backgroundColor: getBackgroundColor(info.ratio) }}
          >
            <div className="text-2xl mb-2">Box {info.id + 1}</div>
            <div className="text-lg">
              {info.isIntersecting ? "表示中" : "非表示"}
            </div>
            <div className="text-sm mt-2">
              交差率: {Math.round(info.ratio * 100)}%
            </div>
          </div>
        ))}

        {/* Spacer at the bottom */}
        <div className="h-48 flex items-center justify-center text-gray-400">
          ↑ スクロールして戻る ↑
        </div>
      </div>

      <footer className="text-center mt-8 py-4 text-gray-500 dark:text-gray-400 text-sm">
        <p>
          参考:{" "}
          <a
            href="https://developer.mozilla.org/ja/docs/Web/API/Intersection_Observer_API"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            MDN - Intersection Observer API
          </a>
        </p>
      </footer>
    </div>
  );
};

export default IntersectionObserverDemo;
