import Link from 'next/link';

export const metadata = {
  title: 'About Us | Jhumkas by Malti',
  description: 'Learn about the heritage, craftsmanship, and story behind Jhumkas by Malti - beautiful handcrafted traditional Indian earrings.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-[#992E3F]/5 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('/images/hero/Hero Section 01.jpg')" }} />
        <div className="container-custom mx-auto px-6 text-center relative z-10">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-jewelry-900 mb-6 tracking-wide">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-jewelry-700/80 max-w-2xl mx-auto font-display italic">
            Handcrafted with love and tradition, blending timeless elegance with contemporary design.
          </p>
        </div>
      </section>

      {/* Legacy and Heritage */}
      <section className="py-16 md:py-24 container-custom mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-jewelry-600">The Journey</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-jewelry-900 leading-tight">
              Honoring India's Rich Jewelry Heritage
            </h2>
            <div className="w-16 h-0.5 bg-jewelry-600"></div>
            <p className="text-gray-600 leading-relaxed">
              At <strong>Jhumkas by Malti</strong>, we believe that jewelry is more than just an accessory—it is a piece of art, a carrier of culture, and a celebration of legacy. Founded with a vision to make traditional Indian craftsmanship accessible to the modern woman, our brand honors centuries of metalwork, stone-setting, and design.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every single pair of jhumkas in our collections is designed with meticulous attention to detail, reflecting the unique regional styles of India, from royal Kundan work to classic gold-plated designs.
            </p>
          </div>
          <div className="md:col-span-6 relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <div 
              className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700" 
              style={{ backgroundImage: "url('/images/hero/Hero Section 02.jpg')" }}
            />
          </div>
        </div>
      </section>

      {/* Craftsmanship Focus */}
      <section className="py-16 md:py-24 bg-white border-y border-jewelry-100">
        <div className="container-custom mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-jewelry-600">Our Craft</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-jewelry-900">
              The Art of Handcrafting
            </h2>
            <div className="w-16 h-0.5 bg-jewelry-600 mx-auto"></div>
            <p className="text-gray-600">
              Behind every jhumka lies hours of dedication, skill, and creative precision by our master artisans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-[#FAF6F0] p-8 rounded-lg text-center space-y-4 shadow-sm border border-jewelry-100/50">
              <div className="w-12 h-12 bg-jewelry-900 text-white rounded-full flex items-center justify-center mx-auto text-xl">
                <i className="fas fa-hammer"></i>
              </div>
              <h3 className="font-display text-xl font-bold text-jewelry-900">Artisan Masterpieces</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We work directly with traditional jewelers who have inherited their crafts across generations, keeping heritage techniques alive.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-[#FAF6F0] p-8 rounded-lg text-center space-y-4 shadow-sm border border-jewelry-100/50">
              <div className="w-12 h-12 bg-jewelry-900 text-white rounded-full flex items-center justify-center mx-auto text-xl">
                <i className="fas fa-gem"></i>
              </div>
              <h3 className="font-display text-xl font-bold text-jewelry-900">Premium Materials</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Using only high-quality materials including fine brass alloys, 22k gold plating, genuine semi-precious stones, and lustrous pearls.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-[#FAF6F0] p-8 rounded-lg text-center space-y-4 shadow-sm border border-jewelry-100/50">
              <div className="w-12 h-12 bg-jewelry-900 text-white rounded-full flex items-center justify-center mx-auto text-xl">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="font-display text-xl font-bold text-jewelry-900">Commitment to Quality</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Each product goes through strict quality checks to ensure flawless settings, skin-friendly plating, and durable craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Detail */}
      <section className="py-16 md:py-24 container-custom mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 order-2 md:order-1 relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <div 
              className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700" 
              style={{ backgroundImage: "url('/images/hero/Hero Section 03.jpg')" }}
            />
          </div>
          <div className="md:col-span-6 order-1 md:order-2 space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-jewelry-600">Our Promise</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-jewelry-900 leading-tight">
              Elegance for Your Every Milestone
            </h2>
            <div className="w-16 h-0.5 bg-jewelry-600"></div>
            <p className="text-gray-600 leading-relaxed">
              Whether you are looking for light everyday wear, classic silver replicas, or statement pieces for weddings and festivals, Jhumkas by Malti has a curated range to complement your wardrobe. We capture the essence of celebrations, festivals, and normal days alike.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We hope that when you wear our jhumkas, you feel the warmth of the hands that created them, the lineage of the design, and the timeless elegance that they radiate.
            </p>
            <div className="pt-4">
              <Link 
                href="/products" 
                className="inline-block bg-[#E6455F] hover:bg-jewelry-950 text-white font-medium px-8 py-3 rounded-full transition-colors shadow-md"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
