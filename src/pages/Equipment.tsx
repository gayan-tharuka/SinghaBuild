import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  Filter,
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddEquipmentModal } from "@/components/AddEquipmentModal";
import { EditEquipmentModal } from "@/components/EditEquipmentModal";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Available":
      return <Badge className="bg-green-500 text-white">Available</Badge>;
    case "On Rent":
      return <Badge className="bg-yellow-500 text-white">On Rent</Badge>;
    case "Under Maintenance":
      return <Badge className="bg-red-500 text-white">Maintenance</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Equipment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<any>(null);

  useEffect(() => {
    fetch("/api/equipment")
      .then(res => res.json())
      .then(data => setEquipment(data.map((item: any) => ({...item, id: item._id}))));
  }, []);

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(equipment.map(item => item.category)))];

  const handleAddEquipment = async (newEquipment: any) => {
    const response = await fetch("/api/equipment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEquipment),
    });
    const result = await response.json();
    setEquipment([...equipment, {...newEquipment, id: result.insertedId}]);
  };

  const handleEditEquipment = async (updatedEquipment: any) => {
    const response = await fetch(`/api/equipment/${updatedEquipment.id}`,
     {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEquipment),
    });
    await response.json();
    setEquipment(equipment.map(item => item.id === updatedEquipment.id ? updatedEquipment : item));
  };

  const handleStatusChange = async (equipmentId: string, status: string) => {
    const equipmentToUpdate = equipment.find(item => item.id === equipmentId);
    if (!equipmentToUpdate) return;

    const updatedEquipment = { ...equipmentToUpdate, status };

    const response = await fetch(`/api/equipment/${equipmentId}`,
     {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEquipment),
    });
    await response.json();
    setEquipment(equipment.map(item => item.id === equipmentId ? updatedEquipment : item));
  };

  const handleDeleteEquipment = async (equipmentId: string) => {
    try {
      await fetch(`/api/equipment/${equipmentId}`, {
        method: "DELETE",
      });
      setEquipment(equipment.filter(item => item.id !== equipmentId));
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Equipment Management</h1>
          <p className="text-muted-foreground">Manage your rental equipment inventory</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
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
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Equipment Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.category}</CardDescription>
                  </div>
                </div>
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
                      setEditingEquipment(item);
                      setIsEditModalOpen(true);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Equipment
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Change Status
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onSelect={() => handleStatusChange(item.id, "Available")}>Available</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleStatusChange(item.id, "On Rent")}>On Rent</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleStatusChange(item.id, "Under Maintenance")}>Under Maintenance</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteEquipment(item.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Equipment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge(item.status)}
              </div>
              
              <p className="text-sm text-muted-foreground">{item.description}</p>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="font-semibold text-foreground">
                    LKR {item.dailyRate.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Daily</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="font-semibold text-foreground">
                    LKR {item.weeklyRate.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Weekly</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="font-semibold text-foreground">
                    LKR {item.monthlyRate.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Monthly</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No equipment found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first piece of equipment"
              }
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </CardContent>
        </Card>
      )}

      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddEquipment}
      />

      {editingEquipment && (
        <EditEquipmentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingEquipment(null);
          }}
          onSave={handleEditEquipment}
          equipment={editingEquipment}
        />
      )}
    </div>
  );
}