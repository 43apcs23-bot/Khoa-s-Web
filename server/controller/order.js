import Order from "../models/order.js";
import productModel from "../models/productModel.js";

/* ===================== CREATE ORDER (USER) ===================== */
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      paymentMethod,
      shippingMethod,
      shippingInfo,
    } = req.body;

    const userId = req.userId; // set by auth middleware
    if (!userId) {
      return res.status(401).json({ message: 'Bạn cần đăng nhập' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Đơn hàng trống" });
    }

    let totalAmount = 0;

    // ✅ check tồn kho + trừ kho
    for (const item of items) {
      const product = await productModel.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Sản phẩm không tồn tại",
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.title}" không đủ số lượng`,
        });
      }

      product.quantity -= item.quantity;
      product.sold += item.quantity;
      await product.save();

      totalAmount += item.price * item.quantity;
    }

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      paymentMethod,
      shippingMethod,
      shippingInfo,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      data: savedOrder,
      message: "Đặt hàng thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Không thể tạo đơn hàng",
    });
  }
};

/* ===================== GET USER ORDERS ===================== */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Bạn cần đăng nhập' });
    }

    const orders = await Order.find({ userId })
      .populate("items.productId", "title price selectedFile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Không thể lấy danh sách đơn hàng",
    });
  }
};

/* ===================== GET ORDER BY ID ===================== */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("userId", "name email")
      .populate("items.productId", "title price selectedFile");

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.status(200).json({
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Không thể lấy chi tiết đơn hàng",
    });
  }
};

/* ===================== ADMIN: GET ALL ORDERS ===================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Không thể lấy danh sách đơn hàng",
    });
  }
};

/* ===================== ADMIN: UPDATE ORDER STATUS ===================== */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, shippingStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        paymentStatus,
        shippingStatus,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.status(200).json({
      data: updatedOrder,
      message: "Cập nhật trạng thái đơn hàng thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: "Không thể cập nhật đơn hàng",
    });
  }
};

/* ===================== ADMIN: CANCEL ORDER (ROLLBACK STOCK) ===================== */
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // rollback kho
    for (const item of order.items) {
      const product = await productModel.findById(item.productId);
      if (product) {
        product.quantity += item.quantity;
        product.sold -= item.quantity;
        await product.save();
      }
    }

    order.shippingStatus = "CANCELLED";
    order.paymentStatus = "FAILED";
    await order.save();

    res.status(200).json({
      message: "Đã hủy đơn và hoàn kho",
    });
  } catch (error) {
    res.status(500).json({
      message: "Không thể hủy đơn hàng",
    });
  }
};
