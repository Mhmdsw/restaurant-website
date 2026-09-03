'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';
import { useCart } from '@/components/cart/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderId = crypto.randomUUID();

      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim() || null,
          customer_email: customerEmail.trim() || null,
          total_amount: cartTotal,
          status: 'Pending',
        });

      if (orderError) {
        console.error('Order error:', orderError);
        toast.error('Could not create order');
        return;
      }

      const orderItems = cart.map((item) => ({
        order_id: orderId,
        menu_item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error(
          'Order items error:',
          itemsError
        );

        toast.error(
          'Order created, but items could not be saved'
        );

        return;
      }

      localStorage.setItem(
        'latest-order-id',
        orderId
      );

      clearCart();

      toast.success(
        'Order placed successfully'
      );

      router.push(
        `/order-success?order=${orderId}`
      );
    } catch (error) {
      console.error(
        'Checkout error:',
        error
      );

      toast.error(
        'Something went wrong'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">
          Checkout
        </h1>

        <p className="mt-2 text-muted-foreground">
          Enter your details to place your order.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name *
                </label>

                <Input
                  placeholder="Your full name"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone
                </label>

                <Input
                  placeholder="+961..."
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={customerEmail}
                  onChange={(e) =>
                    setCustomerEmail(
                      e.target.value
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      $
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="my-4 border-t" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>

                <span>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Placing Order...'
                  : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}