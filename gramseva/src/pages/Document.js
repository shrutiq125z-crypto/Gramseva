import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const Document = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const documentTypes = [
    {
      id: 'aadhar',
      name: 'Aadhar Card',
      description: 'Government issued identity document',
      icon: '🆔',
      color: 'from-blue-500 to-blue-600',
      requirements: ['Photo', 'Address Proof', 'Identity Proof']
    },
    {
      id: 'pan',
      name: 'PAN Card',
      description: 'Permanent Account Number for tax purposes',
      icon: '💳',
      color: 'from-green-500 to-green-600',
      requirements: ['Photo', 'Identity Proof', 'Address Proof']
    },
    {
      id: 'driving',
      name: 'Driving License',
      description: 'License to operate motor vehicles',
      icon: '🚗',
      color: 'from-purple-500 to-purple-600',
      requirements: ['Photo', 'Age Proof', 'Address Proof', 'Medical Certificate']
    },
    {
      id: 'passport',
      name: 'Passport',
      description: 'International travel document',
      icon: '📘',
      color: 'from-red-500 to-red-600',
      requirements: ['Photo', 'Birth Certificate', 'Address Proof', 'Identity Proof']
    },
    {
      id: 'voter',
      name: 'Voter ID Card',
      description: 'Electoral identification document',
      icon: '🗳️',
      color: 'from-orange-500 to-orange-600',
      requirements: ['Photo', 'Age Proof', 'Address Proof']
    },
    {
      id: 'ration',
      name: 'Ration Card',
      description: 'Food security card for subsidized food',
      icon: '🍞',
      color: 'from-yellow-500 to-yellow-600',
      requirements: ['Photo', 'Address Proof', 'Family Details']
    },
    {
      id: 'birth',
      name: 'Birth Certificate',
      description: 'Official record of birth',
      icon: '👶',
      color: 'from-pink-500 to-pink-600',
      requirements: ['Hospital Records', 'Parent Details', 'Witness']
    },
    {
      id: 'marriage',
      name: 'Marriage Certificate',
      description: 'Legal proof of marriage',
      icon: '💒',
      color: 'from-indigo-500 to-indigo-600',
      requirements: ['Photo', 'Witness Details', 'Age Proof', 'Address Proof']
    }
  ];

  // Fetch available agents
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://gramseva-backend-8idx.onrender.com/api/users/agents', {
        headers: {
          'user-id': localStorage.getItem('userId')
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      } else {
        // Fallback mock data if API fails
        setAgents([
          {
            _id: '1',
            username: 'Rajesh Kumar',
            role: 'agent',
            phoneNo: '+91 98765 43210',
            rating: 4.8,
            experience: '5 years',
            specializations: ['Aadhar', 'PAN', 'Driving License']
          },
          {
            _id: '2',
            username: 'Priya Sharma',
            role: 'agent',
            phoneNo: '+91 87654 32109',
            rating: 4.9,
            experience: '7 years',
            specializations: ['Passport', 'Voter ID', 'Birth Certificate']
          },
          {
            _id: '3',
            username: 'Amit Singh',
            role: 'agent',
            phoneNo: '+91 76543 21098',
            rating: 4.7,
            experience: '4 years',
            specializations: ['Ration Card', 'Marriage Certificate', 'Aadhar']
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to load agents. Using sample data.',
        type: 'warning'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
    setSelectedAgent(null);
    setIsConnected(false);
  };

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
  };

  const handleConnect = async () => {
    if (!selectedDocument || !selectedAgent) return;

    try {
      setIsLoading(true);
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      addNotification({
        title: 'Success',
        message: `Connected to ${selectedAgent.username} for ${selectedDocument.name} assistance`,
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to connect with agent',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSelection = () => {
    setSelectedDocument(null);
    setSelectedAgent(null);
    setIsConnected(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Document Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose the document you want to create and get connected with our certified agents for assistance
          </p>
        </div>

        {!selectedDocument ? (
          /* Document Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documentTypes.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocumentSelect(doc)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 group-hover:border-transparent group-hover:shadow-2xl transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${doc.color} flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    {doc.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    {doc.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-4">
                    {doc.description}
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Required Documents:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {doc.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !selectedAgent ? (
          /* Agent Selection */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedDocument.color} flex items-center justify-center text-2xl`}>
                    {selectedDocument.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedDocument.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Choose an agent to help you with this document
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetSelection}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ← Back
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                agents.map((agent) => (
                  <div
                    key={agent._id}
                    onClick={() => handleAgentSelect(agent)}
                    className={`cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                      selectedAgent?._id === agent._id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {agent.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {agent.username}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {agent.role}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Rating</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {agent.rating}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Experience</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {agent.experience}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Phone</span>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {agent.phoneNo}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Specializations:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {agent.specializations?.map((spec, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedAgent && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    'Connect with Agent'
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Connection Success */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                ✅
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Successfully Connected!
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                You have been connected with <span className="font-bold text-blue-600 dark:text-blue-400">
                  {selectedAgent.username}
                </span> for assistance with your <span className="font-bold text-purple-600 dark:text-purple-400">
                  {selectedDocument.name}
                </span> application.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Next Steps:
                </h3>
                <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Agent will contact you within 24 hours</li>
                  <li>• Prepare the required documents</li>
                  <li>• Follow the agent's guidance for application process</li>
                  <li>• Track your application status through the dashboard</li>
                </ul>
              </div>
              
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={resetSelection}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Start New Request
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Document;
