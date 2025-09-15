// UPDATE YOUR EXISTING AUTHENTICATION MIDDLEWARE
// Replace your current authenticateUser middleware with this enhanced version

// Enhanced Middleware to check if user is authenticated (supports both header and body auth)
const authenticateUser = async (req, res, next) => {
  try {
    // Check for user-id in header OR in request body
    const userId = req.headers['user-id'] || req.body.userId || req.body.currentUserId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

app.use((req, res, next) => {
    // Allow requests from localhost (development) and your deployed frontend
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://gramseva-frontend.onrender.com',
        'https://gramseva.vercel.app',
        'https://gramseva.netlify.app'
    ];
    
    const origin = req.headers.origin;
    
    // Allow requests from allowed origins or if no origin (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // Add 'user-id' to allowed headers
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, user-id');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    next();
});