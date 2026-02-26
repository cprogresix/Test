import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  Instagram, 
  MessageCircle, 
  Mail, 
  Trash2, 
  Edit3, 
  Plus, 
  LogOut,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Star
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  unlimited: boolean;
  image?: string;
};

type ViewState = 'store' | 'admin-login' | 'admin-dashboard';

// --- Mock Data ---
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium UI Kit',
    price: 150000,
    description: 'A comprehensive set of UI components for modern web applications.',
    stock: 10,
    unlimited: false,
  },
  {
    id: '2',
    name: 'Digital Marketing E-Book',
    price: 99000,
    description: 'Master the art of digital marketing with this complete guide.',
    stock: 999,
    unlimited: true,
  },
  {
    id: '3',
    name: 'Stock Photo Pack Vol.1',
    price: 250000,
    description: 'High resolution stock photos for commercial use.',
    stock: 5,
    unlimited: false,
  },
  {
    id: '4',
    name: 'Icon Set Pro',
    price: 75000,
    description: '2000+ vector icons in multiple formats.',
    stock: 999,
    unlimited: true,
  },
];

// --- Components ---

const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger' }) => {
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    outline: 'border-2 border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  };

  return (
    <button 
      className={cn(
        'px-4 py-2 rounded-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    className={cn(
      'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all',
      className
    )}
    {...props}
  />
);

// --- Main Application ---

export default function ProgresixStore() {
  // Global State
  const [view, setView] = useState<ViewState>('store');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<Product[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Derived State
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Handlers
  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    showNotification(`Added ${product.name} to cart`, 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    setIsAdminLoggedIn(true);
    setView('admin-dashboard');
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      stock: Number(formData.get('stock')),
      unlimited: formData.get('unlimited') === 'on',
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
      showNotification('Product updated successfully', 'success');
    } else {
      setProducts([...products, newProduct]);
      showNotification('Product added successfully', 'success');
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      showNotification('Product deleted', 'success');
    }
  };

  // --- Sub-Views ---

  const StoreView = () => (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <ShoppingBag size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">Progresix</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('admin-login')}
              className="hidden sm:block text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Admin
            </button>
            <div className="relative">
              <ShoppingBag className="text-slate-700" size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </div>
            <button 
              className="sm:hidden p-2 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
            <a href="#" className="block font-medium text-slate-900">Home</a>
            <a href="#products" className="block font-medium text-slate-500">Products</a>
            <a href="#contact" className="block font-medium text-slate-500">Contact</a>
            <button 
              onClick={() => { setView('admin-login'); setIsMobileMenuOpen(false); }}
              className="block font-medium text-slate-500 w-full text-left"
            >
              Admin Login
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        {/* Hero */}
        <section className="text-center mb-12">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Progresix Store
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Solusi Produk Digital & Fisik Terpercaya. Kualitas terbaik untuk kebutuhan digital Anda.
          </p>
        </section>

        {/* Search */}
        <div className="sticky top-20 z-30 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        <section id="products" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Katalog Produk</h2>
            <span className="text-sm text-slate-500">{filteredProducts.length} items</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400">Produk tidak ditemukan.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-slate-700 transition-colors">
                        {product.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 mt-1">
                        {product.unlimited ? 'Digital Product' : `Stock: ${product.stock}`}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-1">Harga</p>
                      <p className="text-xl font-black text-slate-900">
                        Rp{product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {product.description}
                  </p>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => addToCart(product)}
                      className="flex-1"
                    >
                      Beli Sekarang
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section id="contact" className="mt-20 pt-10 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Hubungi Kami</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a 
              href="mailto:bardianto.id@gmail.com"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="font-semibold text-slate-900">bardianto.id@gmail.com</p>
              </div>
            </a>

            <a 
              href="https://wa.me/6281930000298"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">WhatsApp</p>
                <p className="font-semibold text-slate-900">+62 819-3000-0298</p>
              </div>
            </a>

            <a 
              href="https://instagram.com/sm.progresix"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center">
                <Instagram size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Instagram</p>
                <p className="font-semibold text-slate-900">@sm.progresix</p>
              </div>
            </a>

            <a 
              href="https://tiktok.com/@sm.progresix"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">TikTok</p>
                <p className="font-semibold text-slate-900">@sm.progresix</p>
              </div>
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-20 py-8 text-center border-t border-slate-200 bg-white">
        <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mb-2">Secure Checkout Enabled</p>
        <p className="text-[11px] text-slate-300 font-medium">&copy; 2026 Progresix Store</p>
      </footer>
    </div>
  );

  const AdminLoginView = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white">
            <LogOut size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
          <p className="text-slate-500 text-sm mt-2">Masuk ke dashboard manajemen produk</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <Input placeholder="admin" defaultValue="admin" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <Input type="password" placeholder="••••••••" defaultValue="password" required />
          </div>
          <Button type="submit" className="w-full py-3">
            Sign In
          </Button>
        </form>

        <button 
          onClick={() => setView('store')}
          className="w-full mt-6 text-sm text-slate-400 hover:text-slate-600 font-medium"
        >
          &larr; Kembali ke Store
        </button>
      </div>
    </div>
  );

  const AdminDashboardView = () => (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Edit3 size={18} />
            </div>
            <span className="font-bold text-lg text-slate-900">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              onClick={() => setView('store')}
              className="hidden sm:flex"
            >
              View Store
            </Button>
            <Button 
              variant="outline" 
              onClick={() => { setIsAdminLoggedIn(false); setView('store'); }}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Produk</h1>
            <p className="text-slate-500">Kelola katalog produk toko Anda</p>
          </div>
          <Button 
            onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            className="self-start"
          >
            <Plus size={20} />
            Tambah Produk
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[ 
            { label: 'Total Produk', value: products.length, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
            { label: 'Stok Menipis', value: products.filter(p => !p.unlimited && p.stock < 5).length, icon: AlertCircle, color: 'bg-amber-50 text-amber-600' },
            { label: 'Digital', value: products.filter(p => p.unlimited).length, icon: Star, color: 'bg-purple-50 text-purple-600' },
            { label: 'Total Nilai', value: `Rp${products.reduce((acc, p) => acc + p.price, 0).toLocaleString('id-ID')}`, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700">Produk</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Harga</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Stok</th>
                  <th class
