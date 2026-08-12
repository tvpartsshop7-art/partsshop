import { jsPDF } from 'jspdf';
import { Product, Order } from '../types';

export function generateAndDownloadPdf(product: Product, order?: Partial<Order>) {
  // If the admin uploaded a local PDF file, download that exact attached PDF file
  if (product.localPdfDataUrl) {
    const link = document.createElement('a');
    link.href = product.localPdfDataUrl;
    link.download = product.pdfFileName || `${product.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryColor = [37, 99, 235]; // Royal Blue
  const darkColor = [15, 23, 42]; // Slate 900
  const grayColor = [100, 116, 139]; // Slate 500
  const accentColor = [245, 158, 11]; // Amber

  // Helper for page background header banner
  const drawHeaderBanner = () => {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 12, 'F');
  };

  // Helper for page footer
  const drawFooter = (pageNum: number, totalPages: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);

    const buyerInfo = order?.customerEmail
      ? `Licensed to: ${order.customerEmail} | Order #${order.id || 'DEMO-1001'}`
      : `PDFStore Digital Edition | Verified License`;

    doc.text(buyerInfo, margin, pageHeight - 10);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
  };

  // ================= PAGE 1: COVER PAGE =================
  // Top Banner Accent
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('PDFSTORE OFFICIAL DIGITAL PUBLICATION', margin, 18);

  // Category Badge
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(margin, 45, 35, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(product.category.toUpperCase(), margin + 4, 50.5);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  const titleLines = doc.splitTextToSize(product.title, contentWidth);
  doc.text(titleLines, margin, 68);

  let currentY = 68 + titleLines.length * 10;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  const subtitleLines = doc.splitTextToSize(product.subtitle, contentWidth);
  doc.text(subtitleLines, margin, currentY);

  currentY += subtitleLines.length * 7 + 15;

  // Decorative Box / Verification Seal
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 55, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('VERIFIED DIGITAL LICENSE & PRODUCT SPECIFICATIONS', margin + 8, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(`Author / Creator: ${product.authorName}`, margin + 8, currentY + 22);
  doc.text(`Total Pages: ${product.pdfPageCount} Pages`, margin + 8, currentY + 30);
  doc.text(`Format: High-Resolution PDF (${product.pdfFileSize})`, margin + 8, currentY + 38);

  const purchaseEmail = order?.customerEmail || 'Instant Buyer';
  const orderId = order?.id || 'ORD-84920';
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // Emerald Green
  doc.text(`Licensed Purchaser: ${purchaseEmail} [${orderId}]`, margin + 8, currentY + 47);

  currentY += 75;

  // Key Highlights Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Key Learning Objectives & Takeaways:', margin, currentY);

  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);

  product.keyTakeaways.forEach((takeaway) => {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.circle(margin + 3, currentY - 1.5, 1.5, 'F');
    const takeawayLines = doc.splitTextToSize(takeaway, contentWidth - 10);
    doc.text(takeawayLines, margin + 8, currentY);
    currentY += takeawayLines.length * 6 + 3;
  });

  drawFooter(1, 3);

  // ================= PAGE 2: TABLE OF CONTENTS & INTRODUCTION =================
  doc.addPage();
  drawHeaderBanner();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Table of Contents', margin, 30);

  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 35, pageWidth - margin, 35);

  let tocY = 45;
  product.tableOfContents.forEach((toc) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(toc.title, margin, tocY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`p. ${toc.pageNumber}`, pageWidth - margin - 15, tocY);

    // Dotted line
    doc.setDrawColor(203, 213, 225);
    doc.setLineDashPattern([1, 2], 0);
    doc.line(margin + 100, tocY - 1, pageWidth - margin - 20, tocY - 1);
    doc.setLineDashPattern([], 0);

    tocY += 12;
  });

  tocY += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Executive Summary & Preface', margin, tocY);

  tocY += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  const descLines = doc.splitTextToSize(product.description, contentWidth);
  doc.text(descLines, margin, tocY);

  drawFooter(2, 3);

  // ================= PAGE 3: CHAPTER CONTENT & LESSONS =================
  doc.addPage();
  drawHeaderBanner();

  let chapY = 30;

  if (product.customPdfContent?.chapters) {
    product.customPdfContent.chapters.forEach((chap, idx) => {
      if (chapY > pageHeight - 50) {
        drawFooter(3, 3);
        doc.addPage();
        drawHeaderBanner();
        chapY = 30;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(chap.title, margin, chapY);

      chapY += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);

      chap.content.forEach((paragraph) => {
        const lines = doc.splitTextToSize(paragraph, contentWidth);
        doc.text(lines, margin, chapY);
        chapY += lines.length * 5 + 4;
      });

      chapY += 6;
    });
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('1. Core Concepts & Practical Implementation', margin, chapY);

    chapY += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    const sampleLines = doc.splitTextToSize(
      product.sampleTextPages[0] || 'Detailed guide contents and actionable frameworks included in full edition.',
      contentWidth
    );
    doc.text(sampleLines, margin, chapY);
  }

  // Final License Stamp
  chapY = Math.max(chapY + 15, pageHeight - 50);
  doc.setFillColor(254, 243, 199); // Light Amber
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, chapY, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9);
  doc.text('PDFSTORE PROTECTION & SUPPORT NOTICE', margin + 6, chapY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    'This document is legally protected under international copyright law. Thank you for supporting independent digital creators!',
    margin + 6,
    chapY + 14
  );

  drawFooter(3, 3);

  // Save the PDF
  const sanitizedTitle = product.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  doc.save(`${sanitizedTitle}_PDFStore.pdf`);
}
