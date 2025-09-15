import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

// Static schemes data
const schemesData = [
  {
    id: 1,
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    category: "Agriculture",
    description: "Direct income support of ₹6,000 per year to small and marginal farmers",
    eligibility: "Small and marginal farmers with landholding up to 2 hectares",
    benefits: "₹6,000 per year in three equal installments",
    applicationProcess: "Online through PM-KISAN portal or Common Service Centers",
    documents: ["Aadhar Card", "Bank Account Details", "Land Records"],
    status: "Active",
    launchDate: "2019-02-01",
    lastUpdated: "2024-01-15",
    beneficiaries: "11.5 Crore",
    budget: "₹75,000 Crore",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isFeatured: true,
    priority: "High"
  },
  {
    id: 2,
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "Agriculture",
    description: "Crop insurance scheme to provide financial support to farmers in case of crop failure",
    eligibility: "All farmers growing notified crops in notified areas",
    benefits: "Premium subsidy up to 90% for small farmers, compensation for crop loss",
    applicationProcess: "Through insurance companies or online portal",
    documents: ["Aadhar Card", "Land Records", "Bank Account Details"],
    status: "Active",
    launchDate: "2016-01-01",
    lastUpdated: "2024-02-01",
    beneficiaries: "5.5 Crore",
    budget: "₹15,000 Crore",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isFeatured: true,
    priority: "High"
  },
  {
    id: 3,
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    category: "Housing",
    description: "Housing for All by 2022 - providing pucca houses to all eligible families",
    eligibility: "Economically Weaker Section (EWS), LIG, MIG families",
    benefits: "Financial assistance up to ₹2.67 lakh for construction of pucca house",
    applicationProcess: "Online through PMAY portal or through Urban Local Bodies",
    documents: ["Aadhar Card", "Income Certificate", "Land Documents"],
    status: "Active",
    launchDate: "2015-06-25",
    lastUpdated: "2024-01-20",
    beneficiaries: "2.3 Crore",
    budget: "₹1.5 Lakh Crore",
    imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isFeatured: false,
    priority: "High"
  },
  {
    id: 4,
    name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
    category: "Healthcare",
    description: "World's largest health insurance scheme providing coverage up to ₹5 lakh per family",
    eligibility: "Families identified as deprived rural and urban poor",
    benefits: "Health insurance coverage up to ₹5 lakh per family per year",
    applicationProcess: "Through Common Service Centers or online portal",
    documents: ["Aadhar Card", "Ration Card", "Income Certificate"],
    status: "Active",
    launchDate: "2018-09-23",
    lastUpdated: "2024-01-10",
    beneficiaries: "10.7 Crore",
    budget: "₹6,400 Crore",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isFeatured: true,
    priority: "High"
  },
  {
    id: 5,
    name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    category: "Energy",
    description: "Providing LPG connections to women from Below Poverty Line families",
    eligibility: "Women from BPL families, SC/ST households",
    benefits: "Free LPG connection with first refill and safety device",
    applicationProcess: "Through LPG distributors or online application",
    documents: ["Aadhar Card", "BPL Certificate", "Bank Account Details"],
    status: "Active",
    launchDate: "2016-05-01",
    lastUpdated: "2024-01-05",
    beneficiaries: "9.6 Crore",
    budget: "₹12,800 Crore",
    imageUrl: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isFeatured: false,
    priority: "Medium"
  },
  {
    id: 6,
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    category: "Finance",
    description: "Providing loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises",
    eligibility: "Small business owners, micro enterprises, startups",
    benefits: "Loans up to ₹10 lakh without collateral",
    applicationProcess: "Through participating banks and NBFCs",
    documents: ["Aadhar Card", "Business Plan", "Bank Account Details"],
    status: "Active",
    launchDate: "2015-04-08",
    lastUpdated: "2024-01-12",
    beneficiaries: "4.5 Crore",
    budget: "₹3.2 Lakh Crore",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isFeatured: false,
    priority: "Medium"
  },
  {
    id: 7,
    name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
    category: "Skill Development",
    description: "Skill development and certification program for youth",
    eligibility: "Indian citizens aged 15-45 years",
    benefits: "Free skill training and certification with placement assistance",
    applicationProcess: "Through training centers or online registration",
    documents: ["Aadhar Card", "Educational Certificates", "Bank Account Details"],
    status: "Active",
    launchDate: "2015-07-15",
    lastUpdated: "2024-01-08",
    beneficiaries: "1.2 Crore",
    budget: "₹12,000 Crore",
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isFeatured: false,
    priority: "Medium"
  },
  {
    id: 8,
    name: "Pradhan Mantri Gram Sadak Yojana (PMGSY)",
    category: "Infrastructure",
    description: "Rural road connectivity program for unconnected habitations",
    eligibility: "Rural habitations with population 500+ in plain areas, 250+ in hilly areas",
    benefits: "All-weather road connectivity to rural areas",
    applicationProcess: "Through state governments and district administrations",
    documents: ["Village Panchayat Resolution", "Land Records", "Technical Survey"],
    status: "Active",
    launchDate: "2000-12-25",
    lastUpdated: "2024-01-18",
    beneficiaries: "1.8 Lakh Villages",
    budget: "₹2.5 Lakh Crore",
    imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isFeatured: false,
    priority: "High"
  }
];

const Schemes = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Simulate loading for dynamic feel
  useEffect(() => {
    const timer = setTimeout(() => {
      setSchemes(schemesData);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(schemesData.map(scheme => scheme.category))];

  // Filter and sort schemes
  const filteredSchemes = schemes
    .filter(scheme => {
      const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
      const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'name':
          return a.name.localeCompare(b.name);
        case 'beneficiaries':
          return parseInt(b.beneficiaries.replace(/[^\d]/g, '')) - parseInt(a.beneficiaries.replace(/[^\d]/g, ''));
        case 'budget':
          return parseInt(b.budget.replace(/[^\d]/g, '')) - parseInt(a.budget.replace(/[^\d]/g, ''));
        default:
          return 0;
      }
    });

  const featuredSchemes = filteredSchemes.filter(scheme => scheme.isFeatured);
  const regularSchemes = filteredSchemes.filter(scheme => !scheme.isFeatured);

  const getCategoryColor = (category) => {
    const colors = {
      'Agriculture': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Housing': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Healthcare': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'Energy': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Finance': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'Skill Development': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'Infrastructure': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading government schemes...</p>
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
              🏛️ Government Schemes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore and apply for various government schemes designed to empower citizens and drive development
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
                  placeholder="Search schemes..."
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
                  {category === 'all' ? 'All Schemes' : category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="priority">Sort by Priority</option>
              <option value="name">Sort by Name</option>
              <option value="beneficiaries">Sort by Beneficiaries</option>
              <option value="budget">Sort by Budget</option>
            </select>
          </div>
        </div>

        {/* Featured Schemes Section */}
        {featuredSchemes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="mr-3">⭐</span>
              Featured Schemes
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredSchemes.map((scheme, index) => (
                <div
                  key={scheme.id}
                  className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-1 border border-white/50 dark:border-gray-700/50 cursor-pointer"
                  onClick={() => setSelectedScheme(scheme)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={scheme.imageUrl}
                      alt={scheme.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(scheme.category)}`}>
                        {scheme.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(scheme.priority)}`}>
                        {scheme.priority} Priority
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
                      {scheme.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {scheme.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>👥 {scheme.beneficiaries}</span>
                        <span>💰 {scheme.budget}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 dark:text-green-400 font-medium">{scheme.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Schemes Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-3">📋</span>
            All Schemes ({regularSchemes.length} schemes)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularSchemes.map((scheme, index) => (
              <div
                key={scheme.id}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-1 border border-white/50 dark:border-gray-700/50 cursor-pointer"
                onClick={() => setSelectedScheme(scheme)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={scheme.imageUrl}
                    alt={scheme.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(scheme.category)}`}>
                      {scheme.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(scheme.priority)}`}>
                      {scheme.priority}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                    {scheme.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {scheme.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-3">
                      <span>👥 {scheme.beneficiaries}</span>
                      <span>💰 {scheme.budget}</span>
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-medium">{scheme.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheme Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedScheme.imageUrl}
                  alt={selectedScheme.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  ✕
                </button>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedScheme.category)}`}>
                    {selectedScheme.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedScheme.priority)}`}>
                    {selectedScheme.priority} Priority
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedScheme.name}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Beneficiaries</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedScheme.beneficiaries}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Budget</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedScheme.budget}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedScheme.status}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedScheme.description}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Eligibility</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedScheme.eligibility}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Benefits</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedScheme.benefits}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Application Process</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedScheme.applicationProcess}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Required Documents</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedScheme.documents.map((doc, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setSelectedScheme(null)}
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
};

export default Schemes;
