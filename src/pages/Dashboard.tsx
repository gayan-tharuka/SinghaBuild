import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, FileText, Calendar, Plus, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-equipment.jpg";

export default function Dashboard() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/equipment").then(res => res.json()).then(setEquipment);
    fetch("/api/customers").then(res => res.json()).then(setCustomers);
    fetch("/api/quotations").then(res => res.json()).then(setQuotations);
    fetch("/api/bookings").then(res => res.json()).then(setBookings);
  }, []);

  const stats = [
    {
      title: "Equipment Items",
      value: equipment.length,
      description: "Available for rent",
      icon: Package,
      color: "text-primary"
    },
    {
      title: "Active Customers",
      value: customers.length,
      description: "Total registered",
      icon: Users,
      color: "text-accent"
    },
    {
      title: "Pending Quotations",
      value: quotations.filter(q => q.status === 'Draft' || q.status === 'Sent').length,
      description: "Awaiting response",
      icon: FileText,
      color: "text-warning"
    },
    {
      title: "Current Bookings",
      value: bookings.filter(b => b.status === 'On Rent').length,
      description: "Equipment on rent",
      icon: Calendar,
      color: "text-equipment-rented"
    }
  ];

  const recentActivity = [
    ...quotations.slice(0, 2).map(q => ({
      id: q._id,
      type: 'quotation',
      title: `New quotation ${q.quotationId}`,
      customer: q.customerName,
      time: new Date(q.createdAt).toLocaleDateString(),
      status: q.status
    })),
    ...bookings.slice(0, 2).map(b => ({
      id: b._id,
      type: 'booking',
      title: `New booking ${b.bookingId}`,
      customer: b.customerName,
      time: new Date(b.createdAt).toLocaleDateString(),
      status: b.status
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              SinghaBuild Equipment Rentals
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Professional construction equipment rental management system for efficient business operations in Moratuwa, Sri Lanka.
            </p>
            <div className="flex gap-3">
              <Button size="lg" onClick={() => navigate('/quotations')}>
                <Plus className="w-5 h-5 mr-2" />
                Create Quotation
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/bookings')}>
                <Calendar className="w-5 h-5 mr-2" />
                New Booking
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src={heroImage} 
              alt="Construction equipment rental yard with excavators, concrete mixers, and generators"
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground">
                    {activity.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {activity.customer} • {activity.time}
                  </p>
                </div>
                <Badge 
                  variant={activity.status === 'warning' ? 'destructive' : 
                          activity.status === 'completed' ? 'default' : 'secondary'}
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/equipment')}>
              <Package className="w-4 h-4 mr-2" />
              Add New Equipment
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/customers')}>
              <Users className="w-4 h-4 mr-2" />
              Add New Customer
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/quotations')}>
              <FileText className="w-4 h-4 mr-2" />
              Create Quotation
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/equipment')}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Equipment Maintenance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}