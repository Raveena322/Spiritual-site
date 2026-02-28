const roleCheck = (...roles) => {
  return (req, res, next) => {
    console.log('\n🔵 === ROLE CHECK MIDDLEWARE ===');
    console.log('Required roles:', roles);
    console.log('User role:', req.user?.role);
    console.log('req.body at roleCheck:', req.body);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }

    console.log('✅ Role check passed');
    next();
  };
};

module.exports = roleCheck;

