"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/ui/page-loader";
import { API_BASE } from "@/config/constants";
import {
  Eye,
  Globe,
  Loader2,
  Mail,
  Phone,
  RefreshCcw,
  Search,
} from "lucide-react";

type Inquiry = {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  businessType: string;
  productInterest: string;
  orderQuantity: string;
  message: string;
  status: string;
  createdAt: string;
};

const STATUS_OPTIONS = ["ALL", "new", "contacted", "closed"] as const;

export default function WebsiteInquiries() {
  const { toast } = useToast();
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const websiteApiRoot = API_BASE.replace(/\/api\/v1\/?$/, "");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = statusFilter !== "ALL" ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const res = await fetch(`${websiteApiRoot}/api/inquiries${qs}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load inquiries");
      setItems(json.data || []);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Could not load website inquiries",
        description: err?.message || "Try again",
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, toast, websiteApiRoot]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((row) =>
      [
        row.fullName,
        row.companyName,
        row.email,
        row.phone,
        row.productInterest,
        row.message,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, search]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${websiteApiRoot}/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      setItems((prev) =>
        prev.map((row) => (row.id === id ? { ...row, status } : row))
      );
      if (selected?.id === id) setSelected({ ...selected, status });
      toast({ title: "Status updated", description: `Marked as ${status}` });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err?.message || "Try again",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const newCount = items.filter((i) => i.status === "new").length;

  if (loading && items.length === 0) {
    return <PageLoader label="Loading website inquiries..." />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Globe className="h-6 w-6 text-emerald-700" />
            Website Inquiries
          </h1>
          <p className="text-sm text-gray-500">
            Quote / contact form submissions from wholesalenutsupply.com
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{items.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">New</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-amber-600">{newCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Showing</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{filtered.length}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search name, company, email, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "ALL" ? "All statuses" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-gray-500">
                      No website inquiries yet. Submissions from the contact form will appear here.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {new Date(row.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{row.fullName}</div>
                        <div className="text-xs text-gray-500">{row.email}</div>
                        <div className="text-xs text-gray-500">{row.phone}</div>
                      </TableCell>
                      <TableCell>{row.companyName}</TableCell>
                      <TableCell className="max-w-[180px] truncate">{row.productInterest}</TableCell>
                      <TableCell>{row.orderQuantity}</TableCell>
                      <TableCell>
                        <Badge
                          variant={row.status === "new" ? "destructive" : "secondary"}
                          className="capitalize"
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => setSelected(row)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquiry details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{selected.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Company</p>
                  <p className="font-medium">{selected.companyName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Business type</p>
                  <p className="font-medium">{selected.businessType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Quantity</p>
                  <p className="font-medium">{selected.orderQuantity}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500">Product interest</p>
                <p className="font-medium">{selected.productInterest}</p>
              </div>
              <div>
                <p className="text-gray-500">Message</p>
                <p className="rounded-md bg-gray-50 p-3 whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={`mailto:${selected.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href={`tel:${selected.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-2 border-t pt-3">
                <span className="text-gray-500">Status</span>
                <Select
                  value={selected.status}
                  onValueChange={(v) => updateStatus(selected.id, v)}
                  disabled={updatingId === selected.id}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.filter((s) => s !== "ALL").map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
