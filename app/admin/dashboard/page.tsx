"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { allDishes } from "@/data/menuData";

import {
  RefreshCw,
  LogOut,
  Trash2,
  Edit,
  Plus,
  X,
  Save,
  CalendarDays,
  Mail,
  Utensils,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  special_requests: string | null;
  created_at: string;
};

type Message = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  created_at: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  calories?: number | null;
  allergens?: string[];
  rating?: number;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_spicy?: boolean;
};

type OrderItem = {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "reservations" | "messages" | "menu" | "orders"
  >("overview");

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const [newItem, setNewItem] = useState<MenuItem>({
    id: "",
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "Pizza",
    calories: 0,
    allergens: [],
    rating: 5,
    is_vegetarian: false,
    is_vegan: false,
    is_spicy: false,
  });

  // ============================================
  // LOAD ALL DATA
  // ============================================

  async function loadData() {
    setLoading(true);

    try {
      const [
        reservationsResult,
        messagesResult,
        menuResult,
        ordersResult,
      ] = await Promise.all([
        supabase
          .from("reservations")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("menu_items")
          .select("*")
          .order("created_at", { ascending: true }),

        supabase
          .from("orders")
          .select(`
            *,
            order_items (
              id,
              item_name,
              quantity,
              unit_price
            )
          `)
          .order("created_at", { ascending: false }),
      ]);

      if (reservationsResult.error) {
        console.error(reservationsResult.error);
      }

      if (messagesResult.error) {
        console.error(messagesResult.error);
      }

      if (menuResult.error) {
        console.error(menuResult.error);
      }

      if (ordersResult.error) {
        console.error("Orders load error:", ordersResult.error);
      }

      setReservations(reservationsResult.data || []);
      setMessages(messagesResult.data || []);
      setOrders(ordersResult.data || []);

      let databaseMenu = menuResult.data || [];

      // ============================================
      // IMPORT LOCAL MENU IF DATABASE IS EMPTY
      // ============================================

      if (databaseMenu.length === 0) {
        const { error: seedError } = await supabase
          .from("menu_items")
          .insert(
            allDishes.map((dish) => ({
              id: dish.id,
              name: dish.name,
              description: dish.description,
              price: dish.price,
              image: dish.image,
              category: dish.category,
              calories: dish.calories ?? null,
              allergens: dish.allergens ?? [],
              rating: dish.rating ?? 0,
              is_vegetarian: dish.isVegetarian ?? false,
              is_vegan: dish.isVegan ?? false,
              is_spicy: dish.isSpicy ?? false,
            }))
          );

        if (!seedError) {
          const { data: seededData } = await supabase
            .from("menu_items")
            .select("*")
            .order("created_at", { ascending: true });

          databaseMenu = seededData || [];

          toast.success("Your existing menu was imported!");
        } else {
          console.error("Menu import error:", seedError);
        }
      }

      setMenuItems(databaseMenu);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ============================================
  // LOGOUT
  // ============================================

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logged out successfully");

    window.location.href = "/admin/login";
  }

  // ============================================
  // DELETE RESERVATION
  // ============================================

  async function deleteReservation(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reservation?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("reservations")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    setReservations((prev) =>
      prev.filter((reservation) => reservation.id !== id)
    );

    toast.success("Reservation deleted");
  }

  // ============================================
  // DELETE MESSAGE
  // ============================================

  async function deleteMessage(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    setMessages((prev) =>
      prev.filter((message) => message.id !== id)
    );

    toast.success("Message deleted");
  }


  // ============================================
  // REFRESH AI KNOWLEDGE
  // ============================================

  async function refreshAIKnowledge() {
    try {
      const response = await fetch("/api/refresh-ai", {
        method: "POST",
      });

      if (!response.ok) {
        console.error("AI refresh failed");
        toast.error("Menu updated, but AI refresh failed");
        return false;
      }

      return true;
    } catch (error) {
      console.error("AI refresh error:", error);
      toast.error("Menu updated, but AI refresh failed");
      return false;
    }
  }

  // ============================================
  // UPDATE ORDER STATUS
  // ============================================

  async function updateOrderStatus(orderId: string, status: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.error("Order status update error:", error);
      toast.error(error.message);
      return;
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    toast.success(`Order marked as ${status}`);
  }

  // ============================================
  // DELETE MENU ITEM
  // ============================================

  async function deleteMenuItem(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    setMenuItems((prev) =>
      prev.filter((item) => item.id !== id)
    );

    await refreshAIKnowledge();

    toast.success("Menu item deleted");
  }

  // ============================================
  // UPDATE MENU ITEM
  // ============================================

  async function updateMenuItem() {
    if (!editingItem) return;

    const { data, error } = await supabase
      .from("menu_items")
      .update({
        name: editingItem.name,
        description: editingItem.description,
        price: Number(editingItem.price),
        image: editingItem.image,
        category: editingItem.category,
        calories: editingItem.calories
          ? Number(editingItem.calories)
          : null,
        rating: editingItem.rating
          ? Number(editingItem.rating)
          : 0,
        is_vegetarian: editingItem.is_vegetarian ?? false,
        is_vegan: editingItem.is_vegan ?? false,
        is_spicy: editingItem.is_spicy ?? false,
      })
      .eq("id", editingItem.id)
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === editingItem.id ? data : item
      )
    );

    setEditingItem(null);

    await refreshAIKnowledge();

    toast.success("Menu item updated successfully!");
  }

  // ============================================
  // ADD MENU ITEM
  // ============================================

  async function addMenuItem() {
    if (!newItem.name || !newItem.description || !newItem.image) {
      toast.error("Please fill in the required fields");
      return;
    }

    const id =
      newItem.id.trim() ||
      newItem.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const itemToInsert = {
      id,
      name: newItem.name,
      description: newItem.description,
      price: Number(newItem.price),
      image: newItem.image,
      category: newItem.category,
      calories: newItem.calories
        ? Number(newItem.calories)
        : null,
      allergens: newItem.allergens || [],
      rating: Number(newItem.rating || 0),
      is_vegetarian: newItem.is_vegetarian ?? false,
      is_vegan: newItem.is_vegan ?? false,
      is_spicy: newItem.is_spicy ?? false,
    };

    const { data, error } = await supabase
      .from("menu_items")
      .insert(itemToInsert)
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    setMenuItems((prev) => [...prev, data]);

    setNewItem({
      id: "",
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "Pizza",
      calories: 0,
      allergens: [],
      rating: 5,
      is_vegetarian: false,
      is_vegan: false,
      is_spicy: false,
    });

    setShowAddMenu(false);

    await refreshAIKnowledge();

    toast.success("New menu item added!");
  }

  // ============================================
  // DASHBOARD
  // ============================================

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ========================================
          TOP HEADER
      ======================================== */}

      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              La Maison Admin
            </h1>

            <p className="text-sm text-muted-foreground">
              Restaurant Management Dashboard
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh Data
            </Button>

            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* ========================================
          NAVIGATION
      ======================================== */}

      <div className="border-b bg-background">
        <div className="container mx-auto flex flex-wrap gap-2 p-4">
          <Button
            variant={
              activeTab === "overview"
                ? "default"
                : "outline"
            }
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </Button>

          <Button
            variant={
              activeTab === "reservations"
                ? "default"
                : "outline"
            }
            onClick={() => setActiveTab("reservations")}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Reservations
            <Badge className="ml-2">
              {reservations.length}
            </Badge>
          </Button>

          <Button
            variant={
              activeTab === "messages"
                ? "default"
                : "outline"
            }
            onClick={() => setActiveTab("messages")}
          >
            <Mail className="mr-2 h-4 w-4" />
            Messages
            <Badge className="ml-2">
              {messages.length}
            </Badge>
          </Button>

          <Button
            variant={
              activeTab === "menu"
                ? "default"
                : "outline"
            }
            onClick={() => setActiveTab("menu")}
          >
            <Utensils className="mr-2 h-4 w-4" />
            Menu Items
            <Badge className="ml-2">
              {menuItems.length}
            </Badge>
          </Button>

          <Button
            variant={
              activeTab === "orders"
                ? "default"
                : "outline"
            }
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Orders
            <Badge className="ml-2">
              {orders.length}
            </Badge>
          </Button>
        </div>
      </div>

      {/* ========================================
          CONTENT
      ======================================== */}

      <main className="container mx-auto p-4 md:p-8">

        {/* ======================================
            OVERVIEW
        ====================================== */}

        {activeTab === "overview" && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold">
                Dashboard Overview
              </h2>

              <p className="text-muted-foreground">
                Manage your restaurant from one place.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Reservations
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-4xl font-bold">
                    {reservations.length}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Total reservations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Messages
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-4xl font-bold">
                    {messages.length}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Customer messages
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Utensils className="mr-2 h-5 w-5" />
                    Menu
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-4xl font-bold">
                    {menuItems.length}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Menu items
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Orders
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-4xl font-bold">
                    {orders.length}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Total orders
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* ======================================
            RESERVATIONS
        ====================================== */}

        {activeTab === "reservations" && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  Reservations
                </h2>

                <p className="text-muted-foreground">
                  Manage customer table reservations.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {reservations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No reservations yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                reservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h3 className="text-lg font-bold">
                            {reservation.name}
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            {reservation.email}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {reservation.phone}
                          </p>
                        </div>

                        <div>
                          <p>
                            <strong>Date:</strong>{" "}
                            {reservation.date}
                          </p>

                          <p>
                            <strong>Time:</strong>{" "}
                            {reservation.time}
                          </p>

                          <p>
                            <strong>Guests:</strong>{" "}
                            {reservation.guests}
                          </p>
                        </div>

                        {reservation.special_requests && (
                          <div className="max-w-md">
                            <p className="text-sm font-medium">
                              Special Requests
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {reservation.special_requests}
                            </p>
                          </div>
                        )}

                        <Button
                          variant="destructive"
                          onClick={() =>
                            deleteReservation(
                              reservation.id
                            )
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        )}

        {/* ======================================
            MESSAGES
        ====================================== */}

        {activeTab === "messages" && (
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold">
                Contact Messages
              </h2>

              <p className="text-muted-foreground">
                Read and manage customer messages.
              </p>
            </div>

            <div className="grid gap-4">
              {messages.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No messages yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                messages.map((message) => (
                  <Card key={message.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">
                            {message.name}
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            {message.email}
                          </p>

                          {message.phone && (
                            <p className="text-sm text-muted-foreground">
                              {message.phone}
                            </p>
                          )}

                          {message.subject && (
                            <p className="mt-3 font-semibold">
                              {message.subject}
                            </p>
                          )}

                          <p className="mt-2 whitespace-pre-wrap text-sm">
                            {message.message}
                          </p>
                        </div>

                        <Button
                          variant="destructive"
                          onClick={() =>
                            deleteMessage(message.id)
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        )}

        {/* ======================================
            ORDERS
        ====================================== */}

        {activeTab === "orders" && (
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold">Orders</h2>
              <p className="text-muted-foreground">
                View customer orders and update their preparation status.
              </p>
            </div>

            <div className="grid gap-5">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No orders yet.</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-bold">
                              {order.customer_name}
                            </h3>
                            <Badge variant="secondary">{order.status}</Badge>
                          </div>

                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {order.customer_phone && <p>{order.customer_phone}</p>}
                            {order.customer_email && <p>{order.customer_email}</p>}
                            <p>
                              Order ID: <span className="break-all">{order.id}</span>
                            </p>
                            <p>
                              {new Date(order.created_at).toLocaleString()}
                            </p>
                          </div>

                          <div className="mt-5 rounded-lg border p-4">
                            <h4 className="mb-3 font-semibold">Order Items</h4>

                            <div className="space-y-2">
                              {(order.order_items || []).map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between gap-4 text-sm"
                                >
                                  <span>
                                    {item.item_name} × {item.quantity}
                                  </span>
                                  <span className="font-medium">
                                    ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 border-t pt-4">
                              <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${Number(order.total_amount).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full xl:w-56">
                          <label className="mb-2 block text-sm font-medium">
                            Order Status
                          </label>

                          <select
                            className="w-full rounded-md border bg-background p-2"
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        )}

        {/* ======================================
            MENU
        ====================================== */}

        {activeTab === "menu" && (
          <section>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  Menu Items
                </h2>

                <p className="text-muted-foreground">
                  Add, edit, change prices, or delete dishes.
                </p>
              </div>

              <Button
                onClick={() => setShowAddMenu(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </div>

            {/* ADD ITEM */}

            {showAddMenu && (
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Add New Menu Item
                    </CardTitle>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setShowAddMenu(false)
                      }
                    >
                      <X />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">
                      Name
                    </label>

                    <Input
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          name: e.target.value,
                        })
                      }
                      placeholder="Pizza Margherita"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Price
                    </label>

                    <Input
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">
                      Description
                    </label>

                    <Textarea
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the dish..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Image URL
                    </label>

                    <Input
                      value={newItem.image}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          image: e.target.value,
                        })
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Category
                    </label>

                    <select
                      className="w-full rounded-md border bg-background p-2"
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          category: e.target.value,
                        })
                      }
                    >
                      <option>Pizza</option>
                      <option>Burgers</option>
                      <option>Pasta</option>
                      <option>Seafood</option>
                      <option>Desserts</option>
                      <option>Drinks</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Calories
                    </label>

                    <Input
                      type="number"
                      value={newItem.calories ?? ""}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          calories: Number(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Rating
                    </label>

                    <Input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={newItem.rating ?? ""}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          rating: Number(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          newItem.is_vegetarian
                        }
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            is_vegetarian:
                              e.target.checked,
                          })
                        }
                      />
                      Vegetarian
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newItem.is_vegan}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            is_vegan:
                              e.target.checked,
                          })
                        }
                      />
                      Vegan
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newItem.is_spicy}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            is_spicy:
                              e.target.checked,
                          })
                        }
                      />
                      Spicy
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <Button onClick={addMenuItem}>
                      <Save className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* EDIT ITEM */}

            {editingItem && (
              <Card className="mb-8 border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Edit: {editingItem.name}
                    </CardTitle>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setEditingItem(null)
                      }
                    >
                      <X />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">
                      Name
                    </label>

                    <Input
                      value={editingItem.name}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Price
                    </label>

                    <Input
                      type="number"
                      step="0.01"
                      value={editingItem.price}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          price: Number(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">
                      Description
                    </label>

                    <Textarea
                      value={editingItem.description}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          description:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Image URL
                    </label>

                    <Input
                      value={editingItem.image}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          image: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Category
                    </label>

                    <select
                      className="w-full rounded-md border bg-background p-2"
                      value={editingItem.category}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          category: e.target.value,
                        })
                      }
                    >
                      <option>Pizza</option>
                      <option>Burgers</option>
                      <option>Pasta</option>
                      <option>Seafood</option>
                      <option>Desserts</option>
                      <option>Drinks</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Calories
                    </label>

                    <Input
                      type="number"
                      value={
                        editingItem.calories ?? ""
                      }
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          calories: Number(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Rating
                    </label>

                    <Input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={
                        editingItem.rating ?? ""
                      }
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          rating: Number(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          editingItem.is_vegetarian ??
                          false
                        }
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            is_vegetarian:
                              e.target.checked,
                          })
                        }
                      />
                      Vegetarian
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          editingItem.is_vegan ??
                          false
                        }
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            is_vegan:
                              e.target.checked,
                          })
                        }
                      />
                      Vegan
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          editingItem.is_spicy ??
                          false
                        }
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            is_spicy:
                              e.target.checked,
                          })
                        }
                      />
                      Spicy
                    </label>
                  </div>

                  <div className="flex gap-2 md:col-span-2">
                    <Button onClick={updateMenuItem}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setEditingItem(null)
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* MENU LIST */}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <CardContent className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold">
                          {item.name}
                        </h3>

                        <Badge variant="secondary">
                          {item.category}
                        </Badge>
                      </div>

                      <span className="text-xl font-bold">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>

                    <p className="mb-4 text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-1">
                      {item.is_vegetarian && (
                        <Badge>
                          Vegetarian
                        </Badge>
                      )}

                      {item.is_vegan && (
                        <Badge>
                          Vegan
                        </Badge>
                      )}

                      {item.is_spicy && (
                        <Badge variant="destructive">
                          Spicy
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() =>
                          setEditingItem(item)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          deleteMenuItem(item.id)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}