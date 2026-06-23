import bisque from "@/assets/recipe-bisque.jpg";
import wagyu from "@/assets/recipe-wagyu.jpg";
import pasta from "@/assets/recipe-pasta.jpg";
import salad from "@/assets/recipe-salad.jpg";
import dessert from "@/assets/recipe-dessert.jpg";
import bruschetta from "@/assets/recipe-bruschetta.jpg";
import herbs from "@/assets/blog-herbs.jpg";

export type Recipe = {
  id: string;
  title: string;
  chef: string;
  category: "dinner" | "starter" | "dessert" | "breakfast";
  region: string;
  time: string;
  difficulty: string;
  calories: number;
  image: string;
  tag?: string;
  description: string;
  ingredients: { name: string; qty: string }[];
  steps: string[];
};

export const recipes: Recipe[] = [
  {
    id: "wagyu-chimichurri",
    title: "Pan-Seared Wagyu with Chimichurri",
    chef: "Marco Bellini",
    category: "dinner",
    region: "South American",
    time: "35 min",
    difficulty: "Intermediate",
    calories: 450,
    image: wagyu,
    tag: "Chef's Pick",
    description:
      "A bold, herby steak with bright chimichurri — minimal effort, restaurant-grade payoff.",
    ingredients: [
      { name: "A5 Wagyu Ribeye", qty: "400g" },
      { name: "Fresh Parsley", qty: "1 bunch" },
      { name: "Garlic Cloves", qty: "3 pcs" },
      { name: "Red Wine Vinegar", qty: "2 tbsp" },
      { name: "Sea Salt", qty: "to taste" },
    ],
    steps: [
      "Pat steak dry. Season generously with sea salt and cracked pepper.",
      "Rest at room temperature 15 minutes before searing.",
      "Sear in cast iron over high heat, 2 minutes each side.",
      "Whisk chimichurri ingredients. Spoon over rested steak. Serve.",
    ],
  },
  {
    id: "leek-bisque",
    title: "Smoked Leek & Potato Bisque",
    chef: "Elena Rossi",
    category: "starter",
    region: "Nordic",
    time: "45 min",
    difficulty: "Easy",
    calories: 280,
    image: bisque,
    tag: "Trending",
    description: "A silky, smoke-kissed soup that tastes like the first cold evening of autumn.",
    ingredients: [
      { name: "Leeks", qty: "4 large" },
      { name: "Yukon Potatoes", qty: "500g" },
      { name: "Cream", qty: "200ml" },
      { name: "Vegetable Stock", qty: "1L" },
    ],
    steps: [
      "Char leeks under broiler until skin blackens.",
      "Simmer with potatoes and stock until tender.",
      "Blend smooth. Stir in cream. Season.",
    ],
  },
  {
    id: "truffle-pasta",
    title: "Truffle Infused Linguine",
    chef: "Julian Thorne",
    category: "dinner",
    region: "Mediterranean",
    time: "25 min",
    difficulty: "Easy",
    calories: 520,
    image: pasta,
    tag: "Quick",
    description: "Hand-made pasta with winter black truffle and aged parmesan.",
    ingredients: [
      { name: "Fresh Linguine", qty: "300g" },
      { name: "Black Truffle", qty: "10g" },
      { name: "Parmesan", qty: "60g" },
      { name: "Butter", qty: "40g" },
    ],
    steps: [
      "Cook pasta in salted water until al dente.",
      "Melt butter, toss pasta with parmesan and a splash of pasta water.",
      "Shave truffle over the top before serving.",
    ],
  },
  {
    id: "burrata-salad",
    title: "Heirloom Tomato & Burrata",
    chef: "Sofia Marchetti",
    category: "starter",
    region: "Mediterranean",
    time: "15 min",
    difficulty: "Easy",
    calories: 320,
    image: salad,
    description: "Three ingredients, perfect technique. Summer on a plate.",
    ingredients: [
      { name: "Heirloom Tomatoes", qty: "2 large" },
      { name: "Burrata", qty: "1 ball" },
      { name: "Fresh Basil", qty: "1 handful" },
      { name: "Olive Oil", qty: "to taste" },
    ],
    steps: [
      "Slice tomatoes thickly. Salt generously.",
      "Tear burrata over tomatoes.",
      "Finish with basil and a generous pour of oil.",
    ],
  },
  {
    id: "lava-cake",
    title: "Molten Chocolate Lava Cake",
    chef: "Anika Sharma",
    category: "dessert",
    region: "East Asian",
    time: "30 min",
    difficulty: "Intermediate",
    calories: 480,
    image: dessert,
    tag: "Indulgent",
    description: "A warm centre that flows on the first cut. Pair with raspberry coulis.",
    ingredients: [
      { name: "Dark Chocolate 70%", qty: "200g" },
      { name: "Butter", qty: "100g" },
      { name: "Eggs", qty: "4" },
      { name: "Sugar", qty: "100g" },
    ],
    steps: [
      "Melt chocolate and butter together.",
      "Whisk eggs and sugar to ribbons. Fold into chocolate.",
      "Bake at 220°C for 8 minutes. Serve immediately.",
    ],
  },
  {
    id: "bruschetta",
    title: "Heritage Tomato Bruschetta",
    chef: "Marco Bellini",
    category: "starter",
    region: "Mediterranean",
    time: "10 min",
    difficulty: "Easy",
    calories: 180,
    image: bruschetta,
    description: "Charred sourdough, ripe tomato, torn basil. Don't overthink it.",
    ingredients: [
      { name: "Sourdough", qty: "4 thick slices" },
      { name: "Ripe Tomatoes", qty: "3" },
      { name: "Basil", qty: "1 handful" },
      { name: "Garlic", qty: "1 clove" },
    ],
    steps: [
      "Toast bread until edges char.",
      "Rub with cut garlic. Top with chopped tomato and basil.",
      "Drizzle with oil and flaky salt.",
    ],
  },
];

export type Blog = {
  id: string;
  title: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
  excerpt: string;
  body: string;
};

export const blogs: Blog[] = [
  {
    id: "french-omelette",
    title: "Mastering the French Omelette",
    author: "Chef Marco",
    readTime: "8 min read",
    category: "Technique",
    image: herbs,
    excerpt: "Three ingredients. One pan. A lifetime of practice. Here's where to start.",
    body: "The French omelette is the truest test of a cook. No browning, no filling that competes — just butter, eggs, and the patient hand of the cook moving the pan...",
  },
  {
    id: "umami-broths",
    title: "The Art of Umami: Master Your Broths",
    author: "Maria Gonzalez",
    readTime: "12 min read",
    category: "Deep Dive",
    image: bisque,
    excerpt: "Broth is the difference between cooking and cuisine. Learn to build it from scratch.",
    body: "Stock vs broth. Bones vs scraps. Time vs heat. The variables that turn water into the foundation of everything you'll cook this winter...",
  },
  {
    id: "sourdough-secrets",
    title: "5 Secret Ingredients for Perfect Sourdough",
    author: "Chef Julian Ross",
    readTime: "4 min read",
    category: "Bakery",
    image: pasta,
    excerpt: "The bread bakers of Lyon won't tell you these. We will.",
    body: "Flour matters. Hydration matters. But temperature, time, and the unseen wild yeast in your kitchen matter most...",
  },
];

export const regions = [
  { id: "med", name: "Mediterranean", country: "Italy · Greece · Spain", emoji: "🫒", grad: "from-leaf to-saffron" },
  { id: "east-asian", name: "East Asian", country: "Japan · China · Korea", emoji: "🥢", grad: "from-spice to-berry" },
  { id: "nordic", name: "Nordic", country: "Sweden · Norway · Denmark", emoji: "🌲", grad: "from-ocean to-leaf" },
  { id: "south-am", name: "South American", country: "Argentina · Brazil · Peru", emoji: "🌶️", grad: "from-tangerine to-spice" },
  { id: "middle-east", name: "Middle Eastern", country: "Lebanon · Turkey · Morocco", emoji: "🧆", grad: "from-saffron to-tangerine" },
  { id: "indian", name: "Indian", country: "India · Sri Lanka · Nepal", emoji: "🍛", grad: "from-berry to-grape" },
];

export const regionCountries: Record<string, { name: string; emoji: string; tagline: string }[]> = {
  med: [
    { name: "Italy", emoji: "🇮🇹", tagline: "Pasta, pizza, espresso." },
    { name: "Greece", emoji: "🇬🇷", tagline: "Olive oil, feta, sunshine." },
    { name: "Spain", emoji: "🇪🇸", tagline: "Tapas, jamón, sherry." },
  ],
  "east-asian": [
    { name: "Japan", emoji: "🇯🇵", tagline: "Umami, precision, restraint." },
    { name: "China", emoji: "🇨🇳", tagline: "Bold heat, deep wok flavor." },
    { name: "Korea", emoji: "🇰🇷", tagline: "Fermentation, fire, balance." },
  ],
  nordic: [
    { name: "Sweden", emoji: "🇸🇪", tagline: "Cardamom and clean lines." },
    { name: "Norway", emoji: "🇳🇴", tagline: "Cold-water fish, dark rye." },
    { name: "Denmark", emoji: "🇩🇰", tagline: "Smørrebrød elegance." },
  ],
  "south-am": [
    { name: "Argentina", emoji: "🇦🇷", tagline: "Asado, chimichurri, malbec." },
    { name: "Brazil", emoji: "🇧🇷", tagline: "Tropical, smoky, sweet." },
    { name: "Peru", emoji: "🇵🇪", tagline: "Lime-bright Pacific cuisine." },
  ],
  "middle-east": [
    { name: "Lebanon", emoji: "🇱🇧", tagline: "Mezze, herbs, sumac." },
    { name: "Turkey", emoji: "🇹🇷", tagline: "Charcoal, spice, syrup." },
    { name: "Morocco", emoji: "🇲🇦", tagline: "Tagine, preserved lemon." },
  ],
  indian: [
    { name: "India", emoji: "🇮🇳", tagline: "Layered masala, regional depth." },
    { name: "Sri Lanka", emoji: "🇱🇰", tagline: "Coconut heat, hopper bread." },
    { name: "Nepal", emoji: "🇳🇵", tagline: "Momo, mountain warmth." },
  ],
};

export const mealTypes = [
  "Quick Dinners","Starters","Desserts","Breakfast","Vegan","Seafood","Beef","Pasta",
];

export const categories = [
  { slug: "dinner", label: "Dinner", emoji: "🍽️" },
  { slug: "starter", label: "Starters", emoji: "🥗" },
  { slug: "dessert", label: "Desserts", emoji: "🍰" },
  { slug: "breakfast", label: "Breakfast", emoji: "🥐" },
] as const;

export type RegionDish = { category: string; emoji: string; name: string; time: string; difficulty: string; note: string; country?: string };

// Country attribution per dish (used for the drill-down). Falls back to first country.
const C: Record<string, string[][]> = {
  med:          [["Italy","Spain","Greece","Italy"], ["Greece","Italy","Italy","Spain"]],
  "east-asian": [["Japan","China","Japan","Korea"], ["Japan","China","Japan","Korea"]],
  nordic:       [["Sweden","Denmark","Norway","Norway"], ["Norway","Norway","Sweden","Sweden"]],
  "south-am":   [["Argentina","Brazil","Argentina","Peru"], ["Argentina","Peru","Argentina","Brazil"]],
  "middle-east":[["Morocco","Lebanon","Lebanon","Lebanon"], ["Turkey","Morocco","Turkey","Lebanon"]],
  indian:       [["India","India","India","India"], ["India","India","India","India"]],
};

const _rawDishes: Record<string, RegionDish[]> = {
  med: [
    { category: "breakfast", emoji: "🥐", name: "Cornetto & Espresso", time: "10 min", difficulty: "Easy", note: "Buttery crescent, dark espresso." },
    { category: "breakfast", emoji: "🍅", name: "Pan con Tomate", time: "12 min", difficulty: "Easy", note: "Sourdough, ripe tomato, olive oil." },
    { category: "starter", emoji: "🥗", name: "Greek Village Salad", time: "15 min", difficulty: "Easy", note: "Feta, cucumber, oregano." },
    { category: "starter", emoji: "🍞", name: "Heritage Bruschetta", time: "10 min", difficulty: "Easy", note: "Charred sourdough, basil." },
    { category: "dinner", emoji: "🍝", name: "Truffle Linguine", time: "25 min", difficulty: "Easy", note: "Black truffle, aged parmesan." },
    { category: "dinner", emoji: "🐟", name: "Lemon Branzino", time: "30 min", difficulty: "Intermediate", note: "Whole roasted with herbs." },
    { category: "dessert", emoji: "🍰", name: "Tiramisu", time: "30 min", difficulty: "Easy", note: "Mascarpone, espresso, cocoa." },
    { category: "dessert", emoji: "🍮", name: "Crema Catalana", time: "40 min", difficulty: "Intermediate", note: "Citrus custard, brûléed top." },
  ],
  "east-asian": [
    { category: "breakfast", emoji: "🍚", name: "Tamago Kake Gohan", time: "5 min", difficulty: "Easy", note: "Rice, raw egg, soy." },
    { category: "breakfast", emoji: "🥟", name: "Soup Dumplings", time: "60 min", difficulty: "Intermediate", note: "Xiao long bao at home." },
    { category: "starter", emoji: "🍣", name: "Salmon Nigiri", time: "20 min", difficulty: "Intermediate", note: "Two-ingredient mastery." },
    { category: "starter", emoji: "🥬", name: "Kimchi Pancake", time: "20 min", difficulty: "Easy", note: "Crispy edges, tangy core." },
    { category: "dinner", emoji: "🍜", name: "Tonkotsu Ramen", time: "90 min", difficulty: "Intermediate", note: "Pork bone broth, chashu." },
    { category: "dinner", emoji: "🥘", name: "Mapo Tofu", time: "25 min", difficulty: "Easy", note: "Numbing, spicy, deep." },
    { category: "dessert", emoji: "🍡", name: "Matcha Mochi", time: "30 min", difficulty: "Intermediate", note: "Soft, chewy, grassy." },
    { category: "dessert", emoji: "🍧", name: "Mango Bingsu", time: "15 min", difficulty: "Easy", note: "Shaved ice, condensed milk." },
  ],
  nordic: [
    { category: "breakfast", emoji: "🥣", name: "Skyr Bowl", time: "5 min", difficulty: "Easy", note: "Icelandic yogurt, berries, oats." },
    { category: "breakfast", emoji: "🍞", name: "Smørrebrød", time: "10 min", difficulty: "Easy", note: "Rye, butter, smoked fish." },
    { category: "starter", emoji: "🍲", name: "Smoked Leek Bisque", time: "45 min", difficulty: "Easy", note: "Silky, smoky, autumnal." },
    { category: "starter", emoji: "🐟", name: "Gravlax", time: "48 hr", difficulty: "Easy", note: "Cured salmon, dill, mustard." },
    { category: "dinner", emoji: "🦌", name: "Roast Venison", time: "60 min", difficulty: "Intermediate", note: "Juniper, lingonberry jus." },
    { category: "dinner", emoji: "🐟", name: "Pan-Fried Cod", time: "20 min", difficulty: "Easy", note: "Brown butter, capers." },
    { category: "dessert", emoji: "🥧", name: "Cardamom Bun", time: "3 hr", difficulty: "Intermediate", note: "Swedish kardemummabullar." },
    { category: "dessert", emoji: "🍓", name: "Cloudberry Cream", time: "10 min", difficulty: "Easy", note: "Arctic berry, whipped cream." },
  ],
  "south-am": [
    { category: "breakfast", emoji: "🥐", name: "Medialunas", time: "20 min", difficulty: "Easy", note: "Sweet Argentine croissant." },
    { category: "breakfast", emoji: "🌽", name: "Arepa de Huevo", time: "25 min", difficulty: "Easy", note: "Corn cake stuffed with egg." },
    { category: "starter", emoji: "🥟", name: "Beef Empanada", time: "60 min", difficulty: "Intermediate", note: "Hand pies, golden crust." },
    { category: "starter", emoji: "🐟", name: "Peruvian Ceviche", time: "15 min", difficulty: "Easy", note: "Lime-cured fish, aji." },
    { category: "dinner", emoji: "🥩", name: "Wagyu Chimichurri", time: "35 min", difficulty: "Intermediate", note: "Bold steak, herby sauce." },
    { category: "dinner", emoji: "🍗", name: "Pollo a la Brasa", time: "90 min", difficulty: "Intermediate", note: "Peruvian rotisserie chicken." },
    { category: "dessert", emoji: "🍮", name: "Dulce de Leche Flan", time: "60 min", difficulty: "Easy", note: "Silky caramel custard." },
    { category: "dessert", emoji: "🍫", name: "Brigadeiro", time: "20 min", difficulty: "Easy", note: "Brazilian chocolate truffle." },
  ],
  "middle-east": [
    { category: "breakfast", emoji: "🥚", name: "Shakshuka", time: "25 min", difficulty: "Easy", note: "Eggs poached in spiced tomato." },
    { category: "breakfast", emoji: "🫓", name: "Manakish Za'atar", time: "30 min", difficulty: "Easy", note: "Flatbread, thyme, olive oil." },
    { category: "starter", emoji: "🧆", name: "Crispy Falafel", time: "40 min", difficulty: "Intermediate", note: "Herb-flecked chickpea." },
    { category: "starter", emoji: "🥣", name: "Hummus & Pita", time: "20 min", difficulty: "Easy", note: "Creamy, tahini-rich." },
    { category: "dinner", emoji: "🍢", name: "Lamb Kofta", time: "45 min", difficulty: "Easy", note: "Spiced ground lamb skewers." },
    { category: "dinner", emoji: "🍲", name: "Moroccan Tagine", time: "90 min", difficulty: "Intermediate", note: "Slow chicken, preserved lemon." },
    { category: "dessert", emoji: "🍯", name: "Pistachio Baklava", time: "75 min", difficulty: "Intermediate", note: "Layered phyllo, honey." },
    { category: "dessert", emoji: "🍮", name: "Muhallabia", time: "20 min", difficulty: "Easy", note: "Rosewater milk pudding." },
  ],
  indian: [
    { category: "breakfast", emoji: "🥞", name: "Masala Dosa", time: "30 min", difficulty: "Intermediate", note: "Crisp crepe, spiced potato." },
    { category: "breakfast", emoji: "🍛", name: "Poha", time: "15 min", difficulty: "Easy", note: "Flattened rice, peanuts." },
    { category: "starter", emoji: "🥟", name: "Vegetable Samosa", time: "45 min", difficulty: "Intermediate", note: "Golden pastry, chai partner." },
    { category: "starter", emoji: "🍢", name: "Paneer Tikka", time: "30 min", difficulty: "Easy", note: "Charred, yogurt-marinated." },
    { category: "dinner", emoji: "🍛", name: "Butter Chicken", time: "45 min", difficulty: "Easy", note: "Tomato-cream, fenugreek." },
    { category: "dinner", emoji: "🍚", name: "Hyderabadi Biryani", time: "90 min", difficulty: "Intermediate", note: "Layered saffron rice." },
    { category: "dessert", emoji: "🍮", name: "Gulab Jamun", time: "40 min", difficulty: "Easy", note: "Cardamom syrup dumplings." },
    { category: "dessert", emoji: "🍨", name: "Pistachio Kulfi", time: "6 hr", difficulty: "Easy", note: "Dense, slow-frozen cream." },
  ],
};

// Attach country tags to dishes based on C map (flattened by index)
export const regionDishes: Record<string, RegionDish[]> = Object.fromEntries(
  Object.entries(_rawDishes).map(([rid, list]) => {
    const flat = (C[rid] ?? []).flat();
    return [rid, list.map((d, i) => ({ ...d, country: flat[i] ?? regionCountries[rid]?.[0]?.name }))];
  }),
);

export const cookingTips = [
  { icon: "🔪", title: "Knife grip", body: "Pinch the blade, not the handle. Control lives in your fingers." },
  { icon: "🧂", title: "Season in layers", body: "A pinch at every stage builds depth." },
  { icon: "🔥", title: "Preheat the pan", body: "Cold pan, sticky food. Wait for the shimmer." },
  { icon: "⏲️", title: "Rest the protein", body: "5 minutes off heat keeps juices inside the steak." },
];

