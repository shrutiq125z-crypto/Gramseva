import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

// Static news data
const newsData = [
  {
    title: "GramSeva Launches Digital Haat for Farmers",
    slug: "gramseva-digital-haat-launch",
    summary: "GramSeva has launched a Digital Haat to help farmers sell produce directly to consumers and local businesses.",
    content: "The GramSeva platform introduced a Digital Haat where farmers can list their crops, negotiate prices, and directly connect with buyers. This move aims to cut middlemen and ensure better prices for farmers.",
    category: "agriculture",
    tags: ["GramSeva", "Digital Haat", "farmers", "market"],
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: { name: "GramSeva News", url: "https://gramseva.org/news" },
    author: { name: "Admin Reporter" },
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: "published",
    isFeatured: true,
    views: 1250
  },
  {
    title: "Real-Time Crop Price Feature Added in GramSeva",
    slug: "gramseva-real-time-crop-prices",
    summary: "Farmers can now check real-time crop rates directly on the GramSeva platform.",
    content: "GramSeva integrated live crop market prices, helping farmers make informed selling decisions. The feature supports over 50 crops and updates hourly.",
    category: "technology",
    tags: ["GramSeva", "crop prices", "real-time data"],
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: { name: "GramSeva Times" },
    author: { name: "Reporter Team" },
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "published",
    isFeatured: false,
    views: 890
  },
  {
    title: "GramSeva Partners with Government to Empower Villages",
    slug: "gramseva-govt-partnership",
    summary: "A new partnership aims to provide digital tools to 10,000 villages by 2026.",
    content: "GramSeva signed an MoU with the Ministry of Agriculture to deploy digital kiosks and training programs for farmers. The initiative will boost digital literacy in rural India.",
    category: "partnership",
    tags: ["GramSeva", "government", "digital india"],
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: { name: "Agro Journal" },
    author: { name: "Staff Writer" },
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: "published",
    isFeatured: false,
    views: 2100
  },
  {
    title: "Women Farmers Join GramSeva Digital Platform",
    slug: "women-farmers-gramseva",
    summary: "Women-led farming groups are adopting GramSeva to access wider markets.",
    content: "GramSeva's Digital Haat witnessed registrations from over 5,000 women farmers across UP, Bihar, and Maharashtra, showcasing women empowerment in agriculture.",
    category: "community",
    tags: ["GramSeva", "women farmers", "empowerment"],
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: { name: "GramSeva Reports" },
    author: { name: "Community Desk" },
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    status: "published",
    isFeatured: true,
    views: 1800
  },
  {
    title: "GramSeva Mobile App Crosses 1 Million Downloads",
    slug: "gramseva-1-million-downloads",
    summary: "The GramSeva app has become a trusted tool for rural communities.",
    content: "The mobile app by GramSeva has crossed over 1 million downloads on Google Play Store, making it one of the most used rural apps in India.",
    category: "technology",
    tags: ["GramSeva", "mobile app", "milestone"],
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: { name: "Tech for Rural India" },
    author: { name: "Tech Correspondent" },
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: "published",
    isFeatured: false,
    views: 3200
  },
  {
    title: "GramSeva Introduces Farmer Credit Score",
    slug: "gramseva-farmer-credit-score",
    summary: "A new credit scoring system helps farmers access loans easily.",
    content: "The Farmer Credit Score on GramSeva evaluates transaction history, crop sales, and financial discipline, making it easier for farmers to approach banks for loans.",
    category: "finance",
    tags: ["GramSeva", "loans", "credit score"],
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: { name: "Rural Finance Daily" },
    author: { name: "Finance Desk" },
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    status: "published",
    isFeatured: false,
    views: 1500
  },
  {
    title: "Farmers Save 20% Costs via GramSeva Collective Buying",
    slug: "gramseva-collective-buying",
    summary: "Group purchasing feature saves money on seeds and fertilizers.",
    content: "GramSeva introduced a collective buying system where farmers pool orders for seeds and fertilizers, reducing costs by up to 20%.",
    category: "agriculture",
    tags: ["GramSeva", "collective buying", "cost saving"],
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: { name: "Agri Economics News" },
    author: { name: "Reporter" },
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    status: "published",
    isFeatured: true,
    views: 2400
  },
  {
    title: "GramSeva Launches Weather Alert System for Farmers",
    slug: "gramseva-weather-alerts",
    summary: "Farmers get SMS alerts about rainfall, storms, and temperature changes.",
    content: "The new weather alert feature by GramSeva uses satellite data and IMD forecasts to send timely alerts to farmers, helping reduce crop damage.",
    category: "technology",
    tags: ["GramSeva", "weather alerts", "farm safety"],
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: { name: "Rural Tech Today" },
    author: { name: "Science Desk" },
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    status: "published",
    isFeatured: false,
    views: 1100
  },
  {
    title: "GramSeva Hosts Online Training for Organic Farming",
    slug: "gramseva-organic-farming-training",
    summary: "Over 2,000 farmers attended the online training sessions.",
    content: "GramSeva organized webinars on organic farming techniques, covering composting, bio-fertilizers, and crop rotation methods to boost sustainable agriculture.",
    category: "training",
    tags: ["GramSeva", "organic farming", "training"],
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: { name: "Agri News Network" },
    author: { name: "Training Team" },
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    status: "published",
    isFeatured: false,
    views: 950
  },
  {
    title: "GramSeva Farmers Export Mangoes to Gulf Countries",
    slug: "gramseva-mango-export",
    summary: "Farmers from Maharashtra and Gujarat exported 10 tons of mangoes via GramSeva.",
    content: "For the first time, GramSeva facilitated international trade by connecting farmers with buyers in UAE, Saudi Arabia, and Qatar, boosting farmer incomes.",
    category: "exports",
    tags: ["GramSeva", "exports", "mango"],
    language: "en",
    imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    source: { name: "Export Times" },
    author: { name: "Trade Correspondent" },
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    status: "published",
    isFeatured: true,
    views: 2800
  }
];

export default function News() {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Simulate loading for dynamic feel
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(newsData.map(article => article.category))];

  // Filter and sort news
  const filteredNews = newsData
    .filter(article => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'oldest':
          return new Date(a.publishedAt) - new Date(b.publishedAt);
        case 'views':
          return b.views - a.views;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const featuredNews = newsData.filter(article => article.isFeatured);
  const regularNews = filteredNews.filter(article => !article.isFeatured);

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      agriculture: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      partnership: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      community: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      finance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      training: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      exports: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading latest news...</p>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4">
              📰 Latest News & Updates
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Stay informed with the latest developments in agriculture, technology, and rural development
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50 dark:border-gray-700/50 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category === 'all' ? 'All News' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Viewed</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Featured News Section */}
        {featuredNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="mr-3">⭐</span>
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.slice(0, 2).map((article, index) => (
                <div
                  key={article.slug}
                  className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-1 border border-white/50 dark:border-gray-700/50 cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="relative h-64 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                        ⭐ Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>👁️ {article.views.toLocaleString()}</span>
                        <span>📅 {formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>By {article.author.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular News Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-3">📋</span>
            All News ({regularNews.length} articles)
                  </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map((article, index) => (
              <div
                key={article.slug}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-1 border border-white/50 dark:border-gray-700/50 cursor-pointer"
                onClick={() => setSelectedArticle(article)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-3">
                      <span>👁️ {article.views.toLocaleString()}</span>
                      <span>📅 {formatDate(article.publishedAt)}</span>
                    </div>
                    <span>By {article.author.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>

        {/* Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  ✕
                </button>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedArticle.category)}`}>
                    {selectedArticle.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedArticle.title}
                </h1>
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <span>👁️ {selectedArticle.views.toLocaleString()} views</span>
                  <span>📅 {formatDate(selectedArticle.publishedAt)}</span>
                  <span>✍️ By {selectedArticle.author.name}</span>
                  <span>📰 {selectedArticle.source.name}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  {selectedArticle.content}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedArticle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                </span>
                  ))}
                </div>
                <div className="flex justify-end">
                <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300"
                >
                    Close
                </button>
              </div>
            </div>
              </div>
            </div>
      )}
      </div>
    </div>
  );
}