import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RentalAgreementPDF from "./RentalAgreementPDF";

// Helper function to transform booking data to the format expected by the PDF component
const transformBookingToAgreementData = (booking: any) => {
  if (!booking) return {}; // Return empty object or default structure

  return {
    agreementNo: booking.bookingId,
    hirer: {
      fullName: booking.customerName,
      nic: booking.customerNic || '__________________', // Add fallback
      address: booking.customerAddress || '__________________', // Add fallback
      contact: booking.customerContact || '__________________', // Add fallback
    },
    equipment: booking.items.map((item: any) => ({
      description: item.name,
      serial: item.serial || 'N/A', // Add fallback
      quantity: item.quantity,
    })),
    rentalPeriod: {
      start: booking.startDate,
      end: booking.endDate,
    },
    financials: {
      rentalFee: booking.totalAmount - booking.securityDeposit, // Assuming totalAmount includes deposit
      deliveryFee: 0, // Assuming no delivery fee is tracked in booking object
      deposit: booking.securityDeposit,
    },
  };
};


export function ViewBookingModal({ isOpen, onClose, booking }: { isOpen: boolean, onClose: () => void, booking: any }) {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>{booking.bookingId}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">{booking.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dates</p>
              <p className="font-medium">{booking.startDate} to {booking.endDate}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Items</p>
            <div className="border rounded-md p-2 mt-1">
              {booking.items && booking.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span>{item.name} (Qty: {item.quantity})</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-bold text-lg">LKR {booking.totalAmount.toLocaleString()}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Security Deposit</p>
                <p className="font-bold text-lg">LKR {booking.securityDeposit.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <PDFDownloadLink
            document={<RentalAgreementPDF data={transformBookingToAgreementData(booking)} />}
            fileName={`Rental-Agreement-${booking.bookingId}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <Button disabled>Generating PDF...</Button>
              ) : (
                <Button>Download Agreement</Button>
              )
            }
          </PDFDownloadLink>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
