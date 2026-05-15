"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { useCartStore } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";
import { Search, Grid, List, Sparkles, Coffee, Utensils, ShoppingBag, Flame, SlidersHorizontal, Check } from "lucide-react";

export interface MenuItem {
  id: number;
  name: string;
  price: string;
  priceNumber: number;
  category: "makanan" | "minuman";
  tags: string[];
  img: string;
  description: string;
}

const MENU_ITEMS: MenuItem[] = [
  // --- 11 MAKANAN ---
  {
    id: 1,
    name: "Truffle Rib-Eye Sando",
    price: "Rp 110.000",
    priceNumber: 110000,
    category: "makanan",
    tags: ["savory", "beef", "premium", "heavy"],
    img: "/coffee_cup_hero.png",
    description: "Sandwich daging wagyu rib-eye premium dengan olesan truffle mayo dan roti brioche panggang."
  },
  {
    id: 2,
    name: "Smoked Salmon Eggs Benedict",
    price: "Rp 85.000",
    priceNumber: 85000,
    category: "makanan",
    tags: ["savory", "breakfast", "seafood"],
    img: "/coffee_cup_hero.png",
    description: "Telur setengah matang di atas sourdough dengan irisan smoked salmon dan saus hollandaise hangat."
  },
  {
    id: 3,
    name: "Maroon Velvet Croissant",
    price: "Rp 45.000",
    priceNumber: 45000,
    category: "makanan",
    tags: ["sweet", "pastry", "signature", "snack"],
    img: "/coffee_cup_hero.png",
    description: "Croissant renyah khas SKY HAUSSS dengan lapisan rasa red velvet dan isian krim keju lumer."
  },
  {
    id: 4,
    name: "Hokkaido Cheese Tart",
    price: "Rp 38.000",
    priceNumber: 38000,
    category: "makanan",
    tags: ["sweet", "cheese", "creamy", "snack"],
    img: "/coffee_cup_hero.png",
    description: "Tart keju panggang ala Hokkaido dengan tekstur super lembut dan pinggiran crust mentega renyah."
  },
  {
    id: 5,
    name: "Wagyu Truffle Fries",
    price: "Rp 55.000",
    priceNumber: 55000,
    category: "makanan",
    tags: ["savory", "snack", "cheese"],
    img: "/coffee_cup_hero.png",
    description: "Kentang goreng potongan tebal berbalur minyak truffle asli dan taburan keju parmesan parut."
  },
  {
    id: 6,
    name: "Classic Caesar Brioche Toast",
    price: "Rp 68.000",
    priceNumber: 68000,
    category: "makanan",
    tags: ["savory", "poultry", "heavy"],
    img: "/coffee_cup_hero.png",
    description: "Roti brioche panggang harum dengan ayam panggang, selada segar, dan dressing caesar autentik."
  },
  {
    id: 7,
    name: "Pistachio Matcha Mille Crepes",
    price: "Rp 65.000",
    priceNumber: 65000,
    category: "makanan",
    tags: ["sweet", "matcha", "creamy", "dessert"],
    img: "/coffee_cup_hero.png",
    description: "Kue berlapis tipis dengan paduan krim matcha Uji Jepang dan taburan kacang pistachio panggang."
  },
  {
    id: 8,
    name: "Artisan Quiche Lorraine",
    price: "Rp 58.000",
    priceNumber: 58000,
    category: "makanan",
    tags: ["savory", "pastry", "cheese"],
    img: "/coffee_cup_hero.png",
    description: "Pai Prancis klasik isi beef bacon renyah, keju gruyere leleh, dan adonan telur custard gurih."
  },
  {
    id: 9,
    name: "Dark Chocolate Lava Cake",
    price: "Rp 62.000",
    priceNumber: 62000,
    category: "makanan",
    tags: ["sweet", "chocolate", "dessert"],
    img: "/coffee_cup_hero.png",
    description: "Kue cokelat Valrhona hangat dengan isian lumer di tengah, disajikan dengan es krim vanilla."
  },
  {
    id: 10,
    name: "Avocado Toast & Poached Egg",
    price: "Rp 60.000",
    priceNumber: 60000,
    category: "makanan",
    tags: ["savory", "healthy", "breakfast"],
    img: "/coffee_cup_hero.png",
    description: "Alpukat tumbuk berbumbu, tomat ceri, dan telur rebus sempurna di atas roti gandum artisan."
  },
  {
    id: 11,
    name: "Cinnamon Kouign-Amann",
    price: "Rp 42.000",
    priceNumber: 42000,
    category: "makanan",
    tags: ["sweet", "pastry", "caramel", "snack"],
    img: "/coffee_cup_hero.png",
    description: "Pastry mentega berlapis gula karamel karamel dengan aroma kayu manis Ceylon dan sedikit garam laut."
  },

  // --- 21 MINUMAN ---
  {
    id: 12,
    name: "Signature Maroon Velvet Latte",
    price: "Rp 55.000",
    priceNumber: 55000,
    category: "minuman",
    tags: ["coffee", "sweet", "signature", "creamy"],
    img: "/coffee_cup_hero.png",
    description: "Espresso premium dengan susu steamed lembut dan reduksi krim red velvet khas SKY HAUSSS."
  },
  {
    id: 13,
    name: "Vanilla Cloud Cold Brew",
    price: "Rp 48.000",
    priceNumber: 48000,
    category: "minuman",
    tags: ["coffee", "refreshing", "sweet"],
    img: "/coffee_cup_hero.png",
    description: "Kopi ekstraksi dingin 18 jam yang ringan, dilapis busa krim manis rasa vanilla bourbon."
  },
  {
    id: 14,
    name: "Hausss Reserve Americano",
    price: "Rp 38.000",
    priceNumber: 38000,
    category: "minuman",
    tags: ["coffee", "strong", "pure"],
    img: "/coffee_cup_hero.png",
    description: "Biji kopi single-origin house blend dengan notes rasa buah berry cerah dan aroma memikat."
  },
  {
    id: 15,
    name: "Kyoto Matcha Espresso Fusion",
    price: "Rp 58.000",
    priceNumber: 58000,
    category: "minuman",
    tags: ["coffee", "matcha", "creamy"],
    img: "/coffee_cup_hero.png",
    description: "Matcha hijau zamrud dari Uji Kyoto dipadukan dengan ristretto pekat dan susu gandum (oat milk)."
  },
  {
    id: 16,
    name: "Salted Caramel Macchiato",
    price: "Rp 52.000",
    priceNumber: 52000,
    category: "minuman",
    tags: ["coffee", "sweet", "caramel", "creamy"],
    img: "/coffee_cup_hero.png",
    description: "Susu steamed berbusa, shot espresso pekat, dan siraman saus karamel mentega dengan sea salt."
  },
  {
    id: 17,
    name: "Valrhona Dark Mocha",
    price: "Rp 56.000",
    priceNumber: 56000,
    category: "minuman",
    tags: ["coffee", "chocolate", "creamy"],
    img: "/coffee_cup_hero.png",
    description: "Cokelat hitam Prancis Valrhona dilelehkan bersama double espresso hangat dan susu krim."
  },
  {
    id: 18,
    name: "Spanish Cinnamon Cortado",
    price: "Rp 45.000",
    priceNumber: 45000,
    category: "minuman",
    tags: ["coffee", "strong", "warm"],
    img: "/coffee_cup_hero.png",
    description: "Kopi espresso pekat berpadu dengan susu kental hangat dan sentuhan rempah kayu manis harum."
  },
  {
    id: 19,
    name: "Iced Hazelnut Praline Latte",
    price: "Rp 52.000",
    priceNumber: 52000,
    category: "minuman",
    tags: ["coffee", "sweet", "nutty"],
    img: "/coffee_cup_hero.png",
    description: "Kopi susu es dengan sirup hazelnut panggang premium dan taburan kacang praline renyah."
  },
  {
    id: 20,
    name: "Butterscotch Sea Salt Latte",
    price: "Rp 54.000",
    priceNumber: 54000,
    category: "minuman",
    tags: ["coffee", "sweet", "caramel", "creamy"],
    img: "/coffee_cup_hero.png",
    description: "Perpaduan rasa gula mentega butterscotch yang kaya dengan topping krim keju sea salt gurih."
  },
  {
    id: 21,
    name: "Honey Oat Milk Draft Latte",
    price: "Rp 58.000",
    priceNumber: 58000,
    category: "minuman",
    tags: ["coffee", "creamy", "healthy"],
    img: "/coffee_cup_hero.png",
    description: "Draft latte bertekstur nitro sehalus sutra dengan pemanis alami madu hutan dan susu oat."
  },
  {
    id: 22,
    name: "Artisan Earl Grey Milk Tea",
    price: "Rp 46.000",
    priceNumber: 46000,
    category: "minuman",
    tags: ["tea", "creamy", "floral"],
    img: "/coffee_cup_hero.png",
    description: "Teh hitam aroma jeruk bergamot yang diseduh pekat dengan susu kental manis dan busa lavender."
  },
  {
    id: 23,
    name: "Lychee Sakura Blossom Breeze",
    price: "Rp 48.000",
    priceNumber: 48000,
    category: "minuman",
    tags: ["refreshing", "sweet", "fruity", "soda"],
    img: "/coffee_cup_hero.png",
    description: "Minuman soda menyegarkan dengan buah leci utuh, popping boba, dan sirup bunga sakura."
  },
  {
    id: 24,
    name: "Yuzu Citrus Cold Brew Mist",
    price: "Rp 50.000",
    priceNumber: 50000,
    category: "minuman",
    tags: ["coffee", "refreshing", "fruity"],
    img: "/coffee_cup_hero.png",
    description: "Es kopi cold brew berpadu selai jeruk yuzu Jepang yang memberikan sensasi manis asam segar."
  },
  {
    id: 25,
    name: "Belgian Hot Chocolate",
    price: "Rp 52.000",
    priceNumber: 52000,
    category: "minuman",
    tags: ["chocolate", "warm", "sweet", "creamy"],
    img: "/coffee_cup_hero.png",
    description: "Susu cokelat panas kental asli dari lelehan kepingan cokelat Belgia 70% dark chocolate."
  },
  {
    id: 26,
    name: "Hibiscus Berry Sunrise",
    price: "Rp 44.000",
    priceNumber: 44000,
    category: "minuman",
    tags: ["tea", "refreshing", "fruity", "healthy"],
    img: "/coffee_cup_hero.png",
    description: "Teh bunga sepatu merah merona yang dicampur sari buah berry liar dan sensasi dingin daun mint."
  },
  {
    id: 27,
    name: "Chamomile Lavender Elixir",
    price: "Rp 42.000",
    priceNumber: 42000,
    category: "minuman",
    tags: ["tea", "warm", "floral", "healthy"],
    img: "/coffee_cup_hero.png",
    description: "Seduhan teh herbal bunga chamomile dan lavender organik hangat dengan madu manuka penenang jiwa."
  },
  {
    id: 28,
    name: "Espresso Tonic & Lime",
    price: "Rp 45.000",
    priceNumber: 45000,
    category: "minuman",
    tags: ["coffee", "refreshing", "soda"],
    img: "/coffee_cup_hero.png",
    description: "Double shot espresso pekat dituangkan di atas es batu, air tonik berkarbonasi, dan irisan jeruk nipis."
  },
  {
    id: 29,
    name: "Dirty Chai Latte",
    price: "Rp 52.000",
    priceNumber: 52000,
    category: "minuman",
    tags: ["coffee", "tea", "warm", "spiced"],
    img: "/coffee_cup_hero.png",
    description: "Teh rempah masala chai harum berpadu dengan susu panas dan tambahan satu shot espresso pekat."
  },
  {
    id: 30,
    name: "Pistachio White Chocolate Frappe",
    price: "Rp 62.000",
    priceNumber: 62000,
    category: "minuman",
    tags: ["sweet", "creamy", "nutty", "dessert"],
    img: "/coffee_cup_hero.png",
    description: "Frappe es blender rasa cokelat putih premium dengan pasta kacang pistachio dan whipped cream."
  },
  {
    id: 31,
    name: "Peach Oolong Cold Foam Tea",
    price: "Rp 48.000",
    priceNumber: 48000,
    category: "minuman",
    tags: ["tea", "refreshing", "fruity", "creamy"],
    img: "/coffee_cup_hero.png",
    description: "Teh oolong kualitas tinggi dengan sirup buah persik segar, ditutup lapisan busa keju manis di atasnya."
  },
  {
    id: 32,
    name: "Affogato al Caffè",
    price: "Rp 50.000",
    priceNumber: 50000,
    category: "minuman",
    tags: ["coffee", "dessert", "sweet", "creamy"],
    img: "/coffee_cup_hero.png",
    description: "Satu skup besar gelato vanilla bean artisanal disiram secangkir espresso panas Hausss yang baru diekstraksi."
  }
];

export default function MenuGrid({ onSelectProduct }: { onSelectProduct: (product: MenuItem) => void }) {
  const { addItem, openCart } = useCartStore();
  
  // State Filter & Tampilan
  const [activeTab, setActiveTab] = useState<"semua" | "rekomendasi" | "makanan" | "minuman">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  // --- ZERO RAM / MINIMAL MEMORY RECOMMENDATION ENGINE ---
  // Kita hanya menyimpan satu objek kecil frekuensi tag di memori (kurang dari 100 bytes)
  const [userPrefs, setUserPrefs] = useState<Record<string, number>>({});

  useEffect(() => {
    // Ambil preferensi dari localStorage saat komponen dimuat
    try {
      const savedPrefs = localStorage.getItem("skyhaus_user_prefs");
      if (savedPrefs) {
        setUserPrefs(JSON.parse(savedPrefs));
      }
    } catch (e) {
      console.error("Gagal membaca preferensi", e);
    }

    // Deteksi ukuran layar untuk responsivitas mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("list"); // Otomatis mode list saat di handphone
      }
    };

    handleResize(); // Cek awal saat mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fungsi mencatat pilihan pengguna untuk algoritma rekomendasi
  const recordUserInteraction = (item: MenuItem) => {
    const newPrefs = { ...userPrefs };
    
    // Tambah bobot untuk setiap tag item yang dipilih
    item.tags.forEach((tag) => {
      newPrefs[tag] = (newPrefs[tag] || 0) + 1;
    });

    // Tambah bobot untuk kategori
    newPrefs[item.category] = (newPrefs[item.category] || 0) + 0.5;

    setUserPrefs(newPrefs);
    try {
      localStorage.setItem("skyhaus_user_prefs", JSON.stringify(newPrefs));
    } catch (e) {
      console.error("Gagal menyimpan preferensi", e);
    }
  };

  // Fungsi menghitung skor relevansi berdasarkan riwayat preferensi
  const calculateRelevanceScore = (item: MenuItem) => {
    if (Object.keys(userPrefs).length === 0) return 0;
    let score = 0;
    item.tags.forEach((tag) => {
      score += userPrefs[tag] || 0;
    });
    score += (userPrefs[item.category] || 0) * 0.5;
    return score;
  };

  // Memoized filter dan sorting menu
  const processedMenuItems = useMemo(() => {
    let result = [...MENU_ITEMS];

    // Filter berdasarkan tab
    if (activeTab === "makanan") {
      result = result.filter((i) => i.category === "makanan");
    } else if (activeTab === "minuman") {
      result = result.filter((i) => i.category === "minuman");
    }

    // Filter berdasarkan pencarian
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting: Jika tab Rekomendasi aktif atau user memiliki interaksi, urutkan berdasarkan skor relevansi
    if (activeTab === "rekomendasi") {
      result.sort((a, b) => calculateRelevanceScore(b) - calculateRelevanceScore(a));
    } else {
      // Pada tab biasa, berikan sedikit boost untuk item dengan relevansi tinggi di atas
      result.sort((a, b) => {
        const scoreA = calculateRelevanceScore(a);
        const scoreB = calculateRelevanceScore(b);
        if (scoreA > 5 && scoreB <= 5) return -1;
        if (scoreB > 5 && scoreA <= 5) return 1;
        return a.id - b.id;
      });
    }

    return result;
  }, [activeTab, searchQuery, userPrefs]);

  const handleSelectMenu = (item: MenuItem) => {
    recordUserInteraction(item);
    onSelectProduct(item);
  };

  const handleAddToCart = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    recordUserInteraction(item);
    addItem({ id: item.id.toString(), name: item.name, price: item.priceNumber });
    setAddedItemNotification(item.name);
    setTimeout(() => setAddedItemNotification(null), 2500);
    openCart();
  };

  return (
    <section id="menu-section" className="w-full py-24 md:py-32 bg-light-gray px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-4 uppercase">
              THE <span className="text-maroon">COLLECTION</span>
            </h2>
            <div className="w-24 h-1.5 bg-maroon rounded-full mb-6"></div>
            <p className="text-gray-500 max-w-2xl text-sm sm:text-base px-4">
              Pilih menu makanan atau minuman premium kami. Semakin sering Anda memilih, sistem cerdas kami akan otomatis menampilkan menu relevan favorit Anda.
            </p>
          </div>
        </ScrollReveal>

        {/* Notifikasi Pop-up Sukses Masuk Keranjang */}
        {addedItemNotification && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-medium text-sm animate-bounce">
            <Check size={18} className="text-green-300" /> Berhasil menambahkan <span className="font-bold">{addedItemNotification}</span> ke keranjang!
          </div>
        )}

        {/* Filter & Kontrol Tampilan (Responsive) */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-12 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Navigasi Tab Kategori */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab("semua")}
                className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "semua"
                    ? "bg-maroon text-white shadow-lg shadow-maroon/20 scale-105"
                    : "bg-off-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <SlidersHorizontal size={16} /> Semua Menu (32)
              </button>
              
              <button
                onClick={() => setActiveTab("rekomendasi")}
                className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "rekomendasi"
                    ? "bg-maroon text-white shadow-lg shadow-maroon/20 scale-105"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/50"
                }`}
              >
                <Sparkles size={16} className="text-amber-500 animate-pulse" /> ✨ Rekomendasi Untukmu
              </button>

              <button
                onClick={() => setActiveTab("makanan")}
                className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "makanan"
                    ? "bg-maroon text-white shadow-lg shadow-maroon/20 scale-105"
                    : "bg-off-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Utensils size={16} /> Makanan (11)
              </button>

              <button
                onClick={() => setActiveTab("minuman")}
                className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "minuman"
                    ? "bg-maroon text-white shadow-lg shadow-maroon/20 scale-105"
                    : "bg-off-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Coffee size={16} /> Minuman (21)
              </button>
            </div>

            {/* Input Cari & Switch Tampilan Mode Grid/List */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari rasa, bahan, nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-off-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-maroon transition-all text-gray-900"
                />
              </div>

              {/* Toggle Mode Tampilan (Hanya relevan/tampak jelas di desktop, di hp jadi list) */}
              <div className="hidden sm:flex items-center bg-off-white p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-maroon shadow-sm font-bold" : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Tampilan Grid"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "list" ? "bg-white text-maroon shadow-sm font-bold" : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Tampilan List"
                >
                  <List size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Informasi Rekomendasi Pintar Jika Kosong */}
        {activeTab === "rekomendasi" && Object.keys(userPrefs).length === 0 && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 text-center mb-10 max-w-3xl mx-auto">
            <Sparkles size={36} className="text-amber-500 mx-auto mb-3 animate-spin" />
            <h3 className="text-lg font-bold text-amber-900 mb-1">Sistem Rekomendasi Pintar Tanpa Memori</h3>
            <p className="text-sm text-amber-700">
              Anda belum memilih atau memasukkan menu ke keranjang. Silakan pilih beberapa menu favorit Anda, dan algoritma cerdas kami akan langsung menyesuaikan preferensi relevan secara instan!
            </p>
          </div>
        )}

        {/* Hasil Menu Kosong */}
        {processedMenuItems.length === 0 && (
          <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100">
            <Search size={48} className="mx-auto mb-4 opacity-40" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Menu tidak ditemukan</h3>
            <p className="text-sm text-gray-500">Coba gunakan kata kunci lain atau hapus filter pencarian.</p>
          </div>
        )}

        {/* CONTAINER MENU (Grid atau List) */}
        {viewMode === "grid" ? (
          /* --- TAMPILAN GRID (Untuk Desktop/Tablet) --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {processedMenuItems.map((item, index) => {
              const relevance = calculateRelevanceScore(item);
              const isRecommended = relevance > 2 || (activeTab === "rekomendasi" && index < 3);

              return (
                <ScrollReveal key={item.id} delay={(index % 6) * 75}>
                  <div
                    className={`menu-card bg-white rounded-3xl p-6 md:p-8 flex flex-col cursor-pointer group relative border transition-all duration-300 h-full ${
                      isRecommended ? "border-maroon/40 shadow-[0_10px_30px_rgba(128,0,0,0.06)]" : "border-gray-100"
                    }`}
                    onClick={() => handleSelectMenu(item)}
                  >
                    {/* Badge Rekomendasi / Kategori */}
                    <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-1.5">
                      {isRecommended && (
                        <span className="bg-gradient-to-r from-red-600 to-maroon text-white font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                          <Flame size={12} /> Terfavorit Relevan
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        item.category === "makanan" ? "bg-amber-100 text-amber-900" : "bg-blue-100 text-blue-900"
                      }`}>
                        {item.category}
                      </span>
                    </div>

                    {/* Gambar Produk */}
                    <div className="w-full aspect-square relative mb-6 bg-off-white rounded-2xl flex items-center justify-center p-6 overflow-hidden mt-8">
                      <div className="relative w-full h-full menu-card-img flex items-center justify-center">
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain drop-shadow-xl mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Info Detail */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-maroon transition-colors duration-300 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed font-normal">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-6">
                          {item.tags.map((t) => (
                            <span key={t} className="text-[10px] font-medium bg-light-gray text-gray-600 px-2.5 py-1 rounded-md">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Harga & Tombol Keranjang */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <p className="text-xl md:text-2xl font-black text-maroon font-syne tracking-tight">
                          {item.price}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleAddToCart(e, item)}
                            className="bg-maroon hover:bg-maroon-dark text-white p-3 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
                            title="Tambah ke Keranjang"
                          >
                            <ShoppingBag size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          /* --- TAMPILAN LIST (Dioptimalkan untuk Mobile / Handphone) --- */
          <div className="flex flex-col space-y-3 sm:space-y-4 max-w-4xl mx-auto">
            {processedMenuItems.map((item, index) => {
              const relevance = calculateRelevanceScore(item);
              const isRecommended = relevance > 2 || (activeTab === "rekomendasi" && index < 3);

              return (
                <ScrollReveal key={item.id} delay={(index % 8) * 50}>
                  <div
                    onClick={() => handleSelectMenu(item)}
                    className={`flex items-center gap-3 sm:gap-6 bg-white rounded-2xl p-3.5 sm:p-5 shadow-xs hover:shadow-md border transition-all group cursor-pointer relative overflow-hidden ${
                      isRecommended ? "border-l-4 border-l-maroon border-maroon/30 bg-gradient-to-r from-red-50/20 to-white" : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    {/* Gambar Thumbnail Compact */}
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-off-white rounded-xl p-1.5 sm:p-2.5 flex-shrink-0 relative flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="100px"
                        className="object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Informasi Produk Tengah */}
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="text-sm sm:text-lg font-bold text-gray-900 group-hover:text-maroon transition-colors truncate">
                          {item.name}
                        </h3>
                        {isRecommended && (
                          <span className="bg-red-100 text-maroon text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-0.5 flex-shrink-0">
                            <Flame size={10} /> Relevan
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1 sm:line-clamp-2 mb-1.5 font-normal leading-tight">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-maroon text-sm sm:text-base tracking-tight">
                          {item.price}
                        </span>
                        <span className="text-[10px] text-gray-400 hidden sm:inline">•</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase hidden sm:inline ${
                          item.category === "makanan" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Tombol Keranjang / Order Kanan */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="bg-maroon hover:bg-maroon-dark text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all shadow-sm flex items-center gap-1.5 transform active:scale-95 cursor-pointer"
                        title="Tambah ke Keranjang"
                      >
                        <ShoppingBag size={16} /> <span className="hidden sm:inline">+ Keranjang</span>
                      </button>
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
