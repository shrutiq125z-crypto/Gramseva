import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';

const CropPrices = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { addNotification } = useNotification();
  const [cropData, setCropData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });

  const categories = {
    'all': 'All Crops',
    'cereals': 'Cereals & Grains',
    'pulses': 'Pulses & Legumes',
    'vegetables': 'Vegetables',
    'fruits': 'Fruits',
    'spices': 'Spices & Herbs',
    'oilseeds': 'Oilseeds',
    'cash_crops': 'Cash Crops',
    'nuts': 'Nuts & Dry Fruits'
  };

  const cropCategories = {
    'cereals': ['Wheat', 'Rice', 'Maize', 'Barley', 'Oats', 'Sorghum', 'Pearl Millet', 'Finger Millet', 'Millet', 'Buckwheat', 'Quinoa', 'Amaranth'],
    'pulses': ['Pulses', 'Moong', 'Tur', 'Arhar', 'Urad', 'Chana', 'Masoor', 'Soybean'],
    'vegetables': ['Potato', 'Onion', 'Tomato', 'Brinjal', 'Cabbage', 'Cauliflower', 'Chili', 'Pumpkin', 'Sweet Potato', 'Yam', 'Tapioca', 'Spinach', 'Coriander', 'Mint'],
    'fruits': ['Mango', 'Banana', 'Apple', 'Grapes', 'Papaya', 'Pomegranate', 'Litchi', 'Guava', 'Pineapple', 'Jackfruit', 'Citrus', 'Lemon', 'Watermelon', 'Muskmelon'],
    'spices': ['Turmeric', 'Ginger', 'Garlic', 'Cumin', 'Ajwain', 'Cardamom', 'Cloves', 'Pepper', 'Nutmeg', 'Vanilla', 'Saffron', 'Coriander Seed', 'Fenugreek'],
    'oilseeds': ['Mustard', 'Groundnut', 'Sesame', 'Safflower', 'Sunflower', 'Flaxseed', 'Olive'],
    'cash_crops': ['Cotton', 'Sugarcane', 'Sugar Beet', 'Tea', 'Coffee', 'Rubber', 'Coconut', 'Arecanut'],
    'nuts': ['Cashew', 'Almonds', 'Walnuts', 'Pistachio', 'Peanuts']
  };

  useEffect(() => {
    fetchCropPrices();
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [cropData, searchQuery, selectedCategory, sortBy, sortOrder, priceRange]);

  const fetchCropPrices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://gramseva-backend-8idx.onrender.com/api/commodity/prices');
      
      if (response.ok) {
        const data = await response.json();
        setCropData(data);
        
        // Calculate price range for filtering
        const prices = data.map(crop => crop.mod_value);
        setPriceRange({
          min: Math.min(...prices),
          max: Math.max(...prices)
        });
      } else {
        throw new Error('Failed to fetch crop prices');
      }
    } catch (error) {
      console.error('Error fetching crop prices:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to load crop prices. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortData = () => {
    let filtered = [...cropData];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(crop =>
        crop.crop_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryKeywords = cropCategories[selectedCategory] || [];
      filtered = filtered.filter(crop =>
        categoryKeywords.some(keyword =>
          crop.crop_name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    // Filter by price range
    filtered = filtered.filter(crop =>
      crop.mod_value >= priceRange.min && crop.mod_value <= priceRange.max
    );

    // Sort data
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.crop_name.toLowerCase();
          bValue = b.crop_name.toLowerCase();
          break;
        case 'price':
          aValue = a.mod_value;
          bValue = b.mod_value;
          break;
        case 'min_price':
          aValue = a.min_value;
          bValue = b.min_value;
          break;
        case 'max_price':
          aValue = a.max_value;
          bValue = b.max_value;
          break;
        default:
          aValue = a.crop_name.toLowerCase();
          bValue = b.crop_name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredData(filtered);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPriceTrend = (crop) => {
    const range = crop.max_value - crop.min_value;
    const position = (crop.mod_value - crop.min_value) / range;
    
    if (position < 0.3) return { color: 'text-green-600', icon: '📈', text: 'Low' };
    if (position > 0.7) return { color: 'text-red-600', icon: '📉', text: 'High' };
    return { color: 'text-yellow-600', icon: '➡️', text: 'Moderate' };
  };

  const getCategoryIcon = (cropName) => {
    const name = cropName.toLowerCase();
    if (name.includes('wheat') || name.includes('rice') || name.includes('maize')) return '🌾';
    if (name.includes('pulses') || name.includes('moong') || name.includes('chana')) return '🫘';
    if (name.includes('potato') || name.includes('onion') || name.includes('tomato')) return '🥔';
    if (name.includes('mango') || name.includes('banana') || name.includes('apple')) return '🍎';
    if (name.includes('turmeric') || name.includes('ginger') || name.includes('garlic')) return '🧄';
    if (name.includes('mustard') || name.includes('groundnut') || name.includes('sesame')) return '🥜';
    if (name.includes('cotton') || name.includes('sugarcane') || name.includes('tea')) return '🌿';
    if (name.includes('cashew') || name.includes('almond') || name.includes('walnut')) return '🌰';
    return '🌱';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center animate-spin">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Loading Crop Prices</h3>
          <p className="text-gray-600 dark:text-gray-400">Fetching latest market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              🌾 Crop Market Prices
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real-time commodity prices to help farmers make informed decisions
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Updated Daily</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>{cropData.length} Crops</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search crops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              {Object.entries(categories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="min_price">Sort by Min Price</option>
              <option value="max_price">Sort by Max Price</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-3 bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min={Math.min(...cropData.map(c => c.mod_value))}
                max={Math.max(...cropData.map(c => c.mod_value))}
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <input
                type="range"
                min={Math.min(...cropData.map(c => c.mod_value))}
                max={Math.max(...cropData.map(c => c.mod_value))}
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredData.length} of {cropData.length} crops
          </p>
        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((crop, index) => {
            const trend = getPriceTrend(crop);
            return (
              <div
                key={crop.crop_name}
                onClick={() => setSelectedCrop(crop)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{getCategoryIcon(crop.crop_name)}</div>
                    <div className={`text-sm font-medium ${trend.color}`}>
                      {trend.icon} {trend.text}
                    </div>
                  </div>

                  {/* Crop Name */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {crop.crop_name}
                  </h3>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current Price</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {formatPrice(crop.mod_value)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Min: {formatPrice(crop.min_value)}</span>
                      <span className="text-gray-500 dark:text-gray-400">Max: {formatPrice(crop.max_value)}</span>
                    </div>

                    {/* Price Range Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((crop.mod_value - crop.min_value) / (crop.max_value - crop.min_value)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Price Variance */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Price Variance</span>
                      <span>{formatPrice(crop.max_value - crop.min_value)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Crops Found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Crop Detail Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{getCategoryIcon(selectedCrop.crop_name)}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedCrop.crop_name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">Commodity Price Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Current Price</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatPrice(selectedCrop.mod_value)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Market Rate</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Minimum Price</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(selectedCrop.min_value)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Lowest Rate</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Maximum Price</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {formatPrice(selectedCrop.max_value)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Highest Rate</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Price Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price Range</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatPrice(selectedCrop.max_value - selectedCrop.min_value)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Current Position</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {Math.round(((selectedCrop.mod_value - selectedCrop.min_value) / (selectedCrop.max_value - selectedCrop.min_value)) * 100)}% of range
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Market Trend</span>
                  <span className={`font-semibold ${getPriceTrend(selectedCrop).color}`}>
                    {getPriceTrend(selectedCrop).icon} {getPriceTrend(selectedCrop).text}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCrop(null)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropPrices;
