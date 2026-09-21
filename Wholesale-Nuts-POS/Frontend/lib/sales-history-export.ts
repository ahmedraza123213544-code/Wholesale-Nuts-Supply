import { eachDayOfInterval, endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export type HistoryExportSale = {
  sale_number: string;
  sale_date: string;
  total_amount: string | number;
  payment_method: string;
  status: string;
  customer: { name?: string | null; email?: string | null } | null;
};

export type SalesSummary = {
  totalSales: number;
  cashCount: number;
  creditCount: number;
  cashTotal: number;
  creditTotal: number;
  grandTotal: number;
};

export type MonthlyDayRow = {
  date: string;
  label: string;
  salesCount: number;
  cashCount: number;
  creditCount: number;
  cashTotal: number;
  creditTotal: number;
  dayTotal: number;
};

const PDF_MINUS = "-";

export function getSaleCustomerName(sale: HistoryExportSale): string {
  const name = sale.customer?.name?.trim();
  if (name) return name;
  const email = sale.customer?.email?.trim();
  if (email) return email;
  return "Walk-in";
}

export function saleAmount(sale: HistoryExportSale): number {
  const value =
    typeof sale.total_amount === "string" ? parseFloat(sale.total_amount) : Number(sale.total_amount);
  return Number.isFinite(value) ? value : 0;
}

export function isCreditPayment(method?: string | null): boolean {
  return String(method || "").toUpperCase() === "CREDIT";
}

export function isIncludedInMonthly(sale: HistoryExportSale): boolean {
  const status = String(sale.status || "").toUpperCase();
  return status !== "CANCELLED" && status !== "PENDING";
}

export function money(value: number): string {
  const n = Number(value || 0);
  const formatted = Math.abs(n).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return n < 0 ? `${PDF_MINUS}${formatted}` : formatted;
}

export function summarizeSales(sales: HistoryExportSale[]): SalesSummary {
  return sales.reduce<SalesSummary>(
    (acc, sale) => {
      const amount = saleAmount(sale);
      acc.totalSales += 1;
      acc.grandTotal += amount;
      if (isCreditPayment(sale.payment_method)) {
        acc.creditCount += 1;
        acc.creditTotal += amount;
      } else {
        acc.cashCount += 1;
        acc.cashTotal += amount;
      }
      return acc;
    },
    {
      totalSales: 0,
      cashCount: 0,
      creditCount: 0,
      cashTotal: 0,
      creditTotal: 0,
      grandTotal: 0,
    }
  );
}

function saleTypeLabel(sale: HistoryExportSale): string {
  const status = String(sale.status || "").toUpperCase();
  if (status === "REFUNDED") return "RETURN";
  if (status === "EXCHANGED") return "EXCHANGE";
  if (saleAmount(sale) < 0) return "RETURN";
  return "SALE";
}

function loadLogoDataUrl(): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 200;
        canvas.height = img.naturalHeight || 200;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = "/logo.png";
  });
}

function writeWorkbook(sheets: Array<{ name: string; rows: (string | number)[][] }>, fileName: string) {
  const workbook = XLSX.utils.book_new();
  sheets.forEach((sheet) => {
    const worksheet = XLSX.utils.aoa_to_sheet(sheet.rows);
    worksheet["!cols"] = sheet.rows[0]?.map((_, index) => {
      const width = sheet.rows.reduce((max, row) => Math.max(max, String(row[index] ?? "").length), 10);
      return { wch: Math.min(Math.max(width + 2, 12), 36) };
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name.slice(0, 31));
  });
  XLSX.writeFile(workbook, fileName);
}

async function drawBrandedHeader(
  doc: jsPDF,
  opts: { title: string; subtitle: string; generatedAt: string }
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(27, 67, 50);
  doc.rect(0, 0, pageWidth, 28, "F");
  doc.setFillColor(196, 163, 90);
  doc.rect(0, 28, pageWidth, 2, "F");

  const logo = await loadLogoDataUrl();
  if (logo) {
    try {
      doc.addImage(logo, "JPEG", 12, 6, 16, 16);
    } catch {
      // ignore missing logo
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("WHOLESALE NUT SUPPLY", logo ? 32 : 12, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(232, 213, 163);
  doc.text(opts.title, logo ? 32 : 12, 19);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(opts.generatedAt, pageWidth - 12, 12, { align: "right" });
  doc.setTextColor(232, 213, 163);
  doc.text(opts.subtitle, pageWidth - 12, 19, { align: "right" });
}

function drawSummaryCards(
  doc: jsPDF,
  cards: Array<{ label: string; value: string }>,
  y: number
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 12;
  const gap = 4;
  const width = (pageWidth - margin * 2 - gap * (cards.length - 1)) / cards.length;
  cards.forEach((card, index) => {
    const x = margin + index * (width + gap);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, width, 16, 2, 2, "F");
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(card.label.toUpperCase(), x + 3, y + 6);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text(card.value, x + 3, y + 13);
  });
  return y + 20;
}

export function buildMonthlyDayRows(sales: HistoryExportSale[], monthDate: Date): MonthlyDayRow[] {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const days = eachDayOfInterval({ start, end });
  const byDay = new Map<string, HistoryExportSale[]>();

  sales.filter(isIncludedInMonthly).forEach((sale) => {
    const key = format(parseISO(sale.sale_date), "yyyy-MM-dd");
    const list = byDay.get(key) || [];
    list.push(sale);
    byDay.set(key, list);
  });

  return days.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const daySales = byDay.get(key) || [];
    const summary = summarizeSales(daySales);
    return {
      date: key,
      label: format(day, "EEE dd MMM"),
      salesCount: summary.totalSales,
      cashCount: summary.cashCount,
      creditCount: summary.creditCount,
      cashTotal: summary.cashTotal,
      creditTotal: summary.creditTotal,
      dayTotal: summary.grandTotal,
    };
  });
}

export function exportSalesHistoryExcel(
  sales: HistoryExportSale[],
  opts: { filterLabel?: string } = {}
) {
  const summary = summarizeSales(sales);
  const stamp = format(new Date(), "yyyy-MM-dd");
  const rows: (string | number)[][] = [
    ["WHOLESALE NUT SUPPLY"],
    ["Sales History"],
    [`Generated: ${format(new Date(), "dd MMM yyyy, hh:mm a")}`],
    [`Filters: ${opts.filterLabel || "All sales"}`],
    [],
    ["Total Sales", summary.totalSales],
    ["Cash Sales", summary.cashCount, summary.cashTotal],
    ["Credit Sales", summary.creditCount, summary.creditTotal],
    ["Grand Total", summary.grandTotal],
    [],
    ["Sale #", "Date", "Customer", "Payment", "Total", "Status", "Type"],
    ...sales.map((sale) => [
      sale.sale_number,
      format(parseISO(sale.sale_date), "yyyy-MM-dd"),
      getSaleCustomerName(sale),
      String(sale.payment_method || "").toUpperCase(),
      saleAmount(sale),
      sale.status,
      saleTypeLabel(sale),
    ]),
    [],
    ["", "", "GRAND TOTAL", "", summary.grandTotal, `${summary.totalSales} sales`, ""],
  ];
  writeWorkbook([{ name: "Sales History", rows }], `sales-history-${stamp}.xlsx`);
}

export async function exportSalesHistoryPdf(
  sales: HistoryExportSale[],
  opts: { filterLabel?: string } = {}
) {
  const summary = summarizeSales(sales);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  await drawBrandedHeader(doc, {
    title: "Sales History",
    subtitle: opts.filterLabel || "All sales",
    generatedAt: format(new Date(), "dd MMM yyyy, hh:mm a"),
  });

  let y = drawSummaryCards(doc, [
    { label: "Total Sales", value: String(summary.totalSales) },
    { label: "Cash Sales", value: `${summary.cashCount}  /  ${money(summary.cashTotal)}` },
    { label: "Credit Sales", value: `${summary.creditCount}  /  ${money(summary.creditTotal)}` },
    { label: "Grand Total", value: money(summary.grandTotal) },
  ], 34);

  autoTable(doc, {
    startY: y,
    head: [["Sale #", "Date", "Customer", "Payment", "Total", "Status", "Type"]],
    body: sales.map((sale) => [
      sale.sale_number,
      format(parseISO(sale.sale_date), "dd MMM yyyy"),
      getSaleCustomerName(sale),
      String(sale.payment_method || "").toUpperCase(),
      money(saleAmount(sale)),
      sale.status,
      saleTypeLabel(sale),
    ]),
    foot: [["", "", "GRAND TOTAL", "", money(summary.grandTotal), `${summary.totalSales} sales`, ""]],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2, textColor: [26, 26, 26] },
    headStyles: { fillColor: [27, 67, 50], textColor: [255, 255, 255], fontStyle: "bold" },
    footStyles: { fillColor: [27, 67, 50], textColor: [232, 213, 163], fontStyle: "bold" },
    columnStyles: {
      2: { cellWidth: 50 },
      4: { halign: "right" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 2 && String(data.cell.raw) === "Walk-in") {
        data.cell.styles.textColor = [100, 116, 139];
      }
    },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(27, 67, 50);
    doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
    doc.setTextColor(232, 213, 163);
    doc.setFontSize(8);
    doc.text("Wholesale Nut Supply  •  Sales history", 12, pageHeight - 4);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 12, pageHeight - 4, { align: "right" });
  }

  doc.save(`sales-history-${format(new Date(), "yyyy-MM-dd")}.pdf`);
}

export function exportMonthlySalesExcel(
  monthDate: Date,
  summary: SalesSummary,
  days: MonthlyDayRow[],
  monthlyRevenue = summary.grandTotal
) {
  const stamp = format(monthDate, "yyyy-MM");
  const rows: (string | number)[][] = [
    ["WHOLESALE NUT SUPPLY"],
    [`Monthly Sales — ${format(monthDate, "MMMM yyyy")}`],
    [`Generated: ${format(new Date(), "dd MMM yyyy, hh:mm a")}`],
    [],
    ["Monthly Revenue", monthlyRevenue],
    ["Grand Total", summary.grandTotal],
    ["Total Sales", summary.totalSales],
    ["Cash Sales", summary.cashCount, summary.cashTotal],
    ["Credit Sales", summary.creditCount, summary.creditTotal],
    [],
    ["Date", "Sales", "Cash Sales", "Credit Sales", "Cash Amount", "Credit Amount", "Day Total"],
    ...days.map((day) => [
      day.label,
      day.salesCount,
      day.cashCount,
      day.creditCount,
      day.cashTotal,
      day.creditTotal,
      day.dayTotal,
    ]),
    [],
    [
      "GRAND TOTAL",
      summary.totalSales,
      summary.cashCount,
      summary.creditCount,
      summary.cashTotal,
      summary.creditTotal,
      summary.grandTotal,
    ],
  ];
  writeWorkbook([{ name: format(monthDate, "MMM yyyy"), rows }], `monthly-sales-${stamp}.xlsx`);
}

export async function exportMonthlySalesPdf(
  monthDate: Date,
  summary: SalesSummary,
  days: MonthlyDayRow[],
  monthlyRevenue = summary.grandTotal
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  await drawBrandedHeader(doc, {
    title: `Monthly Sales — ${format(monthDate, "MMMM yyyy")}`,
    subtitle: `${summary.totalSales} sales`,
    generatedAt: format(new Date(), "dd MMM yyyy, hh:mm a"),
  });

  let y = drawSummaryCards(doc, [
    { label: "Monthly Revenue", value: money(monthlyRevenue) },
    { label: "Grand Total", value: money(summary.grandTotal) },
    { label: "Total Sales", value: String(summary.totalSales) },
    { label: "Cash Sales", value: `${summary.cashCount}  /  ${money(summary.cashTotal)}` },
    { label: "Credit Sales", value: `${summary.creditCount}  /  ${money(summary.creditTotal)}` },
  ], 34);

  autoTable(doc, {
    startY: y,
    head: [["Date", "Sales", "Cash", "Credit", "Cash Amount", "Credit Amount", "Day Total"]],
    body: days.map((day) => [
      day.label,
      String(day.salesCount),
      String(day.cashCount),
      String(day.creditCount),
      money(day.cashTotal),
      money(day.creditTotal),
      money(day.dayTotal),
    ]),
    foot: [[
      "GRAND TOTAL",
      String(summary.totalSales),
      String(summary.cashCount),
      String(summary.creditCount),
      money(summary.cashTotal),
      money(summary.creditTotal),
      money(summary.grandTotal),
    ]],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [27, 67, 50], textColor: [255, 255, 255], fontStyle: "bold" },
    footStyles: { fillColor: [27, 67, 50], textColor: [232, 213, 163], fontStyle: "bold" },
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
    },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(27, 67, 50);
    doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
    doc.setTextColor(232, 213, 163);
    doc.setFontSize(8);
    doc.text("Wholesale Nut Supply  •  Monthly sales", 12, pageHeight - 4);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 12, pageHeight - 4, { align: "right" });
  }

  doc.save(`monthly-sales-${format(monthDate, "yyyy-MM")}.pdf`);
}
