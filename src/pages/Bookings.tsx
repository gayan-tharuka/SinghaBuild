import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Package, CheckCircle, AlertCircle, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewBookingModal } from "@/components/NewBookingModal";
import { ViewBookingModal } from "@/components/ViewBookingModal";



const getStatusBadge = (status: string) => {
  switch (status) {
    case "Confirmed":
      return <Badge className="bg-accent text-accent-foreground">Confirmed</Badge>;
    case "On Rent":
      return <Badge className="bg-equipment-rented text-white">On Rent</Badge>;
    case "Completed":
      return <Badge className="bg-success text-success-foreground">Completed</Badge>;
    case "Cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Confirmed":
      return <Clock className="w-4 h-4" />;
    case "On Rent":
      return <AlertCircle className="w-4 h-4" />;
    case "Completed":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => setBookings(data.map((item: any) => ({...item, id: item._id}))));

    fetch("/api/customers")
      .then(res => res.json())
      .then(data => setCustomers(data.map((item: any) => ({...item, id: item._id}))));

    fetch("/api/equipment")
      .then(res => res.json())
      .then(data => setEquipment(data.map((item: any) => ({...item, id: item._id}))));

    fetch("/api/quotations")
      .then(res => res.json())
      .then(data => setQuotations(data.map((item: any) => ({...item, id: item._id}))));
  }, []);

  const handleNewBooking = async (newBooking: any) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });
      const createdBooking = await response.json();
      setBookings([...bookings, {...createdBooking, id: createdBooking._id}]);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handleCompleteReturn = async (bookingId: string) => {
    try {
      await fetch(`/api/bookings/${bookingId}/complete`, {
        method: "PUT",
      });
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'Completed' } : b));
    } catch (error) {
      console.error("Error completing return:", error);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: status } : b));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const onRentCount = bookings.filter(b => b.status === 'On Rent').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const thisMonthRevenue = bookings
    .filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth() && new Date(b.createdAt).getFullYear() === new Date().getFullYear())
    .reduce((acc, b) => acc + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
          <p className="text-muted-foreground">Track and manage equipment bookings</p>
        </div>
        <Button onClick={() => setIsNewBookingModalOpen(true)}>
          <Calendar className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-accent">{confirmedCount}</p>
                <p className="text-xs text-muted-foreground">Confirmed</p>
              </div>
              <Clock className="w-5 h-5 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-equipment-rented">{onRentCount}</p>
                <p className="text-xs text-muted-foreground">On Rent</p>
              </div>
              <AlertCircle className="w-5 h-5 text-equipment-rented" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">LKR {Math.round(thisMonthRevenue / 1000)}K</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
              <Package className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {getStatusIcon(booking.status)}
                  </div>
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {booking.bookingId}
                      {getStatusBadge(booking.status)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {booking.customerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {booking.startDate} to {booking.endDate}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    LKR {booking.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Deposit: LKR {booking.securityDeposit.toLocaleString()}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}>Confirmed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'On Rent')}>On Rent</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'Completed')}>Completed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'Cancelled')}>Cancelled</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Equipment Items</p>
                  <div className="space-y-1">
                    {booking.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{item.name}</span>
                        <span className="text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm text-foreground">{booking.createdAt}</p>
                    {booking.quotationId && (
                      <>
                        <p className="text-sm text-muted-foreground mt-1">From Quotation</p>
                        <p className="text-sm text-accent">{booking.quotationId}</p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      const customer = customers.find(c => c.id === booking.customerId);
                      const bookingWithCustomerDetails = {
                        ...booking,
                        customerNic: customer?.nic,
                        customerAddress: customer?.address,
                        customerContact: customer?.phone,
                      };
                      setSelectedBooking(bookingWithCustomerDetails);
                      setIsViewModalOpen(true);
                    }}>
                      View Details
                    </Button>
                    {booking.status === "On Rent" && (
                      <Button size="sm" onClick={() => handleCompleteReturn(booking.id)}>
                        Complete Return
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        onSave={handleNewBooking}
        customers={customers}
        equipment={equipment}
        quotations={quotations}
      />

      <ViewBookingModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
}