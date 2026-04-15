import { useCallback, useState } from "react";
import type { JsPdfConstructor } from "../types/export-pdf";

const PAGE_MARGIN = 10;
const EXPORT_WIDTH = 1200;
const MAX_SCALE = 2;
const MIN_SCALE = 1;
const CHART_WIDTH = 590;

let pdfDepsPromise: Promise<{
  captureToCanvas: (
    element: HTMLElement,
    options?: object,
  ) => Promise<HTMLCanvasElement>;
  JsPdf: JsPdfConstructor;
}> | null = null;

async function loadPdfDependencies() {
  if (!pdfDepsPromise) {
    pdfDepsPromise = Promise.all([import("html2canvas"), import("jspdf")]).then(
      ([html2canvasModule, jspdfModule]) => ({
        captureToCanvas: html2canvasModule.default,
        JsPdf: jspdfModule.default,
      }),
    );
  }
  return pdfDepsPromise;
}

type Params = {
  targetRef: React.RefObject<HTMLElement | null>;
  filename: string;
};

type ExportPdfResult = { ok: true } | { ok: false; error: Error };

type Result = {
  exportPdf: () => Promise<ExportPdfResult>;
  isExporting: boolean;
  error: Error | null;
};

function toError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }

  return new Error("Failed to export report as PDF");
}

async function captureReportCanvas(
  element: HTMLElement,
  captureToCanvas: (
    element: HTMLElement,
    options?: object,
  ) => Promise<HTMLCanvasElement>,
): Promise<HTMLCanvasElement> {
  const originalInlineStyle = element.getAttribute("style");

  element.style.width = `${EXPORT_WIDTH}px`;
  element.style.maxWidth = `${EXPORT_WIDTH}px`;

  // Set the max width for the charts to avoid overflow.
  const canvases = document.querySelectorAll(
    "div.ant-row div[data-chart-source-type='Ant Design Charts']",
  );
  for (const canvas of canvases) {
    (canvas as HTMLElement).style.maxWidth = `${CHART_WIDTH}px`;
  }

  // Ensure browser applies width changes before capture.
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    return await captureToCanvas(element, {
      scale: Math.min(
        Math.max(window.devicePixelRatio || 1, MIN_SCALE),
        MAX_SCALE,
      ),
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: EXPORT_WIDTH,
      imageTimeout: 15000,
    });
  } finally {
    if (originalInlineStyle === null) {
      element.removeAttribute("style");
    } else {
      element.setAttribute("style", originalInlineStyle);
    }
    for (const canvas of canvases) {
      (canvas as HTMLElement).style.maxWidth = `100%`;
    }
  }
}

function buildPaginatedPdf(
  canvas: HTMLCanvasElement,
  filename: string,
  JsPdf: JsPdfConstructor,
): void {
  const pdf = new JsPdf({
    orientation: "p",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  const contentHeight = pageHeight - PAGE_MARGIN * 2;
  const mmPerPx = contentWidth / canvas.width;
  const maxSliceHeightPx = Math.max(1, Math.floor(contentHeight / mmPerPx));

  let startY = 0;
  let isFirstPage = true;

  while (startY < canvas.height) {
    const sliceHeightPx = Math.min(maxSliceHeightPx, canvas.height - startY);
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;

    const ctx = pageCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to prepare PDF page canvas");
    }

    ctx.drawImage(
      canvas,
      0,
      startY,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      pageCanvas.width,
      pageCanvas.height,
    );

    const imageData = pageCanvas.toDataURL("image/jpeg", 0.9);
    const renderedHeight = sliceHeightPx * mmPerPx;

    if (!isFirstPage) {
      pdf.addPage();
    }

    pdf.addImage(
      imageData,
      "JPEG",
      PAGE_MARGIN,
      PAGE_MARGIN,
      contentWidth,
      renderedHeight,
    );

    startY += sliceHeightPx;
    isFirstPage = false;
  }

  pdf.save(filename);
}

export function useReportPdfExport({ targetRef, filename }: Params): Result {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportPdf = useCallback(async () => {
    if (!targetRef.current || isExporting) {
      return {
        ok: false as const,
        error: new Error("Export is unavailable"),
      };
    }

    setError(null);
    setIsExporting(true);

    try {
      const element = targetRef.current;
      const { captureToCanvas, JsPdf } = await loadPdfDependencies();
      const canvas = await captureReportCanvas(element, captureToCanvas);
      buildPaginatedPdf(canvas, filename, JsPdf);
      return { ok: true as const };
    } catch (caughtError) {
      const exportError = toError(caughtError);
      setError(exportError);
      return { ok: false as const, error: exportError };
    } finally {
      setIsExporting(false);
    }
  }, [filename, isExporting, targetRef]);

  return {
    exportPdf,
    isExporting,
    error,
  };
}
