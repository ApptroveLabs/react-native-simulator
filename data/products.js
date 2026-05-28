// 50 products across 12 categories — matching Flut Market & Cord Market
const IMG_BASE = 'https://storage.googleapis.com/static.trackier.io/images/test-data/downloaded_images';

const products = [
  // Electronics (11)
  { id: 1, name: 'Smartphone', price: 699.99, category: 'Electronics', description: 'Latest flagship smartphone with 6.7" AMOLED display, 108MP camera, 5G connectivity, and all-day battery life.', image: `${IMG_BASE}/smartphone.jpg`, rating: 4.8 },
  { id: 2, name: 'Laptop', price: 1299.99, category: 'Electronics', description: 'Ultra-thin laptop with M2 chip, 16GB RAM, 512GB SSD, and stunning Retina display for professionals.', image: `${IMG_BASE}/laptop.jpg`, rating: 4.9 },
  { id: 3, name: 'Headphones', price: 199.99, category: 'Electronics', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and studio-quality sound.', image: `${IMG_BASE}/headphones.jpg`, rating: 4.7 },
  { id: 8, name: 'Tablet', price: 449.99, category: 'Electronics', description: '10.9-inch tablet with Liquid Retina display, A14 chip, and Apple Pencil support.', image: `${IMG_BASE}/tablet.jpg`, rating: 4.6 },
  { id: 14, name: 'Smartwatch', price: 299.99, category: 'Electronics', description: 'Advanced smartwatch with health monitoring, GPS, and always-on Retina display.', image: `${IMG_BASE}/smartwatch.jpg`, rating: 4.5 },
  { id: 15, name: 'Wireless Earbuds', price: 129.99, category: 'Electronics', description: 'True wireless earbuds with active noise cancellation and spatial audio.', image: `${IMG_BASE}/earbuds.jpg`, rating: 4.4 },
  { id: 16, name: 'Bluetooth Speaker', price: 79.99, category: 'Electronics', description: 'Portable waterproof Bluetooth speaker with 360° sound and 20-hour battery.', image: `${IMG_BASE}/speaker.jpg`, rating: 4.3 },
  { id: 17, name: 'Gaming Console', price: 499.99, category: 'Electronics', description: 'Next-gen gaming console with 4K gaming, ray tracing, and 1TB SSD storage.', image: `${IMG_BASE}/console.jpg`, rating: 4.8 },
  { id: 18, name: 'Monitor', price: 349.99, category: 'Electronics', description: '27-inch 4K UHD monitor with HDR support and USB-C connectivity for professionals.', image: `${IMG_BASE}/monitor.jpg`, rating: 4.6 },
  { id: 19, name: 'Keyboard', price: 149.99, category: 'Electronics', description: 'Mechanical gaming keyboard with RGB backlighting and hot-swappable switches.', image: `${IMG_BASE}/keyboard.jpg`, rating: 4.5 },
  { id: 39, name: 'VR Headset', price: 499.99, category: 'Electronics', description: 'Immersive virtual reality headset with hand tracking and high-resolution displays.', image: `${IMG_BASE}/vr_headset.jpg`, rating: 4.7 },

  // Clothing (7)
  { id: 4, name: 'T-Shirt', price: 19.99, category: 'Clothing', description: 'Premium cotton t-shirt with a relaxed fit. Available in multiple colors with breathable fabric.', image: `${IMG_BASE}/tshirt.jpg`, rating: 4.3 },
  { id: 5, name: 'Jeans', price: 49.99, category: 'Clothing', description: 'Classic straight-fit denim jeans made from premium stretch cotton for all-day comfort.', image: `${IMG_BASE}/jeans.jpg`, rating: 4.5 },
  { id: 6, name: 'Sneakers', price: 89.99, category: 'Clothing', description: 'Lightweight running sneakers with responsive cushioning and breathable mesh upper.', image: `${IMG_BASE}/sneakers.jpg`, rating: 4.6 },
  { id: 20, name: 'Jacket', price: 129.99, category: 'Clothing', description: 'Water-resistant windbreaker jacket with adjustable hood and zippered pockets.', image: `${IMG_BASE}/jacket.jpg`, rating: 4.4 },
  { id: 25, name: 'Dress', price: 79.99, category: 'Clothing', description: 'Elegant midi dress with floral pattern, perfect for both casual and formal occasions.', image: `${IMG_BASE}/dress.jpg`, rating: 4.5 },
  { id: 26, name: 'Hoodie', price: 59.99, category: 'Clothing', description: 'Cozy fleece-lined hoodie with kangaroo pocket and adjustable drawstring hood.', image: `${IMG_BASE}/hoodie.jpg`, rating: 4.6 },
  { id: 27, name: 'Shorts', price: 34.99, category: 'Clothing', description: 'Athletic shorts with quick-dry fabric, elastic waistband, and zippered pockets.', image: `${IMG_BASE}/shorts.jpg`, rating: 4.2 },

  // Books (2)
  { id: 7, name: 'Novel', price: 14.99, category: 'Books', description: 'Bestselling fiction novel - an epic tale of adventure, mystery, and self-discovery.', image: `${IMG_BASE}/novel.jpg`, rating: 4.8 },
  { id: 28, name: 'Cookbook', price: 24.99, category: 'Books', description: 'Comprehensive cookbook with 500+ recipes from around the world, beautifully illustrated.', image: `${IMG_BASE}/cookbook.jpg`, rating: 4.7 },

  // Home (13)
  { id: 9, name: 'Sofa', price: 499.99, category: 'Home', description: 'Modern 3-seater sofa with premium upholstery, deep cushions, and sturdy hardwood frame.', image: `${IMG_BASE}/sofa.jpg`, rating: 4.5 },
  { id: 10, name: 'Desk Lamp', price: 39.99, category: 'Home', description: 'LED desk lamp with adjustable brightness, color temperature, and wireless charging base.', image: `${IMG_BASE}/desk_lamp.jpg`, rating: 4.4 },
  { id: 29, name: 'Coffee Table', price: 199.99, category: 'Home', description: 'Minimalist coffee table with tempered glass top and solid oak legs.', image: `${IMG_BASE}/coffee_table.jpg`, rating: 4.3 },
  { id: 30, name: 'Bookshelf', price: 149.99, category: 'Home', description: '5-tier open bookshelf with industrial-style metal frame and wooden shelves.', image: `${IMG_BASE}/bookshelf.jpg`, rating: 4.4 },
  { id: 31, name: 'Rug', price: 89.99, category: 'Home', description: 'Hand-woven area rug with geometric patterns, soft underfoot and easy to clean.', image: `${IMG_BASE}/rug.jpg`, rating: 4.2 },
  { id: 32, name: 'Curtains', price: 44.99, category: 'Home', description: 'Blackout curtains with thermal insulation, available in multiple colors and sizes.', image: `${IMG_BASE}/curtains.jpg`, rating: 4.3 },
  { id: 33, name: 'Pillow Set', price: 29.99, category: 'Home', description: 'Set of 4 decorative throw pillows with removable, machine-washable covers.', image: `${IMG_BASE}/pillows.jpg`, rating: 4.5 },
  { id: 34, name: 'Wall Art', price: 59.99, category: 'Home', description: 'Modern abstract canvas print set, gallery-wrapped and ready to hang.', image: `${IMG_BASE}/wall_art.jpg`, rating: 4.6 },
  { id: 35, name: 'Vase', price: 34.99, category: 'Home', description: 'Handcrafted ceramic vase with a matte finish, perfect for fresh or dried flowers.', image: `${IMG_BASE}/vase.jpg`, rating: 4.4 },
  { id: 36, name: 'Candle Set', price: 24.99, category: 'Home', description: 'Luxury scented candle set with natural soy wax and premium essential oils.', image: `${IMG_BASE}/candles.jpg`, rating: 4.7 },
  { id: 37, name: 'Mirror', price: 79.99, category: 'Home', description: 'Full-length standing mirror with elegant gold frame and anti-shatter backing.', image: `${IMG_BASE}/mirror.jpg`, rating: 4.3 },
  { id: 38, name: 'Plant Pot', price: 19.99, category: 'Home', description: 'Set of 3 modern ceramic plant pots with drainage holes and bamboo saucers.', image: `${IMG_BASE}/plant_pot.jpg`, rating: 4.5 },
  { id: 48, name: 'Blanket', price: 49.99, category: 'Home', description: 'Ultra-soft fleece throw blanket, oversized for maximum comfort and warmth.', image: `${IMG_BASE}/blanket.jpg`, rating: 4.6 },

  // Accessories (4)
  { id: 11, name: 'Backpack', price: 59.99, category: 'Accessories', description: 'Durable everyday backpack with laptop compartment, water bottle pockets, and USB charging port.', image: `${IMG_BASE}/backpack.jpg`, rating: 4.6 },
  { id: 12, name: 'Watch', price: 149.99, category: 'Accessories', description: 'Classic analog watch with genuine leather strap and sapphire crystal glass.', image: `${IMG_BASE}/watch.jpg`, rating: 4.7 },
  { id: 40, name: 'Sunglasses', price: 89.99, category: 'Accessories', description: 'Polarized sunglasses with UV400 protection and lightweight titanium frame.', image: `${IMG_BASE}/sunglasses.jpg`, rating: 4.4 },
  { id: 41, name: 'Wallet', price: 39.99, category: 'Accessories', description: 'Premium leather bifold wallet with RFID blocking technology and multiple card slots.', image: `${IMG_BASE}/wallet.jpg`, rating: 4.5 },

  // Fitness (3)
  { id: 21, name: 'Yoga Mat', price: 29.99, category: 'Fitness', description: 'Non-slip yoga mat with alignment marks, 6mm thick for maximum cushioning.', image: `${IMG_BASE}/yoga_mat.jpg`, rating: 4.5 },
  { id: 22, name: 'Dumbbells', price: 79.99, category: 'Fitness', description: 'Adjustable dumbbell set (5-25 lbs) with quick-change weight system and storage tray.', image: `${IMG_BASE}/dumbbells.jpg`, rating: 4.6 },
  { id: 42, name: 'Resistance Bands', price: 19.99, category: 'Fitness', description: 'Set of 5 resistance bands with different tension levels, includes door anchor and carry bag.', image: `${IMG_BASE}/resistance_bands.jpg`, rating: 4.3 },

  // Health (1)
  { id: 23, name: 'Water Bottle', price: 24.99, category: 'Health', description: 'Insulated stainless steel water bottle that keeps drinks cold 24hrs or hot 12hrs.', image: `${IMG_BASE}/water_bottle.jpg`, rating: 4.4 },

  // Photography (1)
  { id: 13, name: 'Camera', price: 899.99, category: 'Photography', description: 'Professional mirrorless camera with 45MP sensor, 4K video, and weather-sealed body.', image: `${IMG_BASE}/camera.jpg`, rating: 4.9 },

  // Toys (1)
  { id: 43, name: 'Building Blocks', price: 34.99, category: 'Toys', description: 'Creative building block set with 1000+ pieces, compatible with all major brands.', image: `${IMG_BASE}/building_blocks.jpg`, rating: 4.7 },

  // Music (1)
  { id: 50, name: 'Digital Piano', price: 599.99, category: 'Music', description: 'Full-size 88-key weighted digital piano with hammer action and premium sound samples.', image: `${IMG_BASE}/digital_piano.jpg`, rating: 4.8 },

  // Pets (2)
  { id: 44, name: 'Pet Bed', price: 44.99, category: 'Pets', description: 'Orthopedic pet bed with memory foam and machine-washable removable cover.', image: `${IMG_BASE}/pet_bed.jpg`, rating: 4.5 },
  { id: 45, name: 'Pet Toys Set', price: 19.99, category: 'Pets', description: 'Assorted pet toy set with chew toys, rope toys, and interactive puzzle toys.', image: `${IMG_BASE}/pet_toys.jpg`, rating: 4.3 },
];

// Extract unique categories
const categories = ['All', ...new Set(products.map(p => p.category))];

export { products, categories };
export default products;
