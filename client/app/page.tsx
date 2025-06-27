"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Clock, Phone, Mail, Cake, Croissant, Coffee, Truck, HelpCircle } from "lucide-react";

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80",
    alt: "Fresh Bread Basket"
  },
  {
    url: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=1600&q=80",
    alt: "Pastries Selection"
  },
  {
    url: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=1600&q=80",
    alt: "Bakery Interior"
  },
  {
    url: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=1600&q=80",
    alt: "Cakes and Sweets"
  }
];

const services = [
  {
    icon: <Cake className="h-8 w-8 text-primary-600" />,
    title: "Custom Cakes",
    desc: "Order personalized cakes for birthdays, weddings, and special occasions."
  },
  {
    icon: <Croissant className="h-8 w-8 text-primary-600" />,
    title: "Fresh Pastries",
    desc: "Enjoy a daily selection of croissants, danishes, and muffins."
  },
  {
    icon: <Coffee className="h-8 w-8 text-primary-600" />,
    title: "Coffee & Tea",
    desc: "Pair your treat with our artisan coffee and specialty teas."
  },
  {
    icon: <Truck className="h-8 w-8 text-primary-600" />,
    title: "Delivery",
    desc: "Get your favorites delivered fresh to your door."
  }
];

const faqs = [
  {
    q: "Do you offer gluten-free options?",
    a: "Yes! We have a variety of gluten-free breads and pastries available daily."
  },
  {
    q: "Can I place a custom cake order online?",
    a: "Absolutely. Use our online order form or call us to discuss your custom cake needs."
  },
  {
    q: "Do you have vegan products?",
    a: "Yes, we offer vegan cakes, cookies, and breads. Ask our staff for today's selection."
  },
  {
    q: "Is there parking available?",
    a: "Yes, we have free parking for all our customers right next to the bakery."
  }
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide carousel
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearTimeout(timeoutRef.current!);
  }, [current]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center min-h-[70vh] md:min-h-[80vh] relative overflow-hidden p-0 m-0">
        {/* Full-width blurred carousel images */}
        <div className="absolute inset-0 w-full h-full z-0">
          {carouselImages.map((img, idx) => (
            <img
              key={img.url}
              src={img.url}
              alt={img.alt}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'} blur-sm brightness-75`}
              style={{ filter: idx === current ? 'blur(6px) brightness(0.7)' : 'blur(8px) brightness(0.5)' }}
            />
          ))}
          {/* Overlay for extra readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-100/80 to-primary-200/90 z-20" />
        </div>
        {/* Hero Content */}
        <div className="relative z-30 flex flex-col items-center justify-center w-full px-4 pt-24 pb-16">
          <span className="uppercase tracking-widest text-primary-700 font-semibold text-base md:text-lg mb-2 drop-shadow">Bakery & Cafe | Fresh Baked Goods</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary-800 mb-4 drop-shadow-lg">Sweet Delights Bakery</h1>
          <p className="text-xl md:text-2xl text-primary-900 mb-8 max-w-2xl mx-auto drop-shadow">Experience the magic of fresh, handcrafted baked goods every day. Taste happiness in every bite!</p>
          <a href="/login" className="btn-primary text-lg px-8 py-3 shadow-lg hover:scale-105 transition">Order Online</a>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full max-w-5xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {services.map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-8 flex flex-col items-center hover:scale-105 transition">
            {s.icon}
            <h3 className="mt-4 text-lg font-bold text-primary-700">{s.title}</h3>
            <p className="text-gray-600 mt-2">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-3xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-primary-700 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white rounded-lg shadow p-4 group">
              <summary className="flex items-center cursor-pointer text-lg font-medium text-primary-700 group-open:text-primary-900 transition">
                <HelpCircle className="h-5 w-5 mr-2 text-primary-600" />
                {faq.q}
              </summary>
              <div className="mt-2 text-gray-700 pl-7">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Business Details Section */}
      <section className="w-full max-w-4xl bg-white rounded-xl shadow-lg my-12 p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex-1 space-y-4 text-left">
          <h2 className="text-2xl font-bold text-primary-700 mb-2">About Us</h2>
          <p className="text-gray-700 mb-2">At Sweet Delights Bakery, we believe in the magic of fresh, handcrafted baked goods. From classic sourdough to decadent pastries, our menu is crafted daily with the finest ingredients. Visit us for a cozy atmosphere and a taste of home!</p>
          <div className="flex items-center gap-4 text-primary-700">
            <MapPin className="h-5 w-5" />
            <span>123 Main Street, Your City</span>
          </div>
          <div className="flex items-center gap-4 text-primary-700">
            <Clock className="h-5 w-5" />
            <span>Mon-Sat: 7am - 7pm, Sun: 8am - 3pm</span>
          </div>
          <div className="flex items-center gap-4 text-primary-700">
            <Phone className="h-5 w-5" />
            <span>(123) 456-7890</span>
          </div>
          <div className="flex items-center gap-4 text-primary-700">
            <Mail className="h-5 w-5" />
            <span>info@sweetdelights.com</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <form onSubmit={handleSearch} className="w-full flex items-center gap-2 mt-2">
            <input
              type="text"
              placeholder="Search the web..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary flex items-center gap-1 px-4 py-2">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 mb-4 text-gray-500 text-sm text-center">
        &copy; {new Date().getFullYear()} Sweet Delights Bakery. All rights reserved.
      </footer>
    </div>
  );
} 