import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      
      {/* 1. Hero Section */}
      <section className="relative py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Left: Text Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                The Story Behind <span className="text-primary">La Maison</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 2024, La Maison was born from a simple passion: bringing people together 
                over exceptional food. We believe dining is more than just eating—it's an experience. 
                From our open-kitchen concept to our carefully curated wine list, every detail is 
                designed to make you feel at home.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our chefs source the freshest local ingredients daily, crafting traditional recipes 
                with a modern, creative twist. Whether you&apos;re celebrating a special occasion or 
                enjoying a quiet evening out, La Maison promises an unforgettable culinary journey.
              </p>
              <div className="flex gap-4 pt-4">
                <Button asChild>
                  <Link href="/reservations">Reserve a Table</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/menu">View Our Menu</Link>
                </Button>
              </div>
            </div>

            {/* Right: Placeholder Image / Visual */}
            <div className="relative h-80 md:h-[500px] rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-orange-200 to-amber-600 flex items-center justify-center">
              {/* If you have an actual image, replace the inner div with <Image src="..." fill className="object-cover" /> */}
              <div className="text-center p-6">
                <p className="text-white text-2xl font-serif italic">"Good food,</p>
                <p className="text-white text-2xl font-serif italic">good company."</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Our Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Dine With Us</h2>
            <p className="text-muted-foreground">
              We are committed to providing an experience that delights all the senses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="text-center space-y-3 p-6 rounded-lg bg-card border">
              <div className="text-4xl mb-2">🥬</div>
              <h3 className="font-semibold text-xl">Fresh Ingredients</h3>
              <p className="text-sm text-muted-foreground">
                Sourced daily from local farms and markets to ensure peak flavor in every dish.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-lg bg-card border">
              <div className="text-4xl mb-2">👨‍🍳</div>
              <h3 className="font-semibold text-xl">Expert Chefs</h3>
              <p className="text-sm text-muted-foreground">
                Our team brings decades of culinary experience from Michelin-starred kitchens.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-lg bg-card border">
              <div className="text-4xl mb-2">🍷</div>
              <h3 className="font-semibold text-xl">Warm Ambiance</h3>
              <p className="text-sm text-muted-foreground">
                A cozy, elegant setting with soft lighting and an open fireplace for chilly nights.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}