import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Eye, 
  Download, 
  Send,
  FileText,
  Calendar,
  User,
  DollarSign,
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateQuotationModal } from "@/components/CreateQuotationModal";
import { ViewQuotationModal } from "@/components/ViewQuotationModal";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Draft":
      return <Badge variant="secondary">Draft</Badge>;
    case "Sent":
      return <Badge className="bg-accent text-accent-foreground">Sent</Badge>;
    case "Accepted":
      return <Badge className="bg-success text-success-foreground">Accepted</Badge>;
    case "Declined":
      return <Badge variant="destructive">Declined</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Quotations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [quotations, setQuotations] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);

  useEffect(() => {
    fetch("/api/quotations")
      .then(res => res.json())
      .then(data => setQuotations(data.map((item: any) => ({...item, id: item._id}))));

    fetch("/api/customers")
      .then(res => res.json())
      .then(data => setCustomers(data.map((item: any) => ({...item, id: item._id}))));

    fetch("/api/equipment")
      .then(res => res.json())
      .then(data => setEquipment(data.map((item: any) => ({...item, id: item._id}))));
  }, []);

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = (quotation.quotationId && quotation.quotationId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (quotation.customerName && quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["all", ...Array.from(new Set(quotations.map(q => q.status)))];

  const handleCreateQuotation = async (newQuotation: any) => {
    try {
      const response = await fetch("/api/quotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuotation),
      });
      const createdQuotation = await response.json();
      setQuotations([...quotations, {...createdQuotation, id: createdQuotation._id}]);
    } catch (error) {
      console.error("Error creating quotation:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quotation Management</h1>
          <p className="text-muted-foreground">Create and manage equipment rental quotations</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Quotation
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search quotations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Status" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quotations List */}
      <div className="grid gap-4">
        {filteredQuotations.map((quotation) => (
          <Card key={quotation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{quotation.quotationId}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {quotation.customerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {quotation.startDate} to {quotation.endDate}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(quotation.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        setSelectedQuotation(quotation);
                        setIsViewModalOpen(true);
                      }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`/api/quotations/${quotation._id}/pdf`, '_blank')}>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                      {quotation.status === "Draft" && (
                        <DropdownMenuItem onClick={() => console.log('Send to Customer clicked')}>
                          <Send className="w-4 h-4 mr-2" />
                          Send to Customer
                        </DropdownMenuItem>
                      )}
                      {quotation.status === "Accepted" && (
                        <DropdownMenuItem onClick={() => console.log('Convert to Booking clicked')}>
                          Convert to Booking
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Equipment Items</p>
                  <div className="space-y-1">
                    {quotation.items && quotation.items.map((item: any, index: number) => (
                      <div key={index} className="text-sm text-foreground">
                        {item.name} (Qty: {item.quantity})
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm text-foreground">{quotation.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                      <DollarSign className="w-4 h-4" />
                      LKR {quotation.totalAmount?.toLocaleString() || '0'}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuotations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No quotations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first quotation"
              }
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Quotation
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateQuotationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateQuotation}
        customers={customers}
        equipment={equipment}
      />

      <ViewQuotationModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        quotation={selectedQuotation}
      />
    </div>
  );
}