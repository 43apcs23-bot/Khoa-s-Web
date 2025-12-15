import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import verifyUser from "../models/valideUser.js";
import { CheckoutEmail, sendEmail } from "../Utils/nodemailer.js";
import Order from '../models/order.js';
import Product from '../models/productModel.js';
import { APIfeatures } from './paginate.js';

const generateToken = (data) => {
    const { email, name, role, wishlist, number, address, cart } = data;
    return jwt.sign(
        { email, name, role, wishlist, number, address, cart },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const generateSessionToken = (data, res) => {
    const { _id, role } = data;
    const token = jwt.sign(
        { _id, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.cookie('token', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: 'strict'
    });
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser)
            return res.status(404).json({ message: "Người dùng không tồn tại" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Thông tin đăng nhập không hợp lệ" });

        const token = generateToken(existingUser);

        if (!existingUser?.verifiedUser) {
            let checkVerify = await verifyUser.findOne({ userId: existingUser._id });
            if (!checkVerify) {
                checkVerify = await new verifyUser({
                    userId: existingUser._id,
                    token: token,
                }).save();

                const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/+$/g, '');
                const url = `${baseUrl}/user/${existingUser._id}/verify/${checkVerify.token}`;

                sendEmail(existingUser.email, "Xác minh email từ Shoes Store", url);
                return res.status(355).json({ message: "Vui lòng xác minh email của bạn" });
            }

            return res.status(355).send({
                message: "Link xác minh đã được gửi, vui lòng kiểm tra email"
            });
        }

        generateSessionToken(existingUser, res);

        const time = new Date().getHours();
        let greeting;
        if (time >= 5 && time < 12) greeting = "Chào buổi sáng";
        else if (time >= 12 && time < 17) greeting = "Chào buổi chiều";
        else if (time >= 17 && time < 20) greeting = "Chào buổi tối";
        else greeting = "Chúc ngủ ngon";

        existingUser.role === true
            ? res.status(200).json({
                token,
                message: `${greeting} & Chào mừng Quản trị viên, ${existingUser.name.split(" ")[0]}`
            })
            : res.status(200).json({
                token,
                message: `${greeting} & Chào mừng bạn quay lại, ${existingUser.name.split(" ")[0]}`
            });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const signOut = async (req, res) => {
    const { userId } = req;
    try {
        if (!userId) {
            return res.status(400).json({ message: "Không tìm thấy người dùng" });
        }

        const userName = await User.findById(userId).select("name");
        res.clearCookie("token");

        res.status(200).json({
            message: `Tạm biệt, ${userName.name.split(" ")[0]}`
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const signup = async (req, res) => {
    const { email, password, firstName, number, lastName, role, address } = req.body;
    try {
        let existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Người dùng đã tồn tại" });

        if (firstName === "" || lastName === "" || email === "" || password === "") {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
        } else if (password.length < 6) {
            return res.status(400).json({
                message: "Mật khẩu phải có ít nhất 6 ký tự"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        existingUser = await new User({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
            number,
            role,
            address
        }).save();

        const createVerify = await new verifyUser({
            userId: existingUser._id,
            token: generateToken(existingUser),
        }).save();

        const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/+$/g, '');
        const url = `${baseUrl}/user/${existingUser._id}/verify/${createVerify.token}`;

        const { status } = await sendEmail(
            existingUser.email,
            "Xác minh email từ Shoes Store",
            url
        );

        if (status < 400) {
            res.status(200).json({
                message: "Đăng ký thành công. Vui lòng xác minh email"
            });
        } else {
            res.status(355).json({
                message: "Gửi email xác minh thất bại, vui lòng kiểm tra lỗi"
            });
        }
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const getVerified = async (req, res) => {
    const { userId, verifyId } = req.params;
    try {
        const user = await User.findOne({ _id: userId });
        if (!user)
            return res.status(404).json({ message: "Không tìm thấy người dùng" });

        const Verified = await verifyUser.findOne({
            userId: user._id,
            token: verifyId,
        });

        if (!Verified)
            return res.status(404).json({ message: "Link xác minh không hợp lệ" });

        await User.updateOne({ _id: user._id }, { verifiedUser: true });
        await Verified.remove();

        const token = generateToken(user);
        generateSessionToken(user, res);

        user.role === 1
            ? res.status(200).json({
                token,
                message: `Chào mừng Quản trị viên, ${user.name.split(" ")[0]}`,
                verifyMessage: "Email đã được xác minh"
            })
            : res.status(200).json({
                token,
                message: `Chào mừng bạn quay lại, ${user.name.split(" ")[0]}`,
                verifyMessage: "Email đã được xác minh"
            });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const addWishlist = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ message: "Không tìm thấy người dùng" });

        const checkWishlist = user.wishlist.find((item) => item === id);
        if (checkWishlist) {
            return res.status(400).json({
                data: user.wishlist,
                message: "Sản phẩm đã có trong danh sách yêu thích"
            });
        } else {
            user.wishlist.push(id);
            await user.save();
            const token = generateToken(user);
            res.status(200).json({
                token,
                data: user.wishlist,
                message: "Đã thêm sản phẩm vào danh sách yêu thích"
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeWishlist = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ message: "Không tìm thấy người dùng" });

        const checkWishlist = user.wishlist.find((item) => item === id);
        if (!checkWishlist) {
            return res.status(400).json({
                data: user.wishlist,
                message: "Sản phẩm không có trong danh sách yêu thích"
            });
        }

        user.wishlist = user.wishlist.filter((item) => item !== id);
        await user.save();

        const token = generateToken(user);
        res.status(200).json({
            token,
            data: user.wishlist,
            message: "Đã xoá sản phẩm khỏi danh sách yêu thích"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ message: "Không tìm thấy người dùng" });

        req.query.page = parseInt(req.query.page);
        req.query.limit = parseInt(req.query.limit);

        const features = new APIfeatures(
            Product.find({ _id: { $in: user.wishlist } }),
            req.query
        ).sorting().paginating().filtering();

        const data = await features.query;
        const token = generateToken(user);

        res.status(200).json({ token, data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ message: "Không tìm thấy người dùng" });

        // Admins do not have a cart
        if (user.role === true) {
            return res.status(403).json({ message: "Quản trị viên không có giỏ hàng" });
        }

        const products = await Product.find({
            _id: { $in: user.cart.map((item) => item.cartId) }
        });

        const token = generateToken(user);
        res.status(200).json({ token, data: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addCart = async (req, res) => {
    const { id } = req.params;
    const { quantity = 1 } = req.body;
    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ message: "Không tìm thấy người dùng" });

        // Admins cannot add to cart
        if (user.role === true) {
            return res.status(403).json({ message: "Quản trị viên không thể thêm sản phẩm vào giỏ hàng" });
        }

        const checkCart = user.cart.find((item) => item.cartId === id);
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ data: user.cart, message: 'Sản phẩm không tồn tại' });
        }

        if (product.quantity === 0) {
            return res.status(400).json({ data: user.cart, message: "Sản phẩm đã hết hàng" });
        }

        if (checkCart) {
            // overwrite quantity with requested amount (bounded by stock)
            const newQty = Math.min(quantity, product.quantity);
            user.cart = user.cart.map(item => item.cartId === id ? { ...item._doc ? item._doc : item, quantity: newQty } : item);
            await user.save();
            const token = generateToken(user);
            return res.status(200).json({ token, data: user.cart, message: "Cập nhật số lượng sản phẩm trong giỏ hàng" });
        }

        // add new item with requested quantity (bounded by stock)
        const addQty = Math.min(quantity, product.quantity);
        user.cart.push({ cartId: id, quantity: addQty });
        await user.save();

        const token = generateToken(user);
        res.status(200).json({ token, data: user.cart, message: "Đã thêm sản phẩm vào giỏ hàng" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeCart = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ message: "Không tìm thấy người dùng" });

        const checkCart = user.cart.find((item) => item.cartId === id);
        if (!checkCart) {
            return res.status(400).json({
                data: user.cart,
                message: "Sản phẩm không có trong giỏ hàng"
            });
        } else {
            user.cart = user.cart.filter((item) => item.cartId !== id);
            await user.save();

            const token = generateToken(user);
            res.status(200).json({
                token,
                data: user.cart,
                message: "Đã xoá sản phẩm khỏi giỏ hàng"
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cartQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findById(req.userId);
        if (!user)
            return res.status(400).json({ message: "Người dùng không tồn tại" });

        const product = await Product.findById(id);
        const quantity = user.cart.find((item) => item.cartId === id).quantity;

        if (status === "increase") {
            if (product.quantity <= quantity) {
                return res.status(400).json({ message: "Sản phẩm đã hết hàng" });
            }
        }

        const checkCart = user.cart.find((item) => item.cartId === id);
        if (!checkCart) {
            return res.status(400).json({
                data: user.cart,
                message: "Sản phẩm không có trong giỏ hàng"
            });
        } else {
            if (status === "increase") {
                user.cart = user.cart.map((item) => {
                    if (item.cartId === id) {
                        item.quantity = item.quantity + 1;
                    }
                    return item;
                });
            } else {
                user.cart = user.cart.map((item) => {
                    if (item.cartId === id) {
                        if (item.quantity !== 1) {
                            item.quantity = item.quantity - 1;
                        }
                    }
                    return item;
                });
            }

            await User.findByIdAndUpdate(
                { _id: req.userId },
                { cart: user.cart }
            );

            const token = generateToken(user);
            res.status(200).json({
                token,
                data: user.cart,
                message: "Đã cập nhật số lượng sản phẩm trong giỏ hàng"
            });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const checkout = async (req, res) => {
    try {
        const { total, shippingInfo, paymentMethod, items } = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        // Admins cannot checkout
        if (user.role === true) {
            return res.status(403).json({ message: "Quản trị viên không thể thực hiện thanh toán" });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng trống" });
        }

        // Determine which items to checkout: either provided items (cartId + quantity) or entire cart
        const checkoutItems = (items && items.length) ?
            items.map(i => ({ cartId: i.cartId, quantity: i.quantity })) :
            user.cart.map(c => ({ cartId: c.cartId, quantity: c.quantity }));

        // 1. Lấy danh sách sản phẩm cho checkout
        const products = await Product.find({
            _id: { $in: checkoutItems.map(item => item.cartId) }
        });

        // 2. Map để dễ truy xuất
        const productMap = new Map();
        products.forEach(p => productMap.set(p._id.toString(), p));

        // 3. Kiểm tra tồn kho cho từng item trong checkoutItems
        for (const item of checkoutItems) {
            const product = productMap.get(item.cartId);

            if (!product) {
                return res.status(404).json({
                    message: "Có sản phẩm trong giỏ không còn tồn tại"
                });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    code: "OUT_OF_STOCK",
                    productId: product._id,
                    available: product.quantity,
                    requested: item.quantity,
                    message: `Sản phẩm "${product.title}" không đủ số lượng`
                });
            }
        }

        // 4. Trừ tồn kho cho từng item trong checkoutItems
        for (const item of checkoutItems) {
            await Product.findByIdAndUpdate(
                item.cartId,
                { $inc: { quantity: -item.quantity } }
            );
        }

        // 5. Tạo đơn hàng từ checkoutItems
        const orderItems = checkoutItems.map(item => {
            const p = productMap.get(item.cartId);
            return {
                productId: p._id,
                title: p.title,
                price: p.price,
                quantity: item.quantity
            };
        });

        const pm = (paymentMethod || 'OFFLINE').toUpperCase();
        const newOrderData = {
            userId: user._id,
            items: orderItems,
            totalAmount: total,
            paymentMethod: pm,
            shippingInfo: shippingInfo || user.address || {}
        };

        // demo behavior: online payments are auto-marked PAID; offline remain UNPAID until delivery
        if (pm === 'ONLINE') {
            newOrderData.paymentStatus = 'PAID';
            newOrderData.transactionId = `demo-online-${Date.now()}`;
        }

        // if offline and order exceeds 1,000,000 VND, require a 20% deposit (informational only)
        if (pm === 'OFFLINE' && Number(total) > 1000000) {
            newOrderData.depositRequired = true;
            newOrderData.depositAmount = Math.ceil(Number(total) * 0.2);
        }

        const newOrder = new Order(newOrderData);

        const savedOrder = await newOrder.save();

        // 5. Gửi email (gửi đúng các sản phẩm đã mua)
        CheckoutEmail(
            "Tóm tắt đơn hàng",
            user,
            total,
            checkoutItems,
            products
        );

        // 6. Xoá các sản phẩm đã mua khỏi giỏ hàng (nếu mua toàn bộ, sẽ xoá hết)
        if (items && items.length) {
            user.cart = user.cart.filter(c => !checkoutItems.some(ci => ci.cartId === c.cartId));
        } else {
            user.cart = [];
        }
        await user.save();

        const token = generateToken(user);

        res.status(200).json({
            token,
            data: savedOrder,
            message: "Thanh toán thành công, vui lòng kiểm tra email để xem chi tiết"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
