// utils/jwtToken.js

const sendToken = (user, statusCode, token, res) => {
  // Send token directly in the response body
  res.status(statusCode).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
