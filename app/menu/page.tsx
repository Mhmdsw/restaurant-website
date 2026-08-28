"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { supabase } from "@/lib/supabase";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Star,
  Search,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "All",
  "Pizza",
  "Burgers",
  "Pasta",
  "Seafood",
  "Desserts",
  "Drinks",
];

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

export default function MenuPage() {
  const [allDishes, setAllDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [showVegetarian, setShowVegetarian] =
    useState(false);

  const [showVegan, setShowVegan] =
    useState(false);

  const [showSpicy, setShowSpicy] =
    useState(false);

  const [priceRange, setPriceRange] =
    useState<[number, number]>([0, 50]);

  const [sortBy, setSortBy] =
    useState("rating");

  // ============================================
  // LOAD MENU FROM SUPABASE
  // ============================================

  useEffect(() => {
    async function loadMenu() {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("created_at", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Failed to load menu:",
          error
        );
      } else {
        setAllDishes(data || []);
      }

      setLoading(false);
    }

    loadMenu();
  }, []);

  // ============================================
  // FILTER AND SORT
  // ============================================

  const filteredDishes = useMemo(() => {
    let dishes = [...allDishes];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      dishes = dishes.filter(
        (dish) =>
          dish.name
            .toLowerCase()
            .includes(q) ||
          dish.description
            .toLowerCase()
            .includes(q)
      );
    }

    if (selectedCategory !== "All") {
      dishes = dishes.filter(
        (dish) =>
          dish.category === selectedCategory
      );
    }

    if (showVegetarian) {
      dishes = dishes.filter(
        (dish) => dish.is_vegetarian
      );
    }

    if (showVegan) {
      dishes = dishes.filter(
        (dish) => dish.is_vegan
      );
    }

    if (showSpicy) {
      dishes = dishes.filter(
        (dish) => dish.is_spicy
      );
    }

    dishes = dishes.filter(
      (dish) =>
        Number(dish.price) >= priceRange[0] &&
        Number(dish.price) <= priceRange[1]
    );

    switch (sortBy) {
      case "price_asc":
        dishes.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );
        break;

      case "price_desc":
        dishes.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );
        break;

      case "rating":
        dishes.sort(
          (a, b) =>
            (b.rating || 0) -
            (a.rating || 0)
        );
        break;

      case "name":
        dishes.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
    }

    return dishes;
  }, [
    allDishes,
    searchQuery,
    selectedCategory,
    showVegetarian,
    showVegan,
    showSpicy,
    priceRange,
    sortBy,
  ]);

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">
          Loading menu...
        </p>
      </div>
    );
  }

  // ============================================
  // PAGE
  // ============================================

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">

      <h1 className="mb-2 text-4xl font-bold">
        Our Menu
      </h1>

      <p className="mb-8 text-muted-foreground">
        Discover our carefully crafted dishes
      </p>

      {/* SEARCH + CATEGORIES */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={
                selectedCategory === category
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                setSelectedCategory(
                  category
                )
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* FILTERS */}

      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-lg bg-muted/30 p-4">

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showVegetarian}
            onChange={(e) =>
              setShowVegetarian(
                e.target.checked
              )
            }
          />
          Vegetarian
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showVegan}
            onChange={(e) =>
              setShowVegan(
                e.target.checked
              )
            }
          />
          Vegan
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showSpicy}
            onChange={(e) =>
              setShowSpicy(
                e.target.checked
              )
            }
          />
          Spicy
        </label>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Sort by:
          </span>

          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="rating">
                Rating
              </SelectItem>

              <SelectItem value="price_asc">
                Price: Low to High
              </SelectItem>

              <SelectItem value="price_desc">
                Price: High to Low
              </SelectItem>

              <SelectItem value="name">
                Name
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* COUNT */}

      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filteredDishes.length}{" "}
        {filteredDishes.length === 1
          ? "dish"
          : "dishes"}
      </p>

      {/* MENU */}

      {filteredDishes.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No dishes match your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDishes.map((dish) => (
            <Card
              key={dish.id}
              className="overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {dish.is_vegetarian && (
                  <Badge className="absolute left-2 top-2">
                    Vegetarian
                  </Badge>
                )}

                {dish.is_vegan && (
                  <Badge className="absolute left-2 top-2">
                    Vegan
                  </Badge>
                )}

                {dish.is_spicy && (
                  <Badge
                    variant="destructive"
                    className="absolute right-2 top-2"
                  >
                    Spicy
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {dish.name}
                    </h3>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {dish.description}
                    </p>
                  </div>

                  <span className="text-lg font-bold">
                    $
                    {Number(dish.price).toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                  <span className="text-sm">
                    {dish.rating || 0}
                  </span>

                  {dish.calories && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {dish.calories} cal
                    </span>
                  )}
                </div>

                {dish.allergens &&
                  dish.allergens.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {dish.allergens.map(
                        (allergen) => (
                          <Badge
                            key={allergen}
                            variant="outline"
                            className="text-xs"
                          >
                            {allergen}
                          </Badge>
                        )
                      )}
                    </div>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}