"use client";

import { useEffect, useMemo, useState } from "react";
import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/page-loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  buildMonthlyDayRows,
  exportMonthlySalesExcel,
  exportMonthlySalesPdf,
  isIncludedInMonthly,
  money,
  summarizeSales,
  type HistoryExportSale,
} from "@/lib/sales-history-export";

function branchQueryParam(): Record<string, string> {
  const branchId = localStorage.getItem("branch");
  if (branchId && branchId !== "Not Found" && branchId.trim()) {
    return { branchId: branchId.trim() };
  }
  return {};
}

export function SalesMonthlySummary() {
  const { toast } = useToast();
  const [monthDate, setMonthDate] = useState(() => startOfMonth(new Date()));
  const [sales, setSales] = useState<HistoryExportSale[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportingKind, setExportingKind] = useState<"excel" | "pdf" | null>(null);

  const fetchMonthSales = async () => {
    setLoading(true);
    try {
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      end.setHours(23, 59, 59, 999);
      const res = await apiClient.get<{ data: HistoryExportSale[] }>("/sale", {
        params: {
          ...branchQueryParam(),
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        },
      });
      const rows = Array.isArray(res.data.data) ? res.data.data : [];
      setSales(rows.filter(isIncludedInMonthly));
    } catch {
      toast({
        title: "Failed to load monthly sales",
        variant: "destructive",
      });
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMonthSales();
  }, [monthDate]);

  const summary = useMemo(() => summarizeSales(sales), [sales]);
  const monthlyRevenue = useMemo(
    () =>
      summarizeSales(
        sales.filter((sale) => String(sale.status || "").toUpperCase() === "COMPLETED")
      ).grandTotal,
    [sales]
  );
  const days = useMemo(() => buildMonthlyDayRows(sales, monthDate), [sales, monthDate]);
  const activeDays = days.filter((day) => day.salesCount > 0);

  const handleExport = async (kind: "excel" | "pdf") => {
    setExportingKind(kind);
    try {
      if (kind === "excel") {
        exportMonthlySalesExcel(monthDate, summary, days, monthlyRevenue);
      } else {
        await exportMonthlySalesPdf(monthDate, summary, days, monthlyRevenue);
      }
      toast({
        title: kind === "pdf" ? "PDF downloaded" : "Excel downloaded",
        description: `Monthly sales for ${format(monthDate, "MMMM yyyy")}.`,
      });
    } catch {
      toast({
        title: "Export failed",
        description: "Could not export monthly sales right now.",
        variant: "destructive",
      });
    } finally {
      setExportingKind(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMonthDate((prev) => addMonths(prev, -1))}
            disabled={loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[180px] text-center">
            <p className="text-lg font-semibold">{format(monthDate, "MMMM yyyy")}</p>
            <p className="text-xs text-gray-500">Monthly sales overview</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMonthDate((prev) => addMonths(prev, 1))}
            disabled={loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setMonthDate(startOfMonth(new Date()))} disabled={loading}>
            This Month
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void fetchMonthSales()} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button onClick={() => void handleExport("excel")} disabled={loading || exportingKind !== null}>
            {exportingKind === "excel" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            )}
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => void handleExport("pdf")} disabled={loading || exportingKind !== null}>
            {exportingKind === "pdf" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{money(monthlyRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">Completed sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Grand Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{money(summary.grandTotal)}</p>
            <p className="text-xs text-gray-500 mt-1">Cash {money(summary.cashTotal)} + Credit {money(summary.creditTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.totalSales}</p>
            <p className="text-xs text-gray-500 mt-1">{activeDays.length} days with sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Cash Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.cashCount}</p>
            <p className="text-xs text-gray-500 mt-1">{money(summary.cashTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Credit Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.creditCount}</p>
            <p className="text-xs text-gray-500 mt-1">{money(summary.creditTotal)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Day-by-day details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader message="Loading monthly sales..." />
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Cash</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Cash Amount</TableHead>
                    <TableHead className="text-right">Credit Amount</TableHead>
                    <TableHead className="text-right">Day Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {days.map((day) => (
                    <TableRow key={day.date} className={day.salesCount === 0 ? "text-gray-400" : ""}>
                      <TableCell className="font-medium">{day.label}</TableCell>
                      <TableCell className="text-right">{day.salesCount}</TableCell>
                      <TableCell className="text-right">{day.cashCount}</TableCell>
                      <TableCell className="text-right">{day.creditCount}</TableCell>
                      <TableCell className="text-right">{money(day.cashTotal)}</TableCell>
                      <TableCell className="text-right">{money(day.creditTotal)}</TableCell>
                      <TableCell className="text-right font-medium">{money(day.dayTotal)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-900 text-white font-semibold">
                    <TableCell>Grand Total</TableCell>
                    <TableCell className="text-right">{summary.totalSales}</TableCell>
                    <TableCell className="text-right">{summary.cashCount}</TableCell>
                    <TableCell className="text-right">{summary.creditCount}</TableCell>
                    <TableCell className="text-right">{money(summary.cashTotal)}</TableCell>
                    <TableCell className="text-right">{money(summary.creditTotal)}</TableCell>
                    <TableCell className="text-right">{money(summary.grandTotal)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
