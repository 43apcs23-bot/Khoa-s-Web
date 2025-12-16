import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // Prefer cookie-based session token (works for same-site setups)
    let token = null;
    if (req.cookies && req.cookies.token) token = req.cookies.token;

    // Fallback to Authorization header Bearer token for cross-origin setups
    if (!token && req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') token = parts[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedData) {
      req.userId = decodedData?._id;
      next();
    } else {
      // if invalid, clear cookie and deny
      res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/' });
      return res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ' });
    }
  } catch (error) {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/' });
    res.status(440).json({
      message: "Xin lỗi, bạn không có quyền truy cập"
    });
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    // same token detection as `auth`: prefer cookie, fallback to Authorization header
    let token = null;
    if (req.cookies && req.cookies.token) token = req.cookies.token;
    if (!token && req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') token = parts[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' });
    }

    let decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedData?.role === true) {
      req.userId = decodedData?._id;
      next();
    } else {
      return res.status(440).json({ message: 'Bạn không có quyền quản trị' });
    }
  } catch (error) {
    res.status(440).json({
      message: "Xác thực thất bại, vui lòng đăng nhập lại"
    });
  }
};

export { auth, checkAdmin };
