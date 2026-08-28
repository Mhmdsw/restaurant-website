"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react" // If you don't have lucide, run: npm install lucide-react
import { cn } from "@/lib/utils"

// Mock Data - Replace these with your actual blog posts later
const blogPosts = [
  {
    id: 1,
    title: "Meet Our Head Chef: A Journey from Paris to La Maison",
    excerpt: "Discover the story behind Chef Antoine, his culinary philosophy, and why he sources fresh ingredients from local farms every morning.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80",
    category: "Behind the Scenes",
    date: "June 10, 2026",
    slug: "meet-our-head-chef",
  },
  {
    id: 2,
    title: "5 Must-Try Dishes on Our Summer Menu",
    excerpt: "From the refreshing Heirloom Tomato Salad to our signature Lavender Crème Brûlée, here are the 5 dishes you absolutely cannot miss this season.",
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&q=80",
    category: "Food",
    date: "May 28, 2026",
    slug: "summer-menu-must-try",
  },
  {
    id: 3,
    title: "How to Pair Wine with Our Latest Menu",
    excerpt: "Our sommelier walks you through the perfect wine pairings for our new seasonal appetizers and mains.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
    category: "Drinks",
    date: "May 15, 2026",
    slug: "wine-pairing-guide",
  },
  {
    id: 4,
    title: "La Maison Turns 2: A Celebration Recap",
    excerpt: "We celebrated our 2nd anniversary with a spectacular evening filled with live music, special tastings, and our wonderful community.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    category: "Events",
    date: "April 22, 2026",
    slug: "2-year-anniversary",
  },
  {
    id: 5,
    title: "Farm to Table: Our Commitment to Local Sourcing",
    excerpt: "Take a look at the local farms and fisheries we partner with to ensure every ingredient on your plate is the freshest possible.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    category: "Behind the Scenes",
    date: "April 02, 2026",
    slug: "farm-to-table-sourcing",
  },
]

const categories = ["All", "Food", "Drinks", "Events", "Behind the Scenes"]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPosts = selectedCategory === "All"
    ? blogPosts
    : blogPosts.filter((post) => post.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            La Maison Journal
          </h1>
          <p className="text-lg text-muted-foreground">
            Stories from the kitchen, behind-the-scenes glimpses, and the latest news from our restaurant.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
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

        {/* Featured Article (Only show if "All" is selected) */}
        {selectedCategory === "All" && blogPosts.length > 0 && (
          <div className="max-w-4xl mx-auto mb-16 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-card border">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-3">{blogPosts[0].category}</Badge>
                <h2 className="text-2xl font-bold mb-2">{blogPosts[0].title}</h2>
                <p className="text-muted-foreground line-clamp-2 mb-4">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {blogPosts[0].date}
                  </div>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link href={`/blog/${blogPosts[0].slug}`}>Read More →</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(selectedCategory === "All" ? filteredPosts.slice(1) : filteredPosts).map((post) => (
            <article 
              key={post.id} 
              className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-48 w-full shrink-0">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <Badge variant="secondary" className="w-fit mb-3">{post.category}</Badge>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {post.date}
                  </div>
                  <Button asChild variant="link" className="p-0 h-auto text-primary">
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No blog posts found for this category yet.
          </div>
        )}
      </div>
    </div>
  )
}