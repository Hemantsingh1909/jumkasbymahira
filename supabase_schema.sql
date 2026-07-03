-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  images JSONB NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  stock_status TEXT NOT NULL,
  tags JSONB NOT NULL,
  material TEXT NOT NULL,
  occasion TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  invoice_no TEXT UNIQUE NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  items JSONB NOT NULL,
  customer JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create newsletter table
CREATE TABLE IF NOT EXISTS newsletter (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial products seed
INSERT INTO products (sku, name, price, images, category, description, stock_status, tags, material, occasion, color)
VALUES
('JM-GD-001', 'Gold Jhumka', 12999.99, '["/images/products/one.jpeg"]', 'jhumkas', 'Exquisite traditional gold-plated jhumkas featuring intricate filigree work and delicate pearl hangings. Handmade by skilled artisans.', 'In Stock', '["traditional", "bridal", "festive"]', 'Gold Plated', 'Bridal', 'Gold'),
('JM-PL-002', 'Pearl Earrings', 8499.50, '["/images/products/two.jpeg"]', 'bridal sets', 'Stunning teardrop earrings decorated with high-luster freshwater pearls and sparkling cubic zirconia accent stones.', 'In Stock', '["elegant", "pearly", "formal"]', 'Silver', 'Everyday', 'White'),
('JM-DM-003', 'Diamond Studs', 24999.99, '["/images/products/three.jpeg"]', 'everyday', 'Brilliant round-cut diamond studs set in a classic four-prong 18k white gold setting. The ultimate statement of luxury.', 'In Stock', '["luxury", "sparkling", "classic"]', 'Gold Plated', 'Everyday', 'White'),
('JM-RB-004', 'Ruby Danglers', 15999.99, '["/images/products/four.jpeg"]', 'bridal sets', 'Glamorous drop earrings featuring deep red synthetic ruby centerstones surrounded by crystal micro-pave accents.', 'In Stock', '["gemstone", "ruby", "statement"]', 'Brass', 'Bridal', 'Red'),
('JM-EM-005', 'Emerald Drops', 18499.50, '["/images/products/five.jpeg"]', 'bridal sets', 'Stunning drop earrings highlighting cushion-cut lab-created emeralds in a vintage gold border. Radiates majestic beauty.', 'Low Stock', '["emerald", "vintage", "elegant"]', 'Gold Plated', 'Festive', 'Green'),
('JM-SV-006', 'Silver Hoops', 5999.99, '["/images/products/six.jpeg"]', 'everyday', 'Polished sterling silver hoop earrings with a secure clasp mechanism. Versatile design suitable for daily wear.', 'In Stock', '["silver", "modern", "casual"]', 'Silver', 'Everyday', 'Silver'),
('JM-KN-007', 'Kundan Jhumka', 9999.99, '["/images/products/seven.jpeg"]', 'kundan', 'Authentic Kundan earrings featuring traditional foil-set gemstones, green glass beads, and meenakari paint detailing on the reverse.', 'In Stock', '["kundan", "royal", "traditional"]', 'Kundan', 'Festive', 'Gold'),
('JM-CB-008', 'Antique Chandbali', 11499.50, '["/images/products/eight.jpeg"]', 'chandbali', 'Moon-shaped antique chandbali earrings finished in oxidized metal tones, showcasing tribal carvings and cascading silver bells.', 'In Stock', '["chandbali", "antique", "rustic"]', 'Brass', 'Festive', 'Gold'),
('JM-MN-009', 'Meenakari Earrings', 7999.99, '["/images/products/nine.jpeg"]', 'meenakari', 'Brightly enameled meenakari drop earrings with floral motifs, pink enamel colors, and tiny white seed pearl fringes.', 'In Stock', '["meenakari", "enamel", "colorful"]', 'Brass', 'Festive', 'Pink'),
('JM-CR-010', 'Crystal Danglers', 6499.99, '["/images/products/ten.jpeg"]', 'everyday', 'Chic long dangle earrings constructed with high-quality multi-faceted glass crystals that capture and reflect light beautifully.', 'Out of Stock', '["crystal", "modern", "dazzling"]', 'Silver', 'Everyday', 'White')
ON CONFLICT (sku) DO NOTHING;
