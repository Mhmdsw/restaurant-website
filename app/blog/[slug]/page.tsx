import Link from "next/link"
import { Button } from "@/components/ui/button"

const blogPosts = [
  {
    slug: "meet-our-head-chef",
    title: "Meet Our Head Chef: A Journey from Paris to La Maison",
    category: "Behind the Scenes",
    date: "June 10, 2026",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80",
    content: `
      Chef Antoine's journey began in the heart of Paris, where he discovered his passion
      for creating unforgettable dining experiences.

      After years of training in world-class kitchens, he brought his knowledge,
      creativity, and love for fresh ingredients to La Maison.

      His philosophy is simple: respect the ingredients, support local farmers,
      and create dishes that tell a story.

      Every morning, Chef Antoine personally selects the freshest seasonal products
      to ensure every plate represents quality and passion.
    `,
  },

  {
    slug: "summer-menu-must-try",
    title: "5 Must-Try Dishes on Our Summer Menu",
    category: "Food",
    date: "May 28, 2026",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&q=80",
    content: `
      Summer at La Maison is all about fresh flavors, colorful ingredients,
      and unforgettable dining moments.

      Our chefs created a special seasonal menu inspired by local produce
      and Mediterranean flavors.

      Here are five dishes you absolutely must try:

      1. Heirloom Tomato Salad
      Fresh tomatoes, herbs, and a delicate dressing create a refreshing starter
      perfect for warm summer evenings.

      2. Grilled Seafood Platter
      A selection of fresh seafood grilled to perfection and served with
      homemade sauces.

      3. Herb-Crusted Lamb Chops
      Tender lamb prepared with aromatic herbs and paired with seasonal vegetables.

      4. Summer Truffle Pasta
      Handmade pasta combined with rich flavors and premium ingredients.

      5. Lavender Crème Brûlée
      Our signature dessert featuring a smooth creamy texture with a delicate
      lavender aroma.

      Each dish represents our commitment to quality, creativity, and memorable
      dining experiences.
    `,
  },


  {
    slug: "wine-pairing-guide",
    title: "How to Pair Wine with Our Latest Menu",
    category: "Drinks",
    date: "May 15, 2026",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
    content: `
      Choosing the perfect wine can transform a good meal into an exceptional
      experience.

      Our sommelier carefully selects wines that complement the flavors of
      every dish on our menu.

      From light white wines with seafood to rich reds with grilled meats,
      every pairing is designed to enhance your dining experience.
    `,
  },


  {
    slug: "2-year-anniversary",
    title: "La Maison Turns 2: A Celebration Recap",
    category: "Events",
    date: "April 22, 2026",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    content: `
      We celebrated two incredible years of La Maison with our amazing guests.

      The evening included live music, exclusive tastings, and unforgettable
      moments shared with our community.

      We are grateful to everyone who has supported our journey.
    `,
  },


  {
    slug: "farm-to-table-sourcing",
    title: "Farm to Table: Our Commitment to Local Sourcing",
    category: "Behind the Scenes",
    date: "April 02, 2026",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    content: `
      At La Maison, we believe the best meals start with the best ingredients.

      We work closely with local farmers and suppliers to bring fresh,
      seasonal products directly to your table.

      Supporting local producers allows us to maintain quality while
      respecting our environment.
    `,
  },
]


export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params


  const post = blogPosts.find(
    (post) => post.slug === slug
  )


  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">

        <h1 className="text-4xl font-bold">
          Article Not Found
        </h1>

        <Button asChild className="mt-6">
          <Link href="/blog">
            Back To Blog
          </Link>
        </Button>

      </div>
    )
  }


  return (

    <article className="max-w-4xl mx-auto py-16 px-4">

      <img
        src={post.image}
        alt={post.title}
        className="w-full h-[450px] object-cover rounded-2xl mb-10"
      />


      <div className="mb-6">

        <p className="text-sm text-muted-foreground">
          {post.category} • {post.date}
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mt-3">
          {post.title}
        </h1>

      </div>


      <div className="text-lg leading-9 whitespace-pre-line text-muted-foreground">

        {post.content}

      </div>


      <Button asChild className="mt-10">

        <Link href="/blog">
          ← Back To Blog
        </Link>

      </Button>


    </article>

  )
}