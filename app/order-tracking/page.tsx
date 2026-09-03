"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import {
  Search,
  Clock,
  ChefHat,
  CheckCircle,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";

type OrderTracking = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
};

function OrderTrackingContent() {
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(false);

  async function trackOrder(id?: string) {
    const idToTrack = id || orderId.trim();

    if (!idToTrack) {
      toast.error("Please enter your order ID");
      return;
    }

    setLoading(true);
    setOrder(null);

    const { data, error } = await supabase.rpc(
      "get_order_tracking",
      {
        order_uuid: idToTrack,
      }
    );

    setLoading(false);

    if (error) {
      console.error("Tracking error:", error);
      toast.error("Could not track this order");
      return;
    }

    if (!data || data.length === 0) {
      toast.error("Order not found");
      return;
    }

    setOrder(data[0]);

    localStorage.setItem(
      "latest-order-id",
      idToTrack
    );
  }

  useEffect(() => {
    const orderFromUrl = searchParams.get("order");

    if (orderFromUrl) {
      setOrderId(orderFromUrl);

      localStorage.setItem(
        "latest-order-id",
        orderFromUrl
      );

      trackOrder(orderFromUrl);

      return;
    }

    const savedOrderId =
      localStorage.getItem("latest-order-id");

    if (savedOrderId) {
      setOrderId(savedOrderId);
      trackOrder(savedOrderId);
    }
  }, [searchParams]);

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

  const statuses = [
    "Pending",
    "Preparing",
    "Ready",
    "Completed",
  ];

  const currentStatusIndex = order
    ? statuses.indexOf(order.status)
    : -1;

  return (
    <main className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">
            Track Your Order
          </h1>

          <p className="mt-2 text-muted-foreground">
            Check the current status of your order.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Order ID
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Enter your order ID"
                value={orderId}
                onChange={(e) =>
                  setOrderId(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    trackOrder();
                  }
                }}
              />

              <Button
                onClick={() => trackOrder()}
                disabled={loading}
              >
                <Search className="mr-2 h-4 w-4" />

                {loading
                  ? "Checking..."
                  : "Track Order"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <div className="mt-6 text-center text-muted-foreground">
            Checking your order...
          </div>
        )}

        {order && !loading && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>
                  Your Order
                </CardTitle>

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
                  <strong>
                    Order ID:
                  </strong>{" "}
                  <span className="break-all">
                    {order.id}
                  </span>
                </p>

                <p>
                  <strong>
                    Total:
                  </strong>{" "}
                  $
                  {Number(
                    order.total_amount
                  ).toFixed(2)}
                </p>

                <p>
                  <strong>
                    Order Date:
                  </strong>{" "}
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {statuses.map(
                  (status, index) => {
                    const completed =
                      index <= currentStatusIndex;

                    return (
                      <div
                        key={status}
                        className={`rounded-lg border p-3 text-center text-xs sm:text-sm ${
                          completed
                            ? "font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {status}
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center">
          Loading order tracking...
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}