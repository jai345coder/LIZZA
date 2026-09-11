import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import ItemModel from "./src/models/Item.model.js";

export const dummyItems = [
  // ================= PIZZAS =================
  {
    name: "THE CHAOS PEPPERONI",
    category: "PIZZA",
    basePrice: 18.99,
    description: "Double pep, hot honey drizzle, chaotic crust, zero rules.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 6 }
    ],
    toppings: [{ name: "Pepperoni" }, { name: "Hot Honey" }, { name: "Extra Cheese" }],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "FIREBREATHER",
    category: "PIZZA",
    basePrice: 19.99,
    description: "Spicy ground beef, jalapeños, hot chili crunch & habanero honey.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 6 }
    ],
    toppings: [{ name: "Spicy Ground Beef" }, { name: "Jalapeños" }, { name: "Chili Crunch" }],
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "CLASSIC MARGH",
    category: "PIZZA",
    basePrice: 16.00,
    description: "Fresh basil, fior di latte mozzarella, slow roasted tomato sauce.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 5 }
    ],
    toppings: [{ name: "Fresh Basil" }, { name: "Mozzarella" }, { name: "Tomato Sauce" }],
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "TRUFFLE MONSTER",
    category: "PIZZA",
    basePrice: 21.50,
    description: "Wild forest mushrooms, black truffle cream, thyme & parmesan.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 4 },
      { size: "L", priceModifier: 7 }
    ],
    toppings: [{ name: "Forest Mushrooms" }, { name: "Truffle Cream" }, { name: "Parmesan" }],
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "BBQ CHICKEN CHAOS",
    category: "PIZZA",
    basePrice: 18.99,
    description: "Smoky BBQ base, grilled chicken, red onions, cilantro crunch.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 6 }
    ],
    toppings: [{ name: "Grilled Chicken" }, { name: "BBQ Sauce" }, { name: "Red Onions" }],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "TRUFFLE FLEX",
    category: "PIZZA",
    basePrice: 22.00,
    description: "White sauce, truffle oil, porcini mushrooms, whipped ricotta.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 4 },
      { size: "L", priceModifier: 7 }
    ],
    toppings: [{ name: "Porcini Mushrooms" }, { name: "Truffle Oil" }, { name: "Whipped Ricotta" }],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "MAC ATTACK",
    category: "PIZZA",
    basePrice: 18.00,
    description: "Creamy mac & cheese, bacon bits, scallions, cheddar drizzle.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 5 }
    ],
    toppings: [{ name: "Macaroni" }, { name: "Bacon Bits" }, { name: "Cheddar Drizzle" }],
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "NASHVILLE HOT GIRL",
    category: "PIZZA",
    basePrice: 19.00,
    description: "Hot chicken, pickles, slaw, secret spicy honey sauce.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 6 }
    ],
    toppings: [{ name: "Hot Chicken" }, { name: "Pickles" }, { name: "Spicy Honey" }],
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "BUFFALO RIZZ",
    category: "PIZZA",
    basePrice: 17.50,
    description: "Spicy buffalo chicken, ranch drizzle, celery crunch.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 5 }
    ],
    toppings: [{ name: "Buffalo Chicken" }, { name: "Ranch Drizzle" }],
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "VEGGIE VIBES ONLY",
    category: "PIZZA",
    basePrice: 16.00,
    description: "Roasted peppers, zucchini, spinach, feta & garlic confit.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 5 }
    ],
    toppings: [{ name: "Roasted Peppers" }, { name: "Zucchini" }, { name: "Feta Cheese" }],
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "PESTO PARADISE",
    category: "PIZZA",
    basePrice: 17.50,
    description: "Basil pesto base, sun-dried tomatoes, pine nuts & goat cheese.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 5 }
    ],
    toppings: [{ name: "Basil Pesto" }, { name: "Sun-Dried Tomatoes" }, { name: "Goat Cheese" }],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "SMOKEY BACON BURST",
    category: "PIZZA",
    basePrice: 19.50,
    description: "Applewood bacon, smoked gouda, crispy onions & maple drizzle.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 6 }
    ],
    toppings: [{ name: "Applewood Bacon" }, { name: "Smoked Gouda" }, { name: "Crispy Onions" }],
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "PESTO BURRATA BOMB",
    category: "PIZZA",
    basePrice: 21.00,
    description: "Fresh burrata, wild basil pesto, roasted cherry tomatoes & balsamic glaze.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 4 },
      { size: "L", priceModifier: 7 }
    ],
    toppings: [{ name: "Burrata Cheese" }, { name: "Wild Pesto" }, { name: "Cherry Tomatoes" }],
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "HOT HONEY HOTDOG PIE",
    category: "PIZZA",
    basePrice: 17.99,
    description: "Sliced spicy sausage, hot honey drizzle, pickled jalapeños.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 6 }
    ],
    toppings: [{ name: "Spicy Sausage" }, { name: "Hot Honey" }, { name: "Pickled Jalapeños" }],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "VOLCANO HABANERO",
    category: "PIZZA",
    basePrice: 20.50,
    description: "Fiery habanero sauce, spicy chorizo, serrano peppers & jack cheese.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 4 },
      { size: "L", priceModifier: 7 }
    ],
    toppings: [{ name: "Spicy Chorizo" }, { name: "Habanero Sauce" }, { name: "Serrano Peppers" }],
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "GHOST PEPPER MONSTER",
    category: "PIZZA",
    basePrice: 21.99,
    description: "Ghost pepper infused marinara, spicy salami & chili flakes.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 4 },
      { size: "L", priceModifier: 7 }
    ],
    toppings: [{ name: "Spicy Salami" }, { name: "Ghost Pepper Marinara" }, { name: "Chili Flakes" }],
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "CHILI CRUNCH PEPPERONI",
    category: "PIZZA",
    basePrice: 19.50,
    description: "Crispy pepperoni overload coated in garlic chili crisp oil.",
    sizes: [
      { size: "S", priceModifier: 0 },
      { size: "M", priceModifier: 3 },
      { size: "L", priceModifier: 6 }
    ],
    toppings: [{ name: "Pepperoni" }, { name: "Garlic Chili Crisp" }],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },

  // ================= SIDES =================
  {
    name: "GARLIC BOMB KNOTS",
    category: "Sides",
    basePrice: 6.99,
    description: "Garlic butter soaked dough knots with marinara dunk.",
    sizes: [{ size: "M", priceModifier: 0 }],
    toppings: [{ name: "Garlic Butter" }, { name: "Parmesan" }],
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "SPICY BUFFALO WINGS",
    category: "Sides",
    basePrice: 9.99,
    description: "Crispy fried wings tossed in signature hot sauce.",
    sizes: [{ size: "M", priceModifier: 0 }],
    toppings: [{ name: "Buffalo Sauce" }, { name: "Ranch Dip" }],
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "TRUFFLE PARM FRIES",
    category: "Sides",
    basePrice: 7.50,
    description: "Hand-cut fries, truffle oil, aged parmesan & parsley.",
    sizes: [{ size: "M", priceModifier: 0 }],
    toppings: [{ name: "Truffle Oil" }, { name: "Parmesan" }],
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "HOT HONEY DIP",
    category: "Sides",
    basePrice: 2.00,
    description: "Chili infused wild wildflower honey.",
    sizes: [{ size: "S", priceModifier: 0 }],
    toppings: [{ name: "Chili Honey" }],
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "CHEESY CHAOS DIP",
    category: "Sides",
    basePrice: 2.50,
    description: "Warm melted queso with jalapeno bits.",
    sizes: [{ size: "S", priceModifier: 0 }],
    toppings: [{ name: "Melted Queso" }, { name: "Jalapeño" }],
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },

  // ================= DRINKS =================
  {
    name: "LIZZA POP",
    category: "DRINKS",
    basePrice: 2.50,
    description: "Craft fizzy citrus soda with a sharp punch.",
    sizes: [{ size: "M", priceModifier: 0 }],
    toppings: [],
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "BRAIN ROT BERRY",
    category: "DRINKS",
    basePrice: 5.99,
    description: "Wild berry slush with sour pop rocks.",
    sizes: [{ size: "M", priceModifier: 0 }],
    toppings: [],
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "FIT CHECK ENERGY",
    category: "DRINKS",
    basePrice: 4.50,
    description: "Electrifying citrus energy brew for nocturnal coders.",
    sizes: [{ size: "M", priceModifier: 0 }],
    toppings: [],
    image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  },
  {
    name: "ICE COLD TEA",
    category: "DRINKS",
    basePrice: 3.25,
    description: "Peach infused iced tea with mint leaf refresh.",
    sizes: [{ size: "M", priceModifier: 0 }],
    toppings: [],
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    isAvailable: true
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.DATABASE_URL || "mongodb://localhost:27017/oibsip_level3";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);
    
    console.log("Inserting/updating dummy menu items...");
    for (const item of dummyItems) {
      await ItemModel.updateOne({ name: item.name }, { $set: item }, { upsert: true });
    }
    console.log(`✅ Successfully seeded/synced ${dummyItems.length} items in MongoDB!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

// Only execute directly if invoked via node CLI

  seedDatabase();

