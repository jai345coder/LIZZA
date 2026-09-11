import React, { useState, useEffect, useRef } from 'react';
import PageShell from '../components/PageShell.jsx';
import PizzaCard from '../components/PizzaCard.jsx';
import StickerBadge from '../components/StickerBadge.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import menuService from '../services/menuService.js';

/**
 * Page 2: Dashboard / Menu Continuous Storefront Page
 * Features responsive layout density with collapsible slide-over sidebars for screens < 1280px (xl).
 */
export default function DashboardPage({ onNavigate, user }) {
  const { cartItems, addToCart, updateQuantity, setCartItems, removeFromCart, estimatedTotal } = useCart();
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;
  const [backendMenu, setBackendMenu] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState('pizzas');

  useEffect(() => {
    async function loadInitialMenu() {
      try {
        setLoadingMenu(true);
        const data = await menuService.fetchMenu();
        if (Array.isArray(data)) {
          setBackendMenu(data);
        }
      } catch (err) {
        console.warn("Could not load backend menu:", err);
      } finally {
        setLoadingMenu(false);
      }
    }
    loadInitialMenu();
  }, []);

  const handleCategorySelect = async (catId) => {
    setActiveCategory(catId);
    try {
      setLoadingMenu(true);
      const categoryMap = {
        'pizzas': 'PIZZA',
        'sides': 'Sides',
        'drinks': 'DRINKS',
        'desserts': 'DESSERTS',
      };
      const catParam = categoryMap[catId] || catId.toUpperCase();
      const data = await menuService.getCategoryItems(catParam);
      if (Array.isArray(data) && data.length > 0) {
        setBackendMenu(data);
      }
    } catch (err) {
      console.warn("Could not load category items:", err);
    } finally {
      setLoadingMenu(false);
    }
  };

  const [sortOption, setSortOption] = useState('popular');
  const [expandedRows, setExpandedRows] = useState({});
  const [reviewCount, setReviewCount] = useState(4);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Search state for top category nav search input
  const [searchQuery, setSearchQuery] = useState('');

  // Single button minimize/expand state for YOUR BOX component
  const [isBoxOpen, setIsBoxOpen] = useState(false);

  // Drag state for moveable YOUR BOX component
  const [boxPos, setBoxPos] = useState(null);
  const [isDraggingBox, setIsDraggingBox] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Drinks side-view horizontal scroll ref & handler
  const drinksScrollRef = useRef(null);
  const scrollDrinks = (direction) => {
    if (drinksScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      drinksScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleBoxDragStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = document.getElementById('your-box-cart')?.getBoundingClientRect();
    if (rect) {
      dragOffsetRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
      setIsDraggingBox(true);
    }
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDraggingBox) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const newX = Math.max(10, Math.min(window.innerWidth - 330, clientX - dragOffsetRef.current.x));
      const newY = Math.max(70, Math.min(window.innerHeight - 200, clientY - dragOffsetRef.current.y));
      setBoxPos({ x: newX, y: newY });
    };

    const handleEnd = () => {
      if (isDraggingBox) setIsDraggingBox(false);
    };

    if (isDraggingBox) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingBox]);

  const categories = [
    { id: 'pizzas', label: 'Pizzas', icon: '🍕' },
    { id: 'chaos-grid', label: 'All Categories', icon: '⚡' },
    { id: 'sides', label: 'Sides & Dips', icon: '🍟' },
    { id: 'drinks', label: 'Drinks', icon: '🥤' },
    { id: 'reviews', label: 'Reviews', icon: '💬' },
  ];

  // 4-Column Grid Tile Items (matching image architecture in Neubrutalist Lizza style)
  const fullWidthGridItems = [
    {
      id: 301,
      title: 'Vegetables & Veggie Pies',
      price: 16.00,
      badge: 'FRESH 🥦',
      badgeVariant: 'lime',
      image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 302,
      title: 'Double Pep & Meat Chaos',
      price: 18.99,
      badge: 'NEW DROP 🔥',
      badgeVariant: 'orange',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 303,
      title: 'Munchies & Garlic Knots',
      price: 6.99,
      badge: 'MUST TRY 🍟',
      badgeVariant: 'yellow',
      image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 304,
      title: 'Cold Drinks & Juices',
      price: 2.50,
      badge: 'POP! 🥤',
      badgeVariant: 'pink',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 305,
      title: 'Instant Lab Pizzas',
      price: 19.00,
      badge: 'SPICY 🌶️',
      badgeVariant: 'pink',
      image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 306,
      title: 'Tea, Coffee & Shakes',
      price: 4.99,
      badge: 'THICK 🧋',
      badgeVariant: 'dark',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 307,
      title: 'Bakery & Truffle Fries',
      price: 7.50,
      badge: 'LUXE ✨',
      badgeVariant: 'lime',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 308,
      title: 'Sweet Tooth & Desserts',
      price: 5.99,
      badge: 'SWEET 🍩',
      badgeVariant: 'yellow',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 309,
      title: 'Dips, Sauces & Spreads',
      price: 2.00,
      badge: 'HOT HONEY 🍯',
      badgeVariant: 'yellow',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 310,
      title: 'Chicken, Wings & Ribs',
      price: 9.99,
      badge: 'CRUNCHY 🍗',
      badgeVariant: 'orange',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 311,
      title: 'Organic & Premium Luxe',
      price: 21.50,
      badge: 'PREMIUM 👑',
      badgeVariant: 'dark',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 312,
      title: 'Spicy AF Hot Honey',
      price: 19.99,
      badge: 'HOT AF 🌶️',
      badgeVariant: 'pink',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Pizza collections categorized for horizontal scroll rows
  const pizzaRows = [
    {
      id: 'popular',
      title: 'Popular Chaos 🔥',
      subtitle: 'Most ordered pies of the week',
      items: [
        {
          id: 1,
          name: 'THE CHAOS PEPPERONI',
          price: 18.99,
          description: 'Double pep, hot honey drizzle, chaotic crust, zero rules.',
          badgeText: 'NEW DROP 🔥',
          badgeVariant: 'lime',
          bgPattern: 'checkered',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 2,
          name: 'FIREBREATHER',
          price: 19.99,
          description: 'Spicy ground beef, jalapeños, hot chili crunch & habanero honey.',
          badgeText: 'SPICY AF 🌶️',
          badgeVariant: 'pink',
          bgPattern: 'pink',
          image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 3,
          name: 'CLASSIC MARGH',
          price: 16.00,
          description: 'Fresh basil, fior di latte mozzarella, slow roasted tomato sauce.',
          badgeText: 'OG VIBES 🧀',
          badgeVariant: 'yellow',
          bgPattern: 'solid',
          image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 4,
          name: 'TRUFFLE MONSTER',
          price: 21.50,
          description: 'Wild forest mushrooms, black truffle cream, thyme & parmesan.',
          badgeText: 'LUXE DROP ✨',
          badgeVariant: 'dark',
          bgPattern: 'purple',
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
        },
      ]
    },
    {
      id: 'new-drops',
      title: 'New Drops ✨',
      subtitle: 'Fresh out of the experimental lab',
      items: [
        {
          id: 5,
          name: 'BBQ CHICKEN CHAOS',
          price: 18.99,
          description: 'Smoky BBQ base, grilled chicken, red onions, cilantro crunch.',
          badgeText: 'NEW DROP 🔥',
          badgeVariant: 'lime',
          bgPattern: 'orange',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 6,
          name: 'TRUFFLE FLEX',
          price: 22.00,
          description: 'White sauce, truffle oil, porcini mushrooms, whipped ricotta.',
          badgeText: 'PREMIUM ✨',
          badgeVariant: 'dark',
          bgPattern: 'solid',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 7,
          name: 'MAC ATTACK',
          price: 18.00,
          description: 'Creamy mac & cheese, bacon bits, scallions, cheddar drizzle.',
          badgeText: 'CHEESY 🧀',
          badgeVariant: 'yellow',
          bgPattern: 'lime',
          image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 8,
          name: 'NASHVILLE HOT GIRL',
          price: 19.00,
          description: 'Hot chicken, pickles, slaw, secret spicy honey sauce.',
          badgeText: 'SPICY AF 🌶️',
          badgeVariant: 'pink',
          bgPattern: 'pink',
          image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 15,
          name: 'SMOKEY BACON BURST',
          price: 19.50,
          description: 'Applewood bacon, smoked gouda, crispy onions & maple drizzle.',
          badgeText: 'NEW DROP 🔥',
          badgeVariant: 'lime',
          bgPattern: 'orange',
          image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 16,
          name: 'PESTO BURRATA BOMB',
          price: 21.00,
          description: 'Fresh burrata, wild basil pesto, roasted cherry tomatoes & balsamic glaze.',
          badgeText: 'LUXE ✨',
          badgeVariant: 'dark',
          bgPattern: 'lime',
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 17,
          name: 'HOT HONEY HOTDOG PIE',
          price: 17.99,
          description: 'Sliced spicy sausage, hot honey drizzle, pickled jalapeños.',
          badgeText: 'HOT DROP 🍯',
          badgeVariant: 'yellow',
          bgPattern: 'checkered',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        },
      ]
    },
    {
      id: 'spicy',
      title: 'Spicy Picks 🌶️',
      subtitle: 'Heat levels that hit different',
      items: [
        {
          id: 9,
          name: 'BUFFALO RIZZ',
          price: 17.50,
          description: 'Spicy buffalo chicken, ranch drizzle, celery crunch.',
          badgeText: 'SPICY AF 🌶️',
          badgeVariant: 'pink',
          bgPattern: 'orange',
          image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 2,
          name: 'FIREBREATHER',
          price: 19.99,
          description: 'Spicy ground beef, jalapeños, hot chili crunch & habanero honey.',
          badgeText: 'SPICY AF 🌶️',
          badgeVariant: 'pink',
          bgPattern: 'pink',
          image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 8,
          name: 'NASHVILLE HOT GIRL',
          price: 19.00,
          description: 'Hot chicken, pickles, slaw, secret spicy honey sauce.',
          badgeText: 'SPICY AF 🌶️',
          badgeVariant: 'pink',
          bgPattern: 'pink',
          image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 1,
          name: 'THE CHAOS PEPPERONI',
          price: 18.99,
          description: 'Double pep, hot honey drizzle, chaotic crust, zero rules.',
          badgeText: 'HOT HONEY 🍯',
          badgeVariant: 'yellow',
          bgPattern: 'checkered',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 18,
          name: 'VOLCANO HABANERO',
          price: 20.50,
          description: 'Fiery habanero sauce, spicy chorizo, serrano peppers & jack cheese.',
          badgeText: 'EXTREME HEAT 🔥',
          badgeVariant: 'pink',
          bgPattern: 'pink',
          image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 19,
          name: 'GHOST PEPPER MONSTER',
          price: 21.99,
          description: 'Ghost pepper infused marinara, spicy salami & chili flakes.',
          badgeText: 'GHOST HEAT 👻',
          badgeVariant: 'dark',
          bgPattern: 'orange',
          image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 20,
          name: 'CHILI CRUNCH PEPPERONI',
          price: 19.50,
          description: 'Crispy pepperoni overload coated in garlic chili crisp oil.',
          badgeText: 'CRUNCHY SPICY 🌶️',
          badgeVariant: 'pink',
          bgPattern: 'checkered',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        },
      ]
    },
    {
      id: 'veggie',
      title: 'Veggie Chaos 🥦',
      subtitle: 'Plant-based certified bangers',
      items: [
        {
          id: 10,
          name: 'VEGGIE VIBES ONLY',
          price: 16.00,
          description: 'Roasted peppers, zucchini, spinach, feta & garlic confit.',
          badgeText: 'VEGGIE 🥦',
          badgeVariant: 'lime',
          bgPattern: 'solid',
          image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 3,
          name: 'CLASSIC MARGH',
          price: 16.00,
          description: 'Fresh basil, fior di latte mozzarella, slow roasted tomato sauce.',
          badgeText: 'OG VIBES 🧀',
          badgeVariant: 'yellow',
          bgPattern: 'solid',
          image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 4,
          name: 'TRUFFLE MONSTER',
          price: 21.50,
          description: 'Wild forest mushrooms, black truffle cream, thyme & parmesan.',
          badgeText: 'LUXE DROP ✨',
          badgeVariant: 'dark',
          bgPattern: 'purple',
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 11,
          name: 'PESTO PARADISE',
          price: 17.50,
          description: 'Basil pesto base, sun-dried tomatoes, pine nuts & goat cheese.',
          badgeText: 'FRESH 🌿',
          badgeVariant: 'lime',
          bgPattern: 'teal',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 5,
          name: 'BBQ CHICKEN CHAOS',
          price: 18.99,
          description: 'Smoky BBQ base, grilled chicken, red onions, cilantro crunch.',
          badgeText: 'NEW DROP 🔥',
          badgeVariant: 'lime',
          bgPattern: 'orange',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 6,
          name: 'TRUFFLE FLEX',
          price: 22.00,
          description: 'White sauce, truffle oil, porcini mushrooms, whipped ricotta.',
          badgeText: 'PREMIUM ✨',
          badgeVariant: 'dark',
          bgPattern: 'solid',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        }
      ]
    }
  ];

  // Sides & Dips items
  const sidesItems = [
    {
      id: 201,
      name: 'GARLIC BOMB KNOTS',
      price: 6.99,
      description: 'Garlic butter soaked dough knots with marinara dunk.',
      badgeText: 'MUST TRY 🔥',
      badgeVariant: 'orange',
      bgPattern: 'solid',
      image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 202,
      name: 'SPICY BUFFALO WINGS',
      price: 9.99,
      description: 'Crispy fried wings tossed in signature hot sauce.',
      badgeText: 'SPICY AF 🌶️',
      badgeVariant: 'pink',
      bgPattern: 'pink',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 203,
      name: 'TRUFFLE PARM FRIES',
      price: 7.50,
      description: 'Hand-cut fries, truffle oil, aged parmesan & parsley.',
      badgeText: 'LUXE ✨',
      badgeVariant: 'dark',
      bgPattern: 'purple',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 204,
      name: 'HOT HONEY DIP',
      price: 2.00,
      description: 'Chili infused wild wildflower honey.',
      badgeText: 'SWEET 🍯',
      badgeVariant: 'yellow',
      bgPattern: 'lime',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 205,
      name: 'CHEESY CHAOS DIP',
      price: 2.50,
      description: 'Warm melted queso with jalapeno bits.',
      badgeText: 'CHEESY 🧀',
      badgeVariant: 'yellow',
      bgPattern: 'orange',
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Drinks items with ribbon badges
  const drinkItems = [
    {
      id: '6a7740380974d70a1248f925',
      _id: '6a7740380974d70a1248f925',
      name: 'LIZZA POP',
      price: 2.50,
      description: 'Craft fizzy citrus soda with a sharp punch.',
      ribbonBadge: 'POP!',
      badgeVariant: 'pink',
      bgPattern: 'orange',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '6a7740380974d70a1248f927',
      _id: '6a7740380974d70a1248f927',
      name: 'BRAIN ROT BERRY',
      price: 5.99,
      description: 'Wild berry slush with sour pop rocks.',
      ribbonBadge: 'WILD',
      badgeVariant: 'pink',
      bgPattern: 'purple',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '6a7740380974d70a1248f929',
      _id: '6a7740380974d70a1248f929',
      name: 'FIT CHECK ENERGY',
      price: 4.50,
      description: 'Electrifying citrus energy brew for nocturnal coders.',
      ribbonBadge: 'CHILL',
      badgeVariant: 'lime',
      bgPattern: 'lime',
      image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '6a7740380974d70a1248f92b',
      _id: '6a7740380974d70a1248f92b',
      name: 'ICE COLD TEA',
      price: 3.25,
      description: 'Peach infused iced tea with mint leaf refresh.',
      ribbonBadge: 'CHILL',
      badgeVariant: 'white',
      bgPattern: 'solid',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '6a7740380974d70a1248f92d',
      _id: '6a7740380974d70a1248f92d',
      name: 'CHERRY BOMB',
      price: 2.50,
      description: 'Explosive dark cherry cola fizz.',
      ribbonBadge: 'BOOM',
      badgeVariant: 'pink',
      bgPattern: 'pink',
      image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '6a7740380974d70a1248f92f',
      _id: '6a7740380974d70a1248f92f',
      name: 'PURE H2O',
      price: 1.99,
      description: 'Crisp electrolyte mineral mountain water.',
      ribbonBadge: 'CHILL',
      badgeVariant: 'white',
      bgPattern: 'teal',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '6a7740380974d70a1248f931',
      _id: '6a7740380974d70a1248f931',
      name: 'CHOCO-BLAST',
      price: 4.99,
      description: 'Double fudge thick milkshake with whipped cream.',
      ribbonBadge: 'THICK',
      badgeVariant: 'dark',
      bgPattern: 'orange',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Reviews Data
  const reviewItems = [
    {
      id: 1,
      author: '@pizzaenjoyer55',
      time: '2 hours ago',
      content: 'no cap this pizza ate 🔥',
      stars: 5,
      badge: 'VERIFIED',
      badgeIcon: '✓',
      cardColor: 'bg-white',
      textColor: 'text-[#1E1E1E]',
      reaction: '1.2k ❤️',
      tilt: 'rotate-[-1deg]',
    },
    {
      id: 2,
      author: '@crust_king',
      time: 'Yesterday',
      content: 'the crust said trust 💀',
      stars: 5,
      badge: 'TOP FAN',
      badgeIcon: '🏆',
      cardColor: 'bg-[#FF6B35]',
      textColor: 'text-white',
      tilt: 'rotate-[2deg]',
    },
    {
      id: 3,
      author: '@rizz_master',
      time: '3 days ago',
      content: '10/10 would rizz my crust again 😭',
      stars: 5,
      badge: null,
      cardColor: 'bg-white',
      textColor: 'text-[#1E1E1E]',
      reaction: '1.2k ❤️',
      tilt: 'rotate-[-2deg]',
    },
    {
      id: 4,
      author: '@lizza_stan',
      time: 'Last week',
      content: 'this slapped harder than my alarm clock 🍕',
      stars: 5,
      badge: 'LEGIT',
      badgeIcon: '⚙️',
      cardColor: 'bg-white',
      textColor: 'text-[#FF2E93]',
      tilt: 'rotate-[1deg]',
    },
    {
      id: 5,
      author: '@dough_god',
      time: '5 days ago',
      content: 'hot honey + double pep is literally therapeutic',
      stars: 5,
      badge: 'SPICY FAN',
      badgeIcon: '🌶️',
      cardColor: 'bg-[#FF2E93]',
      textColor: 'text-white',
      tilt: 'rotate-[-1.5deg]',
    },
    {
      id: 6,
      author: '@truffle_queen',
      time: '2 weeks ago',
      content: 'truffle monster changed my life standard completely',
      stars: 5,
      badge: 'LUXE',
      badgeIcon: '✨',
      cardColor: 'bg-[#CCFF00]',
      textColor: 'text-[#1E1E1E]',
      tilt: 'rotate-[1.5deg]',
    },
  ];

  // Cart operations
  const handleAddToCart = (itemToAdd) => {
    addToCart(itemToAdd);
    setCartDrawerOpen(false);
    setIsBoxOpen(true);
  };

  const handleUpdateQty = (target, delta) => {
    const index = typeof target === 'number'
      ? target
      : cartItems.findIndex((i) => (i.id || i._id || i.itemId) === target);

    if (index > -1) {
      const item = cartItems[index];
      const currentQty = item.quantity || item.qty || 1;
      updateQuantity(index, currentQty + delta);
    }
  };

  const handleRemoveFromCart = (target) => {
    const index = typeof target === 'number'
      ? target
      : cartItems.findIndex((i) => (i.id || i._id || i.itemId) === target);

    if (index > -1) {
      removeFromCart(index);
    }
  };

  const subtotal = estimatedTotal !== undefined && estimatedTotal !== null
    ? estimatedTotal
    : cartItems.reduce(
        (sum, item) => sum + (item.price || item.unitPrice || 0) * (item.quantity || item.qty || 1),
        0
      );

  // Smooth scroll handler for categories
  const scrollToSection = (sectionId) => {
    setActiveCategory(sectionId);
    setLeftDrawerOpen(false);
    const elem = document.getElementById(sectionId);
    if (elem) {
      const yOffset = -90;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // IntersectionObserver to auto-highlight active section while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['pizzas', 'chaos-grid', 'sides', 'drinks', 'reviews'];
      const scrollPos = window.scrollY + 180;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const elem = document.getElementById(sectionIds[i]);
        if (elem && elem.offsetTop <= scrollPos) {
          setActiveCategory(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleRowView = (rowId) => {
    setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  return (
    <PageShell activeTab="menu" onNavigate={onNavigate} cartCount={cartItems.reduce((a, b) => a + b.qty, 0)}>
      <div className="max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

        {/* ================= STICKY CATEGORY SECTION DIRECTLY BELOW NAV WITH SEARCH ================= */}
        <div className="sticky top-[65px] z-30 bg-[#FFF5F0]/95 backdrop-blur-md py-3 px-3 sm:px-6 mb-6 border-b-3 border-[#1E1E1E] shadow-md flex items-center justify-between gap-3 overflow-x-auto no-scrollbar rounded-2xl neo-border">
          <div className="flex items-center gap-2.5 px-1 shrink-0">
            <button
              onClick={() => setLeftDrawerOpen(true)}
              className="neo-btn px-3 py-2 bg-[#FF6B35] text-white font-heading font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>⚡ MENU</span>
            </button>

            {/* Integrated Search Input Box */}
            <div className="relative flex items-center shrink-0">
              <span className="absolute left-3 text-xs pointer-events-none">🔍</span>
              <input
                type="text"
                placeholder="Search pizzas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="neo-border bg-white pl-8 pr-7 py-2 rounded-xl text-xs font-heading font-extrabold text-[#1E1E1E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] w-36 sm:w-52 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-xs font-black text-gray-400 hover:text-black cursor-pointer px-1"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className={`neo-btn px-3.5 py-2 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#CCFF00] text-[#1E1E1E] scale-105 neo-border shadow-sm'
                    : 'bg-white text-[#1E1E1E] hover:bg-gray-100 neo-border'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setCartDrawerOpen(true);
              setIsBoxOpen((prev) => !prev);
            }}
            className="neo-btn px-3.5 py-2 bg-[#FF2E93] text-white font-heading font-black text-xs uppercase rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>🛍️ YOUR BOX</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-white font-black">${subtotal.toFixed(2)}</span>
          </button>
        </div>
        
        {/* ================= 1. MAIN STOREFRONT LAYOUT ================= */}
        <div className="grid grid-cols-1 w-full gap-6 items-start relative">
          
          {/* CENTER MAIN FEED (Spans full 100% width) */}
          <main className="w-full space-y-10 sm:space-y-12 transition-all">

            {/* TOP GEN-Z INFINITE MARQUEE STRIP WITH COMIC STICKERS & BIG CAPITAL TEXT */}
            {/* <div className="w-full overflow-hidden bg-[#CCFF00] border-y-3.5 border-[#1E1E1E] py-4 sm:py-5 my-3 shadow-[5px_5px_0px_#1E1E1E] relative select-none rounded-2xl">
              <div className="animate-marquee flex items-center gap-8 sm:gap-10 whitespace-nowrap">
                {[1, 2].map((loopIdx) => (
                  <div key={loopIdx} className="flex items-center gap-8 sm:gap-10 shrink-0">
                    <span className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-[#1E1E1E] uppercase tracking-tight">
                      🍕 NO CAP BEST PIZZA IN TOWN
                    </span>
                    <div className="flex items-center gap-2 bg-[#FF2E93] text-white px-4 py-2 rounded-2xl neo-border font-heading font-black text-sm sm:text-base uppercase tracking-widest rotate-[-2deg] shadow-[3px_3px_0px_#1E1E1E]">
                      <span>💥 SLAPS HARDER THAN YOUR EX</span>
                    </div>
                    <span className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-[#FF2E93] uppercase tracking-tight">
                      ⚡ MAIN CHARACTER ENERGY
                    </span>
                    <span className="text-2xl sm:text-3xl">🌶️</span>
                    <div className="flex items-center gap-1.5 bg-white text-[#1E1E1E] px-4 py-2 rounded-2xl neo-border font-heading font-black text-sm sm:text-base uppercase tracking-wider rotate-[-1deg] shadow-[3px_3px_0px_#1E1E1E]">
                      <span>🧀 CHEESY AF & HOT HONEY 🍯</span>
                    </div>
                    <span className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-[#1E1E1E] uppercase tracking-tight">
                      🔥 100% CHAOS APPROVED
                    </span>
                    <span className="text-2xl sm:text-3xl">🤤</span>
                    <div className="flex items-center gap-1.5 bg-[#FFE600] text-[#1E1E1E] px-4 py-2 rounded-2xl neo-border font-heading font-black text-sm sm:text-base uppercase tracking-wider rotate-[-3deg] shadow-[3px_3px_0px_#1E1E1E]">
                      <span>👑 ZERO MID PIZZAS HERE</span>
                    </div>
                    <span className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-[#FF2E93] uppercase tracking-tight">
                      🎯 ITS GIVING DELICIOUS
                    </span>
                    <span className="text-2xl sm:text-3xl">🤯</span>
                  </div>
                ))}
              </div>
            </div> */}

            {/* HERO STOREFRONT BANNER & SEARCH */}
            <div className="bg-orange-500 neo-card p-4 sm:p-6 space-y-4 relative overflow-hidden border-3 border-[#1E1E1E]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StickerBadge text="STOREFRONT" variant="pink" size="sm" />
                    <StickerBadge text="HOT & FRESH 🍕" variant="lime" size="sm" />
                  </div>
                  <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#1E1E1E] uppercase tracking-tight leading-none">
                    {currentUser ? `WELCOME BACK, ${(currentUser.name || currentUser.username || currentUser.email?.split('@')[0])?.toUpperCase()}! 👋` : 'THE CHAOS STORE'}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-white mt-1">
                    {currentUser ? 'Ready to fuel your pizza cravings today? Check out fresh drops below.' : 'Scroll down for Pizzas, Categories Grid, Sides, Drinks, and Fan Reviews.'}
                  </p>
                </div>

                {/* Sort Option */}
                <div className="flex items-center gap-2 neo-border rounded-xl px-3 py-2 bg-white self-stretch sm:self-auto justify-between sm:justify-start">
                  <span className="text-xs">🎛️</span>
                  <label className="text-[11px] font-heading font-extrabold uppercase text-[#1E1E1E]">
                    Sort:
                  </label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-transparent font-heading font-bold text-xs uppercase focus:outline-none cursor-pointer"
                  >
                    <option value="popular">Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="spicy">Spicy AF</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PIZZAS SECTION - CAPTURES SCREEN SIDES CLEANLY WITH NO RED BACKGROUND */}
            <section id="pizzas" className="space-y-8 scroll-mt-28 bg-white/80 neo-border p-4 sm:p-6 rounded-2xl shadow-sm w-full">
              <div className="flex items-center justify-between border-b-3 border-[#1E1E1E] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl">🍕</span>
                    <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#1E1E1E] uppercase tracking-tight">
                      CHAOS PIZZAS
                    </h2>
                  </div>
                  <p className="text-xs font-extrabold text-gray-500 uppercase mt-0.5">
                    Option B: Horizontal Snap Scroll Category Rows
                  </p>
                </div>
                <StickerBadge text="FRESH DOUGH" variant="yellow" size="sm" />
              </div>

              {/* Horizontal Scroll Category Rows */}
              {(() => {
                const formattedBackendItems = (backendMenu || []).map((item) => ({
                  _id: item._id,
                  id: item._id,
                  name: item.name,
                  price: item.basePrice || item.price || 0,
                  description: item.description || 'Handcrafted item from inventory database.',
                  badgeText: item.isAvailable ? 'LIVE DB 📦' : 'OUT OF STOCK 🛑',
                  badgeVariant: 'lime',
                  bgPattern: 'checkered',
                  image: item.image || item.img || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
                }));

                // Build a lookup map of backend items by name
                const backendMap = new Map();
                (backendMenu || []).forEach((bItem) => {
                  if (bItem.name && bItem._id) {
                    backendMap.set(bItem.name.toLowerCase().trim(), bItem._id);
                  }
                });

                // Function to ensure any item has a valid 24-char hex ObjectId
                const sanitizeItem = (it) => {
                  const matchedDbId = backendMap.get((it.name || '').toLowerCase().trim());
                  const validId = matchedDbId || (typeof it.id === 'string' && it.id.length === 24 ? it.id : `60d5ec49f1d2c80015f8a${String(it.id).padStart(4, '0')}`);
                  return {
                    ...it,
                    _id: validId,
                    id: validId,
                  };
                };

                const sanitizedPizzaRows = pizzaRows.map((row) => ({
                  ...row,
                  items: row.items.map(sanitizeItem),
                }));

                const dbRow = formattedBackendItems.length > 0 ? [{
                  id: 'db-items',
                  title: 'Database Inventory Drops 📦',
                  subtitle: 'Live menu items synced from MongoDB',
                  items: formattedBackendItems,
                }] : [];

                const allRows = [...dbRow, ...sanitizedPizzaRows];
                const activeRows = searchQuery
                  ? allRows
                      .map((row) => ({
                        ...row,
                        items: row.items.filter(
                          (item) =>
                            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase())
                        ),
                      }))
                      .filter((row) => row.items.length > 0)
                  : allRows;

                return activeRows.map((row) => {
                  const isExpanded = expandedRows[row.id];
                  return (
                    <div key={row.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-heading font-black text-lg sm:text-xl text-[#1E1E1E] uppercase tracking-tight">
                            {row.title}
                          </h3>
                          <p className="text-xs text-gray-500 font-semibold">{row.subtitle}</p>
                        </div>
                        <button
                          onClick={() => toggleRowView(row.id)}
                          className="font-heading font-extrabold text-xs text-[#FF6B35] hover:underline uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? '← Row View' : 'See All →'}</span>
                        </button>
                      </div>

                      {/* Horizontal Scroll Row or Grid View */}
                      <div
                        className={
                          isExpanded
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                            : 'flex gap-4 sm:gap-5 overflow-x-auto scroll  snap-x snap-mandatory py-3 px-2 -mx-2 rounded-xl scroll-smooth  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-orange-50 [&::-webkit-scrollbar-thumb]:bg-orange-800/30 [&::-webkit-scrollbar-thumb]:rounded-[20px] [&::-webkit-scrollbar-thumb]:border [&::-webkit-scrollbar-thumb]:border-none'
                        }
                      >
                        {row.items.map((pizza, idx) => (
                          <PizzaCard
                            key={`${row.id}-${pizza._id || pizza.id || idx}-${idx}`}
                            {...pizza}
                            fixedWidth={!isExpanded}
                            onAdd={() => handleAddToCart(pizza)}
                            onCustomize={() => onNavigate && onNavigate('builder')}
                          />
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}

              {/* TALL HIGH-IMPACT MIDDLE GEN-Z MARQUEE STRIP WITH BIG CAPITAL BLACK & PINK TEXT */}
              <div className="w-full overflow-hidden bg-[#CCFF00] border-y-4 border-[#1E1E1E] py-5 sm:py-6 my-8 shadow-[6px_6px_0px_#1E1E1E] relative select-none rounded-2xl">
                <div className="animate-marquee flex items-center gap-8 sm:gap-12 whitespace-nowrap">
                  {[1, 2].map((loopIdx) => (
                    <div key={loopIdx} className="flex items-center gap-8 sm:gap-12 shrink-0">
                      <span className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#1E1E1E] uppercase tracking-tight drop-shadow-[2px_2px_0px_#FFF]">
                        🍕 CHAOS PIZZA CO.
                      </span>
                      <div className="bg-pink-500 text-white px-4.5 py-2.5 rounded-2xl neo-border-thick font-heading font-black text-lg sm:text-2xl uppercase tracking-widest rotate-[-3deg] shadow-[4px_4px_0px_#1E1E1E]">
                        🔥 NO CAP THE COOLEST PIZZA DROPS
                      </div>
                      <span className="text-3xl sm:text-4xl">💥</span>
                      <span className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight drop-shadow-[3px_3px_0px_#1E1E1E]">
                        MAIN CHARACTER FLAVORS ONLY ⚡
                      </span>
                      <div className="bg-white text-[#FF2E93] px-4.5 py-2.5 rounded-2xl neo-border-thick font-heading font-black text-lg sm:text-2xl uppercase tracking-widest rotate-[3deg] shadow-[4px_4px_0px_#1E1E1E]">
                        🧀 100% UNFILTERED DELICIOUSNESS
                      </div>
                      <span className="text-3xl sm:text-4xl">🌶️</span>
                      <span className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#1E1E1E] uppercase tracking-tight drop-shadow-[2px_2px_0px_#CCFF00]">
                        SLAPS HARDER THAN ANYTHING ELSE 🚀
                      </span>
                      <div className="bg-[#FFE600] text-[#1E1E1E] px-4.5 py-2.5 rounded-2xl neo-border-thick font-heading font-black text-lg sm:text-2xl uppercase tracking-widest rotate-[-2deg] shadow-[4px_4px_0px_#1E1E1E]">
                        👑 SERVED PIPING HOT 24/7 ✨
                      </div>
                      <span className="text-3xl sm:text-4xl">🤯</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DRINK CARDS HORIZONTAL SCROLL SIDE VIEW SECTION */}
              <div id="drinks" className="space-y-4 pt-6 border-t-2.5 border-[#1E1E1E] mt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-black text-2xl text-[#1E1E1E] uppercase tracking-tight">
                        ICE COLD DRINKS & SHAKES 🥤
                      </h3>
                      <StickerBadge text="REFRESH" variant="pink" size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 font-bold">Use left and right buttons to scroll through cold beverages</p>
                  </div>

                  {/* Scroll Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollDrinks('left')}
                      className="neo-btn w-10 h-10 rounded-xl bg-white text-[#1E1E1E] font-heading font-black text-base flex items-center justify-center cursor-pointer hover:bg-gray-100"
                      title="Scroll Left"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() => scrollDrinks('right')}
                      className="neo-btn w-10 h-10 rounded-xl bg-[#FF6B35] text-white font-heading font-black text-base flex items-center justify-center cursor-pointer hover:bg-[#ff5a22]"
                      title="Scroll Right"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* Side View Drink Cards Track */}
                <div
                  ref={drinksScrollRef}
                  className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-3 px-2 -mx-2 rounded-2xl scroll-smooth"
                >
                  {drinkItems.map((drink) => (
                    <div
                      key={drink.id}
                      className="min-w-[260px] max-w-[280px] snap-start bg-white neo-card p-4 flex flex-col justify-between space-y-3 hover:neo-shadow-lg transition-all"
                    >
                      <div className="relative h-36 rounded-xl overflow-hidden neo-border">
                        <img
                          src={drink.image}
                          alt={drink.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 right-2">
                          <StickerBadge text={drink.ribbonBadge || 'COLD'} variant={drink.badgeVariant || 'pink'} size="sm" />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-heading font-black text-base text-[#1E1E1E] uppercase">
                          {drink.name}
                        </h4>
                        <p className="text-xs font-medium text-gray-500 line-clamp-2 mt-0.5">
                          {drink.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t-2 border-gray-100">
                        <span className="font-heading font-black text-lg text-[#FF6B35]">
                          ${drink.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart({ itemId: drink._id || drink.id, _id: drink._id || drink.id, name: drink.name, price: drink.price, quantity: 1 })}
                          className="neo-btn py-1.5 px-3 bg-[#CCFF00] text-[#1E1E1E] font-heading font-black text-xs uppercase rounded-xl cursor-pointer"
                        >
                          + ADD 🥤
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>

          {/* SINGLE FLOATING BUTTON OR MOVEABLE YOUR BOX CART COMPONENT */}
          {!isBoxOpen ? (
            <button
              onClick={() => setIsBoxOpen(true)}
              className="fixed bottom-6 right-4 sm:right-6 z-50 neo-btn bg-[#FF6B35] text-white px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xl border-3 border-[#1E1E1E] cursor-pointer hover:scale-105 active:scale-95 transition-all"
              title="Click to open Your Box"
            >
              <span className="text-xl">🛍️</span>
              <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-wider">YOUR BOX</span>
              <StickerBadge text={`${cartItems.reduce((a, b) => a + (b.quantity || b.qty || 1), 0)} ITEMS`} variant="lime" size="sm" />
              <span className="font-heading font-black text-xs bg-white/20 px-2 py-0.5 rounded-lg">
                ${subtotal.toFixed(2)}
              </span>
            </button>
          ) : (
            <aside
              id="your-box-cart"
              style={
                boxPos
                  ? {
                      position: 'fixed',
                      left: `${boxPos.x}px`,
                      top: `${boxPos.y}px`,
                      zIndex: 50,
                      width: '320px',
                    }
                  : undefined
              }
              className={`${
                boxPos ? 'shadow-2xl scale-[1.02]' : 'fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[330px]'
              } neo-card bg-white p-4 sm:p-5 space-y-3.5 shadow-2xl border-3 border-[#1E1E1E] transition-all`}
            >
              <div
                onMouseDown={handleBoxDragStart}
                onTouchStart={handleBoxDragStart}
                className={`flex items-center justify-between border-b-2.5 border-[#1E1E1E] pb-2.5 bg-[#FF6B35] text-white -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 p-3.5 sm:p-4 rounded-t-[14px] select-none ${
                  isDraggingBox ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                title="Click & drag header to move Your Box anywhere!"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">✋</span>
                  <div>
                    <h2 className="font-heading font-black text-base sm:text-lg uppercase tracking-wider flex items-center gap-1.5">
                      <span>YOUR BOX</span>
                      <span className="text-[9px] font-extrabold bg-black/25 px-1.5 py-0.5 rounded text-[#CCFF00]">
                        MOVEABLE
                      </span>
                    </h2>
                    <span className="text-[9px] font-bold opacity-80 block -mt-0.5">Drag header to move</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {boxPos && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBoxPos(null);
                      }}
                      className="text-[10px] bg-white/20 hover:bg-white/40 px-2 py-0.5 rounded text-white font-extrabold uppercase cursor-pointer"
                      title="Reset to bottom corner"
                    >
                      Reset
                    </button>
                  )}
                  <StickerBadge text={`${cartItems.reduce((a, b) => a + (b.quantity || b.qty || 1), 0)}`} variant="lime" size="sm" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBoxOpen(false);
                    }}
                    className="w-6 h-6 bg-white/20 hover:bg-white/40 text-white rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer ml-1"
                    title="Minimize to button"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Cart Item List */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 space-y-1.5">
                    <span className="text-2xl block">📦</span>
                    <p className="font-heading font-bold text-xs uppercase">Your box is empty!</p>
                    <p className="text-[10px] text-gray-400">Add pizzas, drinks, or sides below.</p>
                  </div>
                ) : (
                  cartItems.map((item, idx) => {
                    const unitPrice = item.price !== undefined ? item.price : item.unitPrice || 0;
                    const qty = item.quantity || item.qty || 1;
                    return (
                      <div
                        key={item._id || item.itemId || item.id || idx}
                        className="p-2.5 bg-[#FFF5F0] neo-border rounded-xl space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-heading font-extrabold text-xs uppercase text-[#1E1E1E] leading-tight">
                              {item.name || 'Pizza Item'}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1 mt-1">
                              {item.size && (
                                <span className="bg-[#CCFF00] text-[#1E1E1E] px-1.5 py-0.2 rounded text-[9px] font-black uppercase neo-border">
                                  {item.size}
                                </span>
                              )}
                              {item.crust && (
                                <span className="text-[9px] font-bold text-gray-600">
                                  {item.crust}
                                </span>
                              )}
                            </div>
                            {Array.isArray(item.toppings) && item.toppings.length > 0 && (
                              <div className="text-[9px] font-bold text-[#FF6B35] mt-0.5 line-clamp-1">
                                + {item.toppings.join(', ')}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(idx)}
                            className="text-gray-400 hover:text-red-500 font-bold text-xs px-1 cursor-pointer"
                            title="Remove item"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                          {/* Qty Controls */}
                          <div className="flex items-center gap-1 bg-white neo-border px-1.5 py-0.5 rounded-lg">
                            <button
                              onClick={() => handleUpdateQty(idx, -1)}
                              className="font-black text-xs text-[#FF6B35] hover:text-black cursor-pointer px-1"
                            >
                              -
                            </button>
                            <span className="font-heading font-extrabold text-xs text-[#1E1E1E] min-w-[12px] text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(idx, 1)}
                              className="font-black text-xs text-[#FF6B35] hover:text-black cursor-pointer px-1"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-400 block">${unitPrice.toFixed(2)} ea</span>
                            <span className="font-heading font-extrabold text-xs text-[#FF6B35]">
                              ${(unitPrice * qty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Subtotal & Checkout CTA */}
              <div className="pt-2.5 border-t-2 border-[#1E1E1E] space-y-2.5">
                <div className="flex items-center justify-between font-heading font-black text-xs sm:text-sm uppercase">
                  <span>Subtotal</span>
                  <span className="text-[#FF6B35] text-base sm:text-lg">${subtotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => onNavigate && onNavigate('summary')}
                  disabled={cartItems.length === 0}
                  className="w-full neo-btn py-3 px-4 bg-[#FF6B35] hover:bg-[#ff5a22] text-white font-heading font-black text-xs sm:text-sm uppercase tracking-widest rounded-xl disabled:opacity-50 cursor-pointer text-center"
                >
                  CHECKOUT →
                </button>

                <p className="text-[9px] font-bold text-center text-gray-500 uppercase">
                  ⚡ Free delivery on orders $25+
                </p>
              </div>
            </aside>
          )}

        </div>

        {/* ================= 2. FULL-WIDTH 4-COLUMN CHAOS CATEGORY GRID SECTION ================= */}
        <section
          id="chaos-grid"
          className="w-full relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-4 sm:px-8 lg:px-12 py-10 sm:py-12 bg-[#FFF0E8] border-y-3 border-[#1E1E1E] my-12 scroll-mt-24 shadow-inner"
        >
          <div className="max-w-[1560px] mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-3 border-[#1E1E1E] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StickerBadge text="FULL MENU GRID" variant="pink" rotate="left" size="sm" />
                  <StickerBadge text="QUICK CRAVINGS ⚡" variant="lime" rotate="right" size="sm" />
                </div>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#1E1E1E] uppercase tracking-tight">
                  EXPLORE ALL CHAOS CATEGORIES
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
                  Full width 4-column tile architecture • Click any item to add to Your Box
                </p>
              </div>
              <StickerBadge text="100% FRESH" variant="yellow" rotate="none" size="md" />
            </div>

            {/* 4-COLUMN RESPONSIVE TILE GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {fullWidthGridItems.map((item) => (
                <div
                  key={item.id}
                  className="neo-card bg-white p-3.5 sm:p-4 flex flex-col justify-between group hover:-translate-y-1.5 transition-all hover:neo-shadow-lg"
                >
                  {/* Top Image Container */}
                  <div className="relative h-36 sm:h-44 w-full neo-border bg-[#FFF5F0] rounded-xl flex items-center justify-center p-3 overflow-hidden bg-[radial-gradient(#FF6B35_1px,transparent_1px)] [background-size:12px_12px]">
                    {item.badge && (
                      <div className="absolute top-2 left-2 z-10 pointer-events-none">
                        <StickerBadge text={item.badge} variant={item.badgeVariant} rotate="left" size="sm" />
                      </div>
                    )}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)] group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Price Below Image */}
                  <div className="mt-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#1E1E1E] uppercase tracking-tight leading-snug group-hover:text-[#FF6B35] transition-colors">
                        {item.title}
                      </h3>
                      <span className="font-heading font-black text-sm sm:text-base text-[#FF6B35] block mt-0.5">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={() => handleAddToCart({ id: item.id, name: item.title, price: item.price })}
                      className="w-full neo-btn py-2 px-3 bg-[#FF6B35] hover:bg-[#ff5a22] text-white font-heading font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5"
                    >
                      <span>ADD</span>
                      <span className="text-base leading-none">+</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 3. REMAINING SECTIONS (SIDES, DRINKS, REVIEWS, FOOTER) ================= */}
        <div className="space-y-12">

          {/* SIDES & DIPS SECTION */}
          <section id="sides" className="space-y-6 scroll-mt-24 pt-4 border-t-3 border-[#1E1E1E]">
            <div className="flex items-center justify-between border-b-3 border-[#1E1E1E] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">🍟</span>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#1E1E1E] uppercase tracking-tight">
                    SIDES & DIPS
                  </h2>
                </div>
                <p className="text-xs font-extrabold text-gray-500 uppercase mt-0.5">
                  Loaded crust knots, crispy wings & dunk sauces
                </p>
              </div>
              <StickerBadge text="CRUNCHY" variant="lime" size="sm" />
            </div>

            {/* Horizontal Scroll Row for Sides */}
            <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 px-1 -mx-1">
              {sidesItems.map((side) => (
                <PizzaCard
                  key={side.id}
                  {...side}
                  fixedWidth={true}
                  onAdd={() => handleAddToCart(side)}
                />
              ))}
            </div>
          </section>

          {/* DRINKS SECTION ("THIRST TRAPS 🥤") */}
          <section id="drinks" className="space-y-6 scroll-mt-24 pt-4 border-t-3 border-[#1E1E1E]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-[#1E1E1E] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">🥤</span>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#1E1E1E] uppercase tracking-tight">
                    THIRST TRAPS 🥤
                  </h2>
                </div>
                <p className="text-xs font-extrabold text-gray-500 uppercase mt-0.5">
                  Liquid chaos to wash it down.
                </p>
              </div>

              {/* Badge Ribbons Bar */}
              <div className="flex flex-wrap gap-1.5">
                <StickerBadge text="POP!" variant="pink" rotate="left" size="sm" />
                <StickerBadge text="WILD" variant="lime" rotate="right" size="sm" />
                <StickerBadge text="CHILL" variant="yellow" rotate="slightLeft" size="sm" />
                <StickerBadge text="BOOM" variant="orange" rotate="slightRight" size="sm" />
                <StickerBadge text="THICK" variant="dark" rotate="left" size="sm" />
              </div>
            </div>

            {/* Drinks Grid / Horizontal Scroll Row */}
            <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 px-1 -mx-1">
              {drinkItems.map((drink) => (
                <div
                  key={drink.id}
                  className="w-[260px] sm:w-[285px] flex-shrink-0 snap-start neo-card bg-white flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 transition-transform"
                >
                  {/* Media Header */}
                  <div className="relative h-48 border-b-2.5 border-[#1E1E1E] flex items-center justify-center p-3 bg-[radial-gradient(#FF2E93_1px,transparent_1px)] [background-size:12px_12px] bg-[#FFF0F5]">
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <StickerBadge
                        text={drink.ribbonBadge}
                        variant={drink.badgeVariant}
                        rotate="left"
                        size="sm"
                      />
                    </div>

                    <img
                      src={drink.image}
                      alt={drink.name}
                      className="max-h-full max-w-full object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)] group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Drink Details */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1E1E1E] uppercase leading-tight">
                          {drink.name}
                        </h3>
                        <span className="font-heading font-black text-base sm:text-lg text-[#FF6B35] whitespace-nowrap">
                          ${drink.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium line-clamp-2 leading-relaxed min-h-[32px]">
                        {drink.description}
                      </p>
                    </div>

                    {/* ADD Button */}
                    <button
                      onClick={() => handleAddToCart(drink)}
                      className="w-full neo-btn py-2 px-3 bg-[#FF6B35] hover:bg-[#ff5a22] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5"
                    >
                      <span>ADD TO BOX</span>
                      <span className="text-base leading-none">+</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* REVIEWS SECTION ("WHAT THE FANS SAY 💬") */}
          <section id="reviews" className="space-y-6 scroll-mt-24 pt-4 border-t-3 border-[#1E1E1E]">
            <div className="flex items-center justify-between border-b-3 border-[#1E1E1E] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">💬</span>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#1E1E1E] uppercase tracking-tight">
                    WHAT THE FANS SAY
                  </h2>
                </div>
                <p className="text-xs font-extrabold text-gray-500 uppercase mt-0.5">
                  Unfiltered reviews from true pizza chaos enjoyers
                </p>
              </div>
              <StickerBadge text="100% REAL" variant="orange" rotate="right" size="md" />
            </div>

            {/* Masonry / Staggered Neubrutalist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {reviewItems.slice(0, reviewCount).map((rev) => (
                <div
                  key={rev.id}
                  className={`neo-card p-4 sm:p-5 ${rev.cardColor} ${rev.tilt} transition-transform hover:scale-[1.02] flex flex-col justify-between space-y-3 relative`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#1E1E1E] text-white font-heading font-black text-sm flex items-center justify-center neo-border">
                        {rev.author[1]?.toUpperCase() || 'P'}
                      </div>
                      <div>
                        <h4 className={`font-heading font-extrabold text-sm ${rev.textColor}`}>
                          {rev.author}
                        </h4>
                        <span className="text-[10px] font-bold opacity-75 block">{rev.time}</span>
                      </div>
                    </div>

                    {rev.badge && (
                      <span className="bg-[#CCFF00] text-[#1E1E1E] font-heading font-black text-[10px] uppercase px-2 py-0.5 rounded neo-badge">
                        {rev.badgeIcon} {rev.badge}
                      </span>
                    )}
                  </div>

                  <p className={`font-heading font-extrabold text-lg sm:text-xl leading-snug italic ${rev.textColor}`}>
                    "{rev.content}"
                  </p>

                  <div className="flex items-center justify-between border-t border-black/10 pt-2.5">
                    <div className="flex gap-1 text-amber-400 text-sm">
                      {'★'.repeat(rev.stars)}
                    </div>

                    {rev.reaction && (
                      <span className="bg-white/80 text-[#1E1E1E] text-xs font-heading font-extrabold px-2.5 py-1 rounded-full neo-border">
                        {rev.reaction}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Chaos Button */}
            {reviewCount < reviewItems.length && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setReviewCount((prev) => Math.min(prev + 2, reviewItems.length))}
                  className="neo-btn py-3 px-8 bg-white hover:bg-amber-50 text-[#1E1E1E] font-heading font-black text-sm uppercase tracking-widest rounded-2xl cursor-pointer"
                >
                  LOAD MORE CHAOS 👇
                </button>
              </div>
            )}
          </section>

          {/* FOOTER AT BOTTOM */}
          <footer className="mt-16 border-t-3 border-[#1E1E1E] bg-[#1E1E1E] text-white rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF6B35] neo-border rounded-xl flex items-center justify-center font-heading font-black text-white text-xl">
                  🍕
                </div>
                <div>
                  <span className="font-heading font-black text-2xl tracking-tight block">LIZZA PIZZA</span>
                  <span className="text-xs font-bold text-[#CCFF00] tracking-widest uppercase">No Rules. Just Dough.</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs font-heading font-bold uppercase tracking-wider text-gray-300">
                <a href="#pizzas" className="hover:text-[#CCFF00]">Menu</a>
                <a href="#chaos-grid" className="hover:text-[#CCFF00]">Categories</a>
                <a href="#drinks" className="hover:text-[#CCFF00]">Drinks</a>
                <a href="#reviews" className="hover:text-[#CCFF00]">Reviews</a>
                <button onClick={() => onNavigate && onNavigate('builder')} className="hover:text-[#CCFF00]">Build Your Own</button>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
              <span>© 2024 LIZZA PIZZA. ALL RIGHTS RESERVED.</span>
              <div className="flex gap-4">
                <span>PRIVACY</span>
                <span>TERMS</span>
                <span>ALLERGENS</span>
                <span>FRANCHISE</span>
              </div>
            </div>
          </footer>

        </div>

      </div>

      {/* ================= SLIDE-OVER LEFT CATEGORY DRAWER (< 1280px) ================= */}
      {leftDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setLeftDrawerOpen(false)} />
          <div className="relative bg-[#FFF5F0] neo-border w-80 max-w-full h-full p-6 overflow-y-auto space-y-4 shadow-2xl animate-slide-right">
            <div className="flex items-center justify-between border-b-2.5 border-[#1E1E1E] pb-3">
              <h2 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                MENU CATEGORIES
              </h2>
              <button
                onClick={() => setLeftDrawerOpen(false)}
                className="neo-btn w-8 h-8 rounded-xl bg-white font-bold text-base flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToSection(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-heading font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer text-left ${
                    activeCategory === cat.id
                      ? 'bg-[#FF6B35] text-white neo-border neo-shadow-sm'
                      : 'bg-white text-[#1E1E1E] neo-border'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SLIDE-OVER RIGHT CART DRAWER (< 1280px) ================= */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCartDrawerOpen(false)} />
          <div className="relative bg-white neo-border w-88 max-w-full h-full p-6 overflow-y-auto space-y-4 shadow-2xl animate-slide-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-2.5 border-[#1E1E1E] pb-3 bg-[#FF6B35] text-white -mx-6 -mt-6 p-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛍️</span>
                  <h2 className="font-heading font-black text-xl uppercase tracking-wider">
                    YOUR BOX
                  </h2>
                </div>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="neo-btn w-8 h-8 rounded-xl bg-white text-[#1E1E1E] font-bold text-base flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Cart List */}
              <div className="space-y-3 pt-4 max-h-[60vh] overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 space-y-2">
                    <span className="text-4xl block">📦</span>
                    <p className="font-heading font-bold text-sm uppercase">Your box is empty!</p>
                  </div>
                ) : (
                  cartItems.map((item, idx) => {
                    const unitPrice = item.price !== undefined ? item.price : item.unitPrice || 0;
                    const qty = item.quantity || item.qty || 1;
                    return (
                      <div key={item._id || item.itemId || item.id || idx} className="p-3.5 bg-[#FFF5F0] neo-border rounded-xl space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-heading font-extrabold text-xs sm:text-sm uppercase text-[#1E1E1E]">
                              {item.name || 'Pizza Item'}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {item.size && (
                                <span className="bg-[#CCFF00] text-[#1E1E1E] px-2 py-0.5 rounded text-[10px] font-black uppercase neo-border">
                                  {item.size}
                                </span>
                              )}
                              {item.crust && (
                                <span className="text-[10px] font-bold text-gray-600">
                                  {item.crust}
                                </span>
                              )}
                            </div>
                            {Array.isArray(item.toppings) && item.toppings.length > 0 && (
                              <div className="text-[10px] font-bold text-[#FF6B35] mt-1">
                                + {item.toppings.join(', ')}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(idx)}
                            className="text-gray-400 hover:text-red-500 font-bold text-sm px-1 cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                          <div className="flex items-center gap-2 bg-white neo-border px-2.5 py-1 rounded-lg">
                            <button
                              onClick={() => handleUpdateQty(idx, -1)}
                              className="font-black text-sm text-[#FF6B35] px-1 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-heading font-extrabold text-xs text-[#1E1E1E] min-w-[16px] text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(idx, 1)}
                              className="font-black text-sm text-[#FF6B35] px-1 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-400 block">${unitPrice.toFixed(2)} ea</span>
                            <span className="font-heading font-extrabold text-sm text-[#FF6B35]">
                              ${(unitPrice * qty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Subtotal & Checkout */}
            <div className="pt-4 border-t-2 border-[#1E1E1E] space-y-3 bg-white">
              <div className="flex items-center justify-between font-heading font-black text-base uppercase">
                <span>Subtotal</span>
                <span className="text-[#FF6B35] text-xl">${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  if (onNavigate) onNavigate('summary');
                }}
                disabled={cartItems.length === 0}
                className="w-full neo-btn py-4 px-4 bg-[#FF6B35] text-white font-heading font-black text-sm uppercase tracking-widest rounded-xl disabled:opacity-50 cursor-pointer text-center"
              >
                CHECKOUT →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FLOATING STICKY BOTTOM-RIGHT CART TOGGLE (< 1280px) ================= */}
      <div className="xl:hidden fixed bottom-16 right-4 z-40">
        <button
          onClick={() => setCartDrawerOpen(true)}
          className="neo-btn py-3 px-4 bg-[#FF6B35] text-white font-heading font-black text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="text-lg">🛍️</span>
          <span>YOUR BOX ({cartItems.reduce((a, b) => a + (b.quantity || b.qty || 1), 0)})</span>
          <span className="bg-[#CCFF00] text-[#1E1E1E] px-2 py-0.5 rounded-lg text-xs neo-border font-black">
            ${subtotal.toFixed(2)}
          </span>
        </button>
      </div>
    </PageShell>
  );
}
