import db from './db.js';

const categories = [
  { slug: 'jackets', name: 'Куртки и верхняя одежда', position: 1 },
  { slug: 't-shirts', name: 'Футболки', position: 2 },
  { slug: 'hoodies', name: 'Худи', position: 3 },
  { slug: 'pants', name: 'Штаны', position: 4 },
  { slug: 'accessories', name: 'Сумки и аксессуары', position: 5 }
];

const products = [
  // jackets
  { cat: 'jackets', name: 'TommySinny® ShadeV2 Puffer', variant: 'White', price: 15000, popular: 0, image: 'https://placehold.co/800x800/f5f5f5/111?text=ShadeV2+White' },
  { cat: 'jackets', name: 'TommySinny® ShadeV2 Puffer', variant: 'Gray', price: 15000, popular: 0, image: 'https://placehold.co/800x800/cccccc/111?text=ShadeV2+Gray' },
  { cat: 'jackets', name: 'TommySinny® ShadeV2 Puffer', variant: 'Black Phantom', price: 15000, popular: 0, image: 'https://placehold.co/800x800/111/fff?text=ShadeV2+Black' },
  { cat: 'jackets', name: 'TommySinny® ShadeV2 Puffer', variant: 'Midnight Blue', price: 15000, popular: 1, image: 'https://placehold.co/800x800/1a2a52/fff?text=ShadeV2+Blue' },
  { cat: 'jackets', name: 'TommySinny® ShadeV2 Puffer', variant: 'Black', price: 15000, popular: 0, image: 'https://placehold.co/800x800/000/fff?text=ShadeV2+Black' },
  { cat: 'jackets', name: 'TommySinny® ShadeV2 Puffer', variant: 'Bordo', price: 15000, popular: 1, image: 'https://placehold.co/800x800/5a1f24/fff?text=ShadeV2+Bordo' },
  { cat: 'jackets', name: 'TommySinny® ShadeV2 Puffer', variant: 'Olive', price: 15000, popular: 1, image: 'https://placehold.co/800x800/4d5a2f/fff?text=ShadeV2+Olive' },
  { cat: 'jackets', name: 'TommySinny® ShadeV2 Puffer', variant: 'Sweet Gray', price: 15000, popular: 0, image: 'https://placehold.co/800x800/9aa0a8/111?text=ShadeV2+SweetGray' },
  { cat: 'jackets', name: 'TommySinny® ShadeV2 Puffer', variant: 'YasMarina', price: 7990, popular: 0, image: 'https://placehold.co/800x800/6b8aa3/fff?text=ShadeV2+YasMarina' },
  { cat: 'jackets', name: 'TommySinny® ShadeV2 Puffer', variant: 'Orange', price: 15000, popular: 1, image: 'https://placehold.co/800x800/e0612e/fff?text=ShadeV2+Orange' },
  { cat: 'jackets', name: 'TommySinny® Puffa Bomber', variant: 'Camo', price: 13000, popular: 0, image: 'https://placehold.co/800x800/4b5240/fff?text=Puffa+Camo' },
  { cat: 'jackets', name: 'TommySinny® Puffa Bomber', variant: 'Black Classic', price: 13000, popular: 0, image: 'https://placehold.co/800x800/121212/fff?text=Puffa+Black' },
  { cat: 'jackets', name: 'TommySinny® LIGHT PUFFER', variant: "PUFFER VEST'S", price: 3000, popular: 1, image: 'https://placehold.co/800x800/3a1f23/fff?text=Light+Puffer' },

  // t-shirts
  { cat: 't-shirts', name: 'TommySinny® T-Shirt', variant: 'Friendly Mexico', price: 3500, popular: 0, image: 'https://placehold.co/800x800/111/fff?text=T-Shirt+Mexico' },
  { cat: 't-shirts', name: 'TommySinny® T-Shirt', variant: 'Friendly RUSSIA', price: 3500, popular: 0, image: 'https://placehold.co/800x800/111/fff?text=T-Shirt+RU' },

  // hoodies
  { cat: 'hoodies', name: 'TommySinny® Balaclava', variant: 'Sherpa Black', price: 7500, popular: 0, image: 'https://placehold.co/800x800/0a0a0a/fff?text=Balaclava+Black' },
  { cat: 'hoodies', name: 'TommySinny® Balaclava', variant: 'Sherpa Gray', price: 7500, popular: 0, image: 'https://placehold.co/800x800/707075/fff?text=Balaclava+Gray' },
  { cat: 'hoodies', name: 'TommySinny® Balaclava', variant: 'Sherpa White', price: 7500, popular: 0, image: 'https://placehold.co/800x800/f0eee9/111?text=Balaclava+White' },

  // pants
  { cat: 'pants', name: 'TommySinny® SweatPants', variant: 'Black Lions', price: 6000, popular: 0, image: 'https://placehold.co/800x800/0a0a0a/fff?text=Pants+Black+Lions' },
  { cat: 'pants', name: 'TommySinny® SweatPants', variant: 'Gray Lions', price: 6000, popular: 0, image: 'https://placehold.co/800x800/3a3a3a/fff?text=Pants+Gray+Lions' },
  { cat: 'pants', name: 'TommySinny® SweatPants', variant: 'Gray Classic Logo', price: 6000, popular: 0, image: 'https://placehold.co/800x800/9a9a9a/111?text=Pants+Gray+Logo' },
  { cat: 'pants', name: 'TommySinny® SweatPants', variant: 'Black Classic Logo', price: 6000, popular: 0, image: 'https://placehold.co/800x800/0a0a0a/fff?text=Pants+Black+Logo' },
  { cat: 'pants', name: 'TommySinny® SweatPants', variant: 'SweetGray Lions', price: 6000, popular: 0, image: 'https://placehold.co/800x800/c4c2bc/111?text=Pants+SweetGray' },

  // accessories
  { cat: 'accessories', name: 'TommySinny® Camo Square', variant: 'Red Bag', price: 5500, popular: 0, image: 'https://placehold.co/800x800/682027/fff?text=Bag+Red' },
  { cat: 'accessories', name: 'TommySinny® Camo Square', variant: 'White Bag', price: 5500, popular: 0, image: 'https://placehold.co/800x800/dcdad2/111?text=Bag+White' },
  { cat: 'accessories', name: 'TommySinny® Camo Square', variant: 'Gray Bag', price: 5500, popular: 0, image: 'https://placehold.co/800x800/3a3a3a/fff?text=Bag+Gray' },
  { cat: 'accessories', name: 'TommySinny® Monogramma Scarf', variant: 'Black', price: 4000, popular: 1, image: 'https://placehold.co/800x800/0a0a0a/fff?text=Scarf+Black' },
  { cat: 'accessories', name: 'TommySinny® Monogramma Scarf', variant: 'Gray', price: 4000, popular: 1, image: 'https://placehold.co/800x800/2e2e2e/fff?text=Scarf+Gray' },
  { cat: 'accessories', name: 'TommySinny® ALPINA LOGO', variant: 'BLACK SCARF', price: 3000, popular: 1, image: 'https://placehold.co/800x800/060606/3b6cd8?text=ALPINA+SCARF' },
  { cat: 'accessories', name: 'TommySinny® Hat', variant: 'Beige', price: 3000, popular: 1, image: 'https://placehold.co/800x800/efe7d4/111?text=Hat+Beige' },
  { cat: 'accessories', name: 'TommySinny® Hat', variant: 'Drak Blue', price: 3000, popular: 1, image: 'https://placehold.co/800x800/121826/fff?text=Hat+Blue' },
  { cat: 'accessories', name: 'TommySinny® Hat', variant: 'Drak Red', price: 3000, popular: 1, image: 'https://placehold.co/800x800/4d1216/fff?text=Hat+Red' },
  { cat: 'accessories', name: 'TommySinny® Hat', variant: 'Lion Red', price: 3000, popular: 0, image: 'https://placehold.co/800x800/2a0608/fff?text=Hat+Lion+Red' },
  { cat: 'accessories', name: 'TommySinny® Hat', variant: 'White Camo', price: 3000, popular: 0, image: 'https://placehold.co/800x800/c8c8c8/111?text=Hat+White+Camo' },
  { cat: 'accessories', name: 'TommySinny® Hat', variant: 'Black Camo', price: 3000, popular: 0, image: 'https://placehold.co/800x800/202020/fff?text=Hat+Black+Camo' }
];

const slides = [
  { title: 'Будь первым в новой коллекции', subtitle: 'HAPPY 25®', image: 'https://placehold.co/1600x600/0b0b0b/ffffff?text=NEW+COLLECTION+%E2%80%A2+TOMMYSINNY', link: '/catalog/jackets' },
  { title: 'Зимняя серия Puffer', subtitle: 'Coldproof Authority', image: 'https://placehold.co/1600x600/1a1a1a/eaeaea?text=PUFFER+SERIES', link: '/catalog/jackets' },
  { title: 'Балаклавы. Только тёплое.', subtitle: 'Sherpa Drop', image: 'https://placehold.co/1600x600/151515/dadada?text=SHERPA+BALACLAVA', link: '/catalog/hoodies' }
];

const lookbook = [
  { title: 'HAPPY 25®', image: 'https://placehold.co/900x900/4a1316/ffffff?text=LOOKBOOK+I' },
  { title: 'TOMMYSINNY. LAST CHANCE®', image: 'https://placehold.co/900x900/121212/ffffff?text=LOOKBOOK+II' }
];

const celebs = [
  { name: 'Andrey K.', image: 'https://placehold.co/600x800/151515/ffffff?text=CELEB+1' },
  { name: 'Den M.', image: 'https://placehold.co/600x800/c95a1d/ffffff?text=CELEB+2' },
  { name: 'Sasha & Mira', image: 'https://placehold.co/600x800/2a2a2a/ffffff?text=CELEB+3' },
  { name: 'Lev R.', image: 'https://placehold.co/600x800/1f2a3a/ffffff?text=CELEB+4' },
  { name: 'Tata', image: 'https://placehold.co/600x800/581319/ffffff?text=CELEB+5' }
];

export function seed(force = false) {
  const count = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
  if (count > 0 && !force) return;

  if (force) {
    db.exec('DELETE FROM order_items; DELETE FROM orders; DELETE FROM products; DELETE FROM categories; DELETE FROM hero_slides; DELETE FROM lookbook; DELETE FROM celebrities;');
  }

  const insertCat = db.prepare('INSERT INTO categories (slug, name, position) VALUES (?, ?, ?)');
  const insertProd = db.prepare('INSERT INTO products (category_id, name, variant, price, image, is_popular, sizes, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertSlide = db.prepare('INSERT INTO hero_slides (title, subtitle, image, link, position) VALUES (?, ?, ?, ?, ?)');
  const insertLook = db.prepare('INSERT INTO lookbook (title, image, position) VALUES (?, ?, ?)');
  const insertCeleb = db.prepare('INSERT INTO celebrities (name, image, position) VALUES (?, ?, ?)');

  const tx = db.transaction(() => {
    const catIds = {};
    for (const c of categories) {
      const r = insertCat.run(c.slug, c.name, c.position);
      catIds[c.slug] = r.lastInsertRowid;
    }
    const desc = 'Мы, TOMMYSINNY, официально заявляем и гарантируем, что вся представленная в нашем магазине одежда и аксессуары изготовлены из высококачественных материалов. Экологичность и безопасность материалов для здоровья. Соответствие заявленному составу. Прочность, износостойкость и сохранение формы после стирки. Тщательный контроль швов, фурнитуры и отделки.';
    for (const p of products) {
      const sizes = p.cat === 'accessories' ? 'one size' : 'S,M,L,XL';
      insertProd.run(catIds[p.cat], p.name, p.variant, p.price, p.image, p.popular, sizes, desc);
    }
    slides.forEach((s, i) => insertSlide.run(s.title, s.subtitle, s.image, s.link, i));
    lookbook.forEach((l, i) => insertLook.run(l.title, l.image, i));
    celebs.forEach((c, i) => insertCeleb.run(c.name, c.image, i));

    // admin user
    const adminExists = db.prepare('SELECT id FROM users WHERE phone = ?').get('+79000000000');
    if (!adminExists) {
      db.prepare('INSERT INTO users (phone, first_name, last_name, is_admin) VALUES (?, ?, ?, 1)').run('+79000000000', 'Admin', 'TommySinny');
    }
  });
  tx();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const force = process.argv.includes('--force');
  seed(force);
  console.log('Seeded ✓');
  process.exit(0);
}
