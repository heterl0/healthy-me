import { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Params = {
  targetRef: React.RefObject<HTMLElement | null>;
  filename: string;
};

type Result = {
  exportPdf: () => Promise<void>;
  isExporting: boolean;
};

const PAGE_MARGIN = 10;

export function useReportPdfExport({ targetRef, filename }: Params): Result {
  const [isExporting, setIsExporting] = useState(false);

  const exportPdf = useCallback(async () => {
    if (!targetRef.current || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      // Set fixed width for consistent rendering across mobile and desktop
      const element = targetRef.current;
      const originalWidth = element.style.width;

      // Use fixed width of 1200px for consistent output
      element.style.width = "1200px";

      const canvas = await (async () => {
        try {
          return await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            allowTaint: true,
            windowWidth: 1200,
          });
        } finally {
          // Always restore original width after capture attempt
          element.style.width = originalWidth;
        }
      })();

      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - PAGE_MARGIN * 2;
      const contentHeight = pageHeight - PAGE_MARGIN * 2;

      const sourceWidth = canvas.width;
      const sourceHeight = canvas.height;

      // Calculate height while maintaining aspect ratio to fit on single page
      let renderedHeight = (sourceHeight * contentWidth) / sourceWidth;

      // If content exceeds page height, scale down proportionally
      if (renderedHeight > contentHeight) {
        renderedHeight = contentHeight;
      }

      // Add image to single page
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        PAGE_MARGIN,
        PAGE_MARGIN,
        contentWidth,
        renderedHeight,
      );

      pdf.save(filename);
    } finally {
      setIsExporting(false);
    }
  }, [filename, isExporting, targetRef]);

  return {
    exportPdf,
    isExporting,
  };
}
