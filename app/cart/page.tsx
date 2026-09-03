'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

import { useCart } from '@/components/cart/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
    clearCart,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />

        <h1 className="text-3xl font-bold">
          Your cart is empty
        </h1>

        <p className="mt-2 text-muted-foreground">
          Add some delicious dishes from our menu.
        </p>

        <Button asChild className="mt-6">
          <Link href="/menu">
            Browse Menu
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Your Cart
          </h1>

          <p className="mt-2 text-muted-foreground">
            Review your order before checkout.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                {item.image && (
                  <div className="relative h-28 w-full overflow-hidden rounded-md sm:w-32">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {item.name}
                  </h2>

                  <p className="text-muted-foreground">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="min-w-24 text-right font-bold">
                  $
                  {(
                    item.price *
                    item.quantity
                  ).toFixed(2)}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold">
                Order Summary
              </h2>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-muted-foreground">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="my-4 border-t" />

              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total</span>
                <span>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <Button
                className="mt-6 w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              <Button
                asChild
                variant="outline"
                className="mt-3 w-full"
              >
                <Link href="/menu">
                  Continue Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}