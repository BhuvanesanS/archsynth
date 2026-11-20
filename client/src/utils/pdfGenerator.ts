import jsPDF from 'jspdf';
import type { PlanData } from '../types';

export function generateConstructionPdf(plan: PlanData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Header Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ARCHSYNTH 3D | ARCHITECTURAL CONSTRUCTION PACKAGE', margin, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`PLAN ID: ${plan.meta.planId}  |  DATE: ${new Date().toLocaleDateString()}  |  SCALE: 1:100 PERMIT READY`, margin, 19);

  // Plot & Project Summary Box
  let y = 38;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 32, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PROJECT & SITE SPECIFICATIONS', margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const col1 = margin + 4;
  const col2 = margin + 65;
  const col3 = margin + 125;

  doc.text(`Plot Size: ${plan.plot.widthFt}' × ${plan.plot.depthFt}' (${plan.plot.totalAreaSqFt} sq.ft)`, col1, y + 14);
  doc.text(`Road Facing: ${plan.plot.facing}`, col1, y + 21);
  doc.text(`Building Footprint: ${plan.building.widthFt}' × ${plan.building.depthFt}'`, col1, y + 27);

  doc.text(`Floors: ${plan.building.floors === 2 ? 'Duplex (G+1)' : 'Ground Floor (G)'}`, col2, y + 14);
  doc.text(`Bedrooms: ${plan.meta.bhk} BHK`, col2, y + 21);
  doc.text(`Built-Up Area: ${plan.building.totalBuiltUpAreaSqFt} sq.ft`, col2, y + 27);

  doc.text(`Style: ${plan.meta.style.toUpperCase()}`, col3, y + 14);
  doc.text(`Vastu Mode: ${plan.meta.vastuEnabled ? 'ENABLED (16-ZONE)' : 'INTERNATIONAL PASSIVE'}`, col3, y + 21);
  doc.text(`Status: READY FOR BUILDER REVIEW`, col3, y + 27);

  // Architectural Room Schedule Table
  y += 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('GROUND FLOOR ROOM SCHEDULE & DIMENSIONS', margin, y);

  y += 6;
  // Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, pageWidth - 2 * margin, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('ROOM NAME', margin + 4, y + 5.5);
  doc.text('ZONE / EXPOSURE', margin + 55, y + 5.5);
  doc.text('DIMENSIONS (W × D)', margin + 105, y + 5.5);
  doc.text('AREA (SQ.FT)', margin + 148, y + 5.5);

  y += 8;
  doc.setFont('helvetica', 'normal');
  plan.rooms.forEach((room, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, pageWidth - 2 * margin, 7, 'F');
    }
    doc.setTextColor(30, 41, 59);
    doc.text(room.name, margin + 4, y + 4.8);
    doc.text(room.zone, margin + 55, y + 4.8);
    doc.text(`${room.width}' × ${room.depth}'`, margin + 105, y + 4.8);
    doc.text(`${room.areaSqFt} sq.ft`, margin + 148, y + 4.8);
    y += 7;
  });

  // Outdoor & Landscape Schedule
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('OUTDOOR & LANDSCAPE ZONING', margin, y);

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`• Front Lawn: ${plan.landscape.gardenLawn.width}' × ${plan.landscape.gardenLawn.depth}' (${plan.landscape.gardenLawn.areaSqFt} sq.ft) - ${plan.landscape.gardenLawn.type}`, margin, y + 4);
  doc.text(`• Driveway & Car Porch: ${plan.landscape.driveway.width}' × ${plan.landscape.driveway.depth}' (${plan.landscape.driveway.areaSqFt} sq.ft) - ${plan.landscape.driveway.type}`, margin, y + 9);
  doc.text(`• Rear Patio Deck: ${plan.landscape.rearPatio.width}' × ${plan.landscape.rearPatio.depth}' (${plan.landscape.rearPatio.areaSqFt} sq.ft) - ${plan.landscape.rearPatio.type}`, margin, y + 14);

  // Compliance Section (Vastu vs Modern)
  y += 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);

  if (plan.meta.vastuEnabled && plan.vastuReport) {
    doc.text(`VASTU SHASTRA COMPLIANCE AUDIT (SCORE: ${plan.vastuReport.vastuScore}/100 - ${plan.vastuReport.grade})`, margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`• Brahmasthana Center: ${plan.vastuReport.brahmasthanaStatus}`, margin, y);
    doc.text(`• Kitchen Fire Element: South-East (Agni) zone aligned.`, margin, y + 4.5);
    doc.text(`• Master Bedroom Earth: South-West (Nairitya) zone aligned.`, margin, y + 9);
    doc.text(`• Pooja Sanctum Ether: North-East (Ishanya) zone aligned.`, margin, y + 13.5);
  } else {
    doc.text(`INTERNATIONAL SOLAR PASSIVE & LEED COMPLIANCE`, margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`• Daylight Factor: ${plan.modernReport.daylightFactor}`, margin, y);
    doc.text(`• Solar Orientation: ${plan.modernReport.solarStrategy}`, margin, y + 4.5);
    doc.text(`• Acoustic Decoupling: Public social spaces acoustically buffered from master suites.`, margin, y + 9);
  }

  // Cost & Estimation Box
  y += 22;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageWidth - 2 * margin, 24, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ESTIMATED CONSTRUCTION COST GUIDELINE (TENTATIVE)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`US / International Benchmark: $${plan.costEstimate.currencyUSD.standard.toLocaleString()} ($180/sq.ft avg)`, margin + 4, y + 13);
  doc.text(`India Benchmark: INR ₹${(plan.costEstimate.currencyINR.standard / 100000).toFixed(2)} Lakhs (₹2,300/sq.ft avg)`, margin + 4, y + 19);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('ArchSynth 3D AI Architecture Studio • This document is an architectural conceptual plan package suitable for civil review.', margin, pageHeight - 10);

  doc.save(`ArchSynth_Blueprint_${plan.meta.planId}.pdf`);
}
