import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Sale {
  _id: string;
  totalAmount: number;
  clientId: {
    name: string;
    email: string;
  };
}

export function RecentSales({ sales }: { sales: Sale[] }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No sales yet.</p>
          ) : (
            sales.map((sale) => (
              <div key={sale._id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {sale.clientId?.name?.slice(0, 2).toUpperCase() || "CL"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {sale.clientId?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {sale.clientId?.email}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  +৳{sale.totalAmount.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}