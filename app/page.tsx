import Hero from '@/components/sections/Hero';
import FeaturedDishes from '@/components/sections/FeaturedDishes';
import TodaySpecial from '@/components/sections/TodaySpecial';
import ChefIntro from '@/components/sections/ChefIntro';
import Testimonials from '@/components/sections/Testimonials';
import Stats from '@/components/sections/Stats';
import InstagramGallery from '@/components/sections/InstagramGallery';
import Newsletter from '@/components/sections/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedDishes />
      <TodaySpecial />
      <ChefIntro />
      <Testimonials />
      <Stats />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}