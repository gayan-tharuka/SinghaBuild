import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface EditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: any) => Promise<void>;
  equipment: any;
}

export function EditEquipmentModal({ isOpen, onClose, onSave, equipment }: EditEquipmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    description: "",
    status: "Available"
  });

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        category: equipment.category,
        dailyRate: equipment.dailyRate.toString(),
        weeklyRate: equipment.weeklyRate.toString(),
        monthlyRate: equipment.monthlyRate.toString(),
        description: equipment.description,
        status: equipment.status
      });
    }
  }, [equipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEquipment = {
      ...equipment,
      ...formData,
      dailyRate: parseFloat(formData.dailyRate),
      weeklyRate: parseFloat(formData.weeklyRate),
      monthlyRate: parseFloat(formData.monthlyRate),
    };
    await onSave(updatedEquipment);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>
            Update the details of your equipment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Equipment Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Concrete Mixer - 5/3.5 CFT"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Concrete">Concrete</SelectItem>
                <SelectItem value="Heavy Machinery">Heavy Machinery</SelectItem>
                <SelectItem value="Power Tools">Power Tools</SelectItem>
                <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyRate">Daily Rate (LKR)</Label>
              <Input
                id="dailyRate"
                type="number"
                value={formData.dailyRate}
                onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                placeholder="2500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weeklyRate">Weekly Rate (LKR)</Label>
              <Input
                id="weeklyRate"
                type="number"
                value={formData.weeklyRate}
                onChange={(e) => setFormData({ ...formData, weeklyRate: e.target.value })}
                placeholder="15000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyRate">Monthly Rate (LKR)</Label>
              <Input
                id="monthlyRate"
                type="number"
                value={formData.monthlyRate}
                onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value })}
                placeholder="50000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the equipment..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}