import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ViewQuotationModal({ isOpen, onClose, quotation }: { isOpen: boolean, onClose: () => void, quotation: any }) {
  if (!quotation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Quotation Details</DialogTitle>
          <DialogDescription>{quotation.quotationId}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">{quotation.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dates</p>
              <p className="font-medium">{quotation.startDate} to {quotation.endDate}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Items</p>
            <div className="border rounded-md p-2 mt-1">
              {quotation.items && quotation.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span>{item.name} (Qty: {item.quantity})</span>
                  <span>LKR {item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end items-center">
            <p className="text-sm text-muted-foreground mr-2">Total Amount:</p>
            <p className="font-bold text-lg">LKR {quotation.totalAmount.toLocaleString()}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
