// utils/jwtToken.js

const sendToken = (user, statusCode, token, res) => {
  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Makes it inaccessible to JavaScript
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'none', // Changed from 'lax' to 'none' for cross-domain requests
    path: '/',
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
