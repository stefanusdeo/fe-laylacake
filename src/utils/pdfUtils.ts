import React, { JSX, ReactNode } from "react";
import { pdf } from "@react-pdf/renderer";
import { on } from "events";
import { saveAs } from "file-saver";

export async function printPDF(
  pdfDoc: JSX.Element,
  onSuccess?: () => void,
  onError?: (error: any) => void
) {
  try {
    const blob = await pdf(pdfDoc).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl);
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          URL.revokeObjectURL(blobUrl);
          if (onSuccess) onSuccess();
        }, 500);
      };
    } else {
      URL.revokeObjectURL(blobUrl);
      window.print();
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    if (onError) onError(error);
  }
}

export async function downloadPDF(
  pdfDoc: JSX.Element,
  filename: string,
  onSuccess?: () => void,
  onError?: (error: any) => void
) {
  try {
    const blob = await pdf(pdfDoc).toBlob();
    saveAs(blob, filename);
    if (onSuccess) onSuccess();
  } catch (error) {
    if (onError) onError(error);
  }
}
