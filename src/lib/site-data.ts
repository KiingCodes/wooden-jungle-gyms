import aboutChild from "@/assets/about-child.jpg";
import accessories from "@/assets/cat-accessories.jpg";
import adventureTowers from "@/assets/cat-adventure-towers.jpg";
import classicPlaysets from "@/assets/cat-classic-playsets.jpg";
import customBuilds from "@/assets/cat-custom-builds.jpg";
import heroJungleGym from "@/assets/hero-jungle-gym.jpg";

export { aboutChild, heroJungleGym };

export const CONTACT = {
  phoneDisplay: "+27 83 470 0443",
  phoneHref: "tel:+27834700443",
  email: "play@mzansijunglegyms.co.za",
  address: "435 Aureole Ave, North Riding AH, Roodepoort, 2169",
  whatsappUrl: "https://wa.me/27834700443",
};

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/jungle-gyms", label: "Our Jungle Gyms" },
  { to: "/specials", label: "Special Offers" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export interface Category {
  slug: string;
  name: string;
  image: string;
  tagline: string;
  description: string;
  features: string[];
}

export const CATEGORIES: Category[] = [
  {
    slug: "classic-playsets",
    name: "Classic Playsets",
    image: classicPlaysets,
    tagline: "The timeless backyard favourite",
    description:
      "Our classic playsets combine a playhouse tower, slide and swing beam in one sturdy, beautifully finished structure. Perfect for smaller gardens and growing families.",
    features: ["Playhouse tower with roof", "Wavy slide", "Swing beam", "Rock wall ladder"],
  },
  {
    slug: "adventure-towers",
    name: "Adventure Towers",
    image: adventureTowers,
    tagline: "For climbers and explorers",
    description:
      "Taller platforms, climbing walls and rope nets make our adventure towers the ultimate challenge for energetic kids who love to climb, scramble and conquer.",
    features: [
      "Multi-level platforms",
      "Rock climbing wall",
      "Rope climbing net",
      "Fast slide exit",
    ],
  },
  {
    slug: "custom-builds",
    name: "Custom Builds",
    image: customBuilds,
    tagline: "Designed around your space",
    description:
      "Have an unusual space or a big dream? We design and build custom jungle gym complexes with bridges, multiple towers and whatever your kids can imagine.",
    features: [
      "Free design consultation",
      "Multi-tower layouts",
      "Connecting bridges",
      "Tailored to your garden",
    ],
  },
  {
    slug: "accessories",
    name: "Accessories",
    image: accessories,
    tagline: "Add more ways to play",
    description:
      "Swings, tire swings, climbing ropes, slides and more — everything you need to extend an existing jungle gym or add fresh excitement to playtime.",
    features: [
      "Belt swings & tire swings",
      "Slides & ladders",
      "Climbing ropes",
      "Safety surfacing",
    ],
  },
];

export const GALLERY_ITEMS = [
  { src: heroJungleGym, title: "Family favourite playset", category: "Playsets" },
  { src: classicPlaysets, title: "Classic playset install", category: "Playsets" },
  { src: adventureTowers, title: "Adventure tower with climbing wall", category: "Towers" },
  { src: customBuilds, title: "Twin-tower custom build", category: "Custom" },
  { src: accessories, title: "Swing set with tire swing", category: "Swings" },
  { src: aboutChild, title: "Playtime smiles", category: "Playsets" },
  { src: heroJungleGym, title: "Backyard adventure zone", category: "Custom" },
] as const;

export const GALLERY_CATEGORIES = ["All", "Playsets", "Towers", "Custom", "Swings"] as const;
