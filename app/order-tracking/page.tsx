"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, ChefHat, CheckCircle, PackageCheck } from "lucide-react";
import { toast } from "sonner";

type OrderTracking = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(false);

  async function trackOrder() {
    if (!orderId.trim()) {
      toast.error("Please enter your order ID");
      return;
    }

    setLoading(true);
    setOrder(null);

    const { data, error } = await supabase.rpc("get_order_tracking", {
      order_uuid: orderId.trim(),
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast.error("Could not track this order");
      return;
    }

    if (!data || data.length === 0) {
      toast.error("Order not found");
      return;
    }

    setOrder(data[0]);
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "Pending":
        return <Clock className="h-6 w-6" />;

      case "Preparing":
        return <ChefHat className="h-6 w-6" />;

      case "Ready":
        return <PackageCheck className="h-6 w-6" />;

      case "Completed":
        return <CheckCircle className="h-6 w-6" />;

      default:
        return <Clock className="h-6 w-6" />;
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Track Your Order</h1>

          <p className="mt-2 text-muted-foreground">
            Enter your order ID to check your current order status.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order ID</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Enter your order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    trackOrder();
                  }
                }}
              />

              <Button onClick={trackOrder} disabled={loading}>
                <Search className="mr-2 h-4 w-4" />

                {loading ? "Checking..." : "Track Order"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {order && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Your Order</CardTitle>

                <Badge className="text-sm">
                  {order.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 rounded-lg border p-5">
                {getStatusIcon(order.status)}

                <div>
                  <p className="font-semibold">
                    Current Status
                  </p>

                  <p className="text-lg font-bold">
                    {order.status}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>Order ID:</strong>{" "}
                  <span className="break-all">
                    {order.id}
                  </span>
                </p>

                <p>
                  <strong>Total:</strong> $
                  {Number(order.total_amount).toFixed(2)}
                </p>

                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs sm:text-sm">
                {["Pending", "Preparing", "Ready", "Completed"].map(
                  (status) => (
                    <div
                      key={status}
                      className={`rounded-lg border p-3 ${
                        order.status === status
                          ? "font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {status}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}