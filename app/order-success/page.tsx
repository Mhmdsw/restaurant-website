'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />

            <h1 className="mt-4 text-3xl font-bold">
              Order Placed Successfully
            </h1>

            <p className="mt-3 text-muted-foreground">
              Thank you for your order. We received it successfully.
            </p>

            {orderId && (
              <div className="mt-6 rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Order ID
                </p>

                <p className="mt-1 break-all font-mono text-sm font-semibold">
                  {orderId}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="/menu">
                  Order More Food
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
              >
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center">
          Loading order...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}