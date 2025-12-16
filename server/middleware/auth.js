import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/"
};

const auth = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) token = req.cookies.token;

    if (!token && req.headers?.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") token = parts[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại"
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData?._id;
    next();
  } catch (error) {
    res.clearCookie("token", cookieOptions);
    res.status(440).json({
      message: "Xin lỗi, bạn không có quyền truy cập"
    });
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    if (!req.cookies?.token) {
      return res.status(401).json({
        message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại"
      });
    }

    const cookie = req.cookies.token;
    const decodedData = jwt.verify(cookie, process.env.JWT_SECRET);

    if (decodedData?.role === true) {
      req.userId = decodedData?._id;
      next();
    } else {
      res.status(440).json({
        message: "Bạn không có quyền quản trị"
      });
    }
  } catch (error) {
    res.clearCookie("token", cookieOptions);
    res.status(440).json({
      message: "Xác thực thất bại, vui lòng đăng nhập lại"
    });
  }
};

export { auth, checkAdmin };
