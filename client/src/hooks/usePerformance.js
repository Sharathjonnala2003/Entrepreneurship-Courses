import { useEffect, useState } from "react";

/**
 * A hook to measure and track component rendering performance
 * @param {string} componentName - Name of the component being measured
 * @param {boolean} logToConsole - Whether to log performance metrics to the console
 * @returns {object} Performance metrics and utility functions
 */
const usePerformance = (componentName, logToConsole = false) => {
  const [renderCount, setRenderCount] = useState(0);
  const [renderTimes, setRenderTimes] = useState([]);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // Mark render start time
    const startTime = performance.now();

    // Increment render count
    setRenderCount((prevCount) => prevCount + 1);

    // For first render only
    if (isFirstRender) {
      setIsFirstRender(false);
    }

    // Cleanup function to measure render time when component updates
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      setRenderTimes((prev) => [...prev, renderTime]);

      if (logToConsole) {
        console.log(
          `[Performance] ${componentName} rendered in ${renderTime.toFixed(
            2
          )}ms (render #${renderCount + 1})`
        );
      }
    };
  }, [componentName, renderCount, isFirstRender, logToConsole]);

  // Calculate average render time
  const averageRenderTime = renderTimes.length
    ? renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length
    : 0;

  // Method to reset performance metrics
  const resetMetrics = () => {
    setRenderCount(0);
    setRenderTimes([]);
    setIsFirstRender(true);
  };

  return {
    renderCount,
    renderTimes,
    averageRenderTime,
    isFirstRender,
    resetMetrics,
  };
};

export default usePerformance;
