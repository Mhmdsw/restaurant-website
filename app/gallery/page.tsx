"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Mock data - Replace these Unsplash URLs with your actual image paths later
const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    alt: "Elegant interior dining area with soft lighting",
    category: "Interior",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    alt: "Chef preparing a gourmet meal",
    category: "Food",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
    alt: "Cozy bar area with wine selection",
    category: "Interior",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    alt: "Beautifully plated steak dish",
    category: "Food",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?w=800&q=80",
    alt: "Celebratory group dining event",
    category: "Events",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    alt: "Craft cocktails in the evening",
    category: "Drinks",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    alt: "Gourmet appetizer platter",
    category: "Food",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    alt: "Beautiful outdoor patio seating",
    category: "Interior",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    alt: "Chef's table experience",
    category: "Events",
  },
]

const categories = ["All", "Interior", "Food", "Events", "Drinks"]

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredImages = selectedCategory === "All"
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 text-center">
        
        {/* Page Header */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            A Visual Journey
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore the ambiance, flavors, and moments that make La Maison unforgettable.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <Dialog key={image.id}>
              <DialogTrigger asChild>
                <div className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-muted/20 hover:shadow-lg transition-shadow duration-300">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium px-3 py-1 border border-white/50 rounded-full bg-black/40 backdrop-blur-sm">
                      View Full
                    </span>
                  </div>
                </div>
              </DialogTrigger>

              {/* Lightbox Modal */}
              <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none shadow-2xl">
                <div className="relative w-full h-[80vh] md:h-[70vh]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Empty State if no images match filter */}
        {filteredImages.length === 0 && (
          <div className="py-20 text-muted-foreground">
            No images found for this category.
          </div>
        )}
      </div>
    </div>
  )
}