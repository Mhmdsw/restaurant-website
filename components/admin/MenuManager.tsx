"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

import {
  Pencil,
  Trash2,
  Plus,
  X,
  Save,
  Loader2,
} from "lucide-react"

import { toast } from "sonner"

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  calories: number | null
  allergens: string[]
  rating: number
  is_vegetarian: boolean
  is_vegan: boolean
  is_spicy: boolean
}

const emptyItem = {
  name: "",
  description: "",
  price: 0,
  image: "",
  category: "Pizza",
  calories: 0,
  allergens: "",
  rating: 5,
  is_vegetarian: false,
  is_vegan: false,
  is_spicy: false,
}

export default function MenuManager() {

  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState(emptyItem)

  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // ==============================
  // LOAD MENU
  // ==============================

  async function loadItems() {

    setLoading(true)

    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("created_at", {
        ascending: false,
      })

    if (error) {

      console.error(error)

      toast.error(
        "Failed to load menu items"
      )

      setLoading(false)
      return
    }

    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  // ==============================
  // START ADD
  // ==============================

  function startAdd() {

    setEditingId(null)

    setForm(emptyItem)

    setShowForm(true)
  }

  // ==============================
  // START EDIT
  // ==============================

  function startEdit(item: MenuItem) {

    setEditingId(item.id)

    setForm({
      name: item.name,
      description: item.description,
      price: Number(item.price),
      image: item.image,
      category: item.category,
      calories: item.calories || 0,
      allergens: item.allergens?.join(", ") || "",
      rating: Number(item.rating),
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      is_spicy: item.is_spicy,
    })

    setShowForm(true)
  }

  // ==============================
  // SAVE
  // ==============================

  async function saveItem(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setSaving(true)

    const itemData = {

      name: form.name,

      description: form.description,

      price: Number(form.price),

      image: form.image,

      category: form.category,

      calories: Number(form.calories) || null,

      allergens: form.allergens
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      rating: Number(form.rating),

      is_vegetarian:
        form.is_vegetarian,

      is_vegan:
        form.is_vegan,

      is_spicy:
        form.is_spicy,
    }

    try {

      // EDIT
      if (editingId) {

        const { error } = await supabase
          .from("menu_items")
          .update(itemData)
          .eq("id", editingId)

        if (error) {
          throw error
        }

        toast.success(
          "Menu item updated successfully!"
        )

      }

      // ADD
      else {

        const { error } = await supabase
          .from("menu_items")
          .insert(itemData)

        if (error) {
          throw error
        }

        toast.success(
          "Menu item added successfully!"
        )
      }

      setShowForm(false)

      setEditingId(null)

      setForm(emptyItem)

      await loadItems()

    } catch (error: any) {

      console.error(error)

      toast.error(
        error.message ||
        "Failed to save menu item"
      )

    } finally {

      setSaving(false)
    }
  }

  // ==============================
  // DELETE
  // ==============================

  async function deleteItem(
    id: string,
    name: string
  ) {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(id)

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id)

    if (error) {

      console.error(error)

      toast.error(
        "Failed to delete menu item"
      )

      setDeletingId(null)

      return
    }

    toast.success(
      `"${name}" deleted successfully`
    )

    await loadItems()

    setDeletingId(null)
  }

  // ==============================
  // LOADING
  // ==============================

  if (loading) {

    return (
      <div className="flex items-center justify-center py-20">

        <Loader2 className="h-6 w-6 animate-spin mr-2" />

        <span>
          Loading menu...
        </span>

      </div>
    )
  }

  // ==============================
  // UI
  // ==============================

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h2 className="text-2xl font-bold">
            Menu Items
          </h2>

          <p className="text-muted-foreground">
            Add, edit, change prices, or delete dishes.
          </p>

        </div>

        <Button
          onClick={startAdd}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>

      </div>

      {/* ADD / EDIT FORM */}

      {showForm && (

        <div className="border rounded-xl p-6 bg-card shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <h3 className="text-xl font-semibold">

              {editingId
                ? "Edit Menu Item"
                : "Add Menu Item"}

            </h3>

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setShowForm(false)
              }
            >
              <X className="h-5 w-5" />
            </Button>

          </div>

          <form
            onSubmit={saveItem}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* NAME */}

            <div>

              <label className="text-sm font-medium">
                Name
              </label>

              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Margherita"
                required
              />

            </div>

            {/* PRICE */}

            <div>

              <label className="text-sm font-medium">
                Price ($)
              </label>

              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: Number(e.target.value),
                  })
                }
                required
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label className="text-sm font-medium">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              >

                <option>Pizza</option>
                <option>Burgers</option>
                <option>Pasta</option>
                <option>Seafood</option>
                <option>Desserts</option>
                <option>Drinks</option>

              </select>

            </div>

            {/* RATING */}

            <div>

              <label className="text-sm font-medium">
                Rating
              </label>

              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rating: Number(e.target.value),
                  })
                }
              />

            </div>

            {/* IMAGE */}

            <div className="md:col-span-2">

              <label className="text-sm font-medium">
                Image URL
              </label>

              <Input
                value={form.image}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.value,
                  })
                }
                placeholder="https://images.unsplash.com/..."
                required
              />

            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className="text-sm font-medium">
                Description
              </label>

              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the dish..."
                required
              />

            </div>

            {/* CALORIES */}

            <div>

              <label className="text-sm font-medium">
                Calories
              </label>

              <Input
                type="number"
                value={form.calories}
                onChange={(e) =>
                  setForm({
                    ...form,
                    calories: Number(e.target.value),
                  })
                }
              />

            </div>

            {/* ALLERGENS */}

            <div>

              <label className="text-sm font-medium">
                Allergens
              </label>

              <Input
                value={form.allergens}
                onChange={(e) =>
                  setForm({
                    ...form,
                    allergens: e.target.value,
                  })
                }
                placeholder="Gluten, Dairy"
              />

              <p className="text-xs text-muted-foreground mt-1">
                Separate allergens with commas.
              </p>

            </div>

            {/* CHECKBOXES */}

            <div className="md:col-span-2 flex flex-wrap gap-6">

              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={form.is_vegetarian}
                  onChange={(e) =>
                    setForm({
                      ...form,
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
                  checked={form.is_vegan}
                  onChange={(e) =>
                    setForm({
                      ...form,
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
                  checked={form.is_spicy}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      is_spicy:
                        e.target.checked,
                    })
                  }
                />

                Spicy

              </label>

            </div>

            {/* BUTTONS */}

            <div className="md:col-span-2 flex gap-3 pt-4">

              <Button
                type="submit"
                disabled={saving}
              >

                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Item
                  </>
                )}

              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </Button>

            </div>

          </form>

        </div>
      )}

      {/* ITEMS */}

      {items.length === 0 ? (

        <div className="border rounded-xl p-12 text-center">

          <h3 className="font-semibold text-lg">
            No menu items yet
          </h3>

          <p className="text-muted-foreground mt-2">
            Add your first menu item.
          </p>

          <Button
            className="mt-4"
            onClick={startAdd}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {items.map((item) => (

            <div
              key={item.id}
              className="border rounded-xl overflow-hidden bg-card shadow-sm"
            >

              {/* IMAGE */}

              <div className="h-48 relative">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />

              </div>

              {/* CONTENT */}

              <div className="p-5">

                <div className="flex justify-between gap-3">

                  <div>

                    <h3 className="font-bold text-lg">
                      {item.name}
                    </h3>

                    <Badge
                      variant="secondary"
                      className="mt-1"
                    >
                      {item.category}
                    </Badge>

                  </div>

                  <span className="font-bold text-xl">
                    ${Number(item.price).toFixed(2)}
                  </span>

                </div>

                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-3">

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

                {/* ACTIONS */}

                <div className="flex gap-2 mt-5">

                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() =>
                      startEdit(item)
                    }
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={
                      deletingId === item.id
                    }
                    onClick={() =>
                      deleteItem(
                        item.id,
                        item.name
                      )
                    }
                  >

                    {deletingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}

                  </Button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}