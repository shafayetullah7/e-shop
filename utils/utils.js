const jwt = require('jsonwebtoken');

const authMiddleware = (requiredRole) => (req, res, next) => {
  // Check if the request has a valid JWT token
  const authorization = req.header('Authorization');
  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token and extract user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = decoded;

    // If a role is required, check if the user has the required role
    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    // Allow the request to proceed
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = {authMiddleware};
