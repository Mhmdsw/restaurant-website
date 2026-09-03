import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      items,
    } = body;

    if (!customerName?.trim()) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const itemIds = items.map((item) => item.id);

    const { data: menuItems, error: menuError } =
      await supabaseAdmin
        .from("menu_items")
        .select("id, name, price")
        .in("id", itemIds);

    if (menuError) {
      console.error("Menu error:", menuError);

      return NextResponse.json(
        { error: "Could not load menu items" },
        { status: 500 }
      );
    }

    if (!menuItems || menuItems.length !== itemIds.length) {
      return NextResponse.json(
        { error: "One or more menu items are invalid" },
        { status: 400 }
      );
    }

    let totalAmount = 0;

    const orderItems = items.map((cartItem) => {
      const menuItem = menuItems.find(
        (item) => item.id === cartItem.id
      );

      if (!menuItem) {
        throw new Error("Menu item not found");
      }

      const quantity = Number(cartItem.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        throw new Error("Invalid quantity");
      }

      const unitPrice = Number(menuItem.price);

      totalAmount += unitPrice * quantity;

      return {
        menu_item_id: menuItem.id,
        item_name: menuItem.name,
        quantity,
        unit_price: unitPrice,
      };
    });

    const orderId = crypto.randomUUID();

    const { error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        id: orderId,
        customer_name: customerName.trim(),
        customer_phone:
          customerPhone?.trim() || null,
        customer_email:
          customerEmail?.trim() || null,
        total_amount: totalAmount,
        status: "Pending",
      });

    if (orderError) {
      console.error("Order error:", orderError);

      return NextResponse.json(
        { error: "Could not create order" },
        { status: 500 }
      );
    }

    const itemsToInsert = orderItems.map((item) => ({
      ...item,
      order_id: orderId,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Order items error:", itemsError);

      await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", orderId);

      return NextResponse.json(
        { error: "Could not save order items" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      totalAmount,
    });
  } catch (error) {
    console.error("Checkout API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}