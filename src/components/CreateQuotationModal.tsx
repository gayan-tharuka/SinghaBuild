import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quotation: any) => void;
  customers?: any[];
  equipment?: any[];
}

export function CreateQuotationModal({ isOpen, onClose, onSave, customers = [], equipment = [] }: CreateQuotationModalProps) {
  const [formData, setFormData] = useState({
    customerId: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    items: [] as any[]
  });

  const [newItem, setNewItem] = useState({
    equipmentId: "",
    quantity: 1
  });

  const addItem = () => {
    if (newItem.equipmentId) {
      const selectedEquipment = equipment.find(eq => eq.id === newItem.equipmentId);
      if (selectedEquipment) {
        const item = {
          id: Date.now().toString(),
          name: selectedEquipment.name,
          quantity: newItem.quantity,
          rate: selectedEquipment.dailyRate,
          subtotal: selectedEquipment.dailyRate * newItem.quantity
        };
        setFormData({
          ...formData,
          items: [...formData.items, item]
        });
        setNewItem({ equipmentId: "", quantity: 1 });
      }
    }
  };

  const removeItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== itemId)
    });
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert("Please add at least one equipment item");
      return;
    }
    
    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    const quotation = {
      id: `QT-2025-${String(Date.now()).slice(-3)}`,
      customerName: selectedCustomer?.name || "Unknown Customer",
      customerPhone: selectedCustomer?.phone || "",
      items: formData.items,
      startDate: formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : "",
      endDate: formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : "",
      totalAmount: calculateTotal(),
      status: "Draft",
      createdAt: format(new Date(), "yyyy-MM-dd")
    };
    
    onSave(quotation);
    setFormData({
      customerId: "",
      startDate: undefined,
      endDate: undefined,
      items: []
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quotation</DialogTitle>
          <DialogDescription>
            Create a new equipment rental quotation for a customer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Equipment Items</Label>
            <div className="flex gap-2">
              <Select value={newItem.equipmentId} onValueChange={(value) => setNewItem({ ...newItem, equipmentId: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map(eq => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.name} - LKR {eq.dailyRate}/day
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                className="w-20"
              />
              <Button type="button" onClick={addItem}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.items.length > 0 && (
              <div className="space-y-2">
                {formData.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{item.name} (Qty: {item.quantity})</span>
                    <div className="flex items-center gap-2">
                      <span>LKR {item.subtotal.toLocaleString()}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-right font-bold">
                  Total: LKR {calculateTotal().toLocaleString()}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Quotation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
