import Order from "../models/order.js";
import productModel from "../models/productModel.js";
import User from "../models/user.js";

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

    const user = await User.findById(userId);
    if (user?.role === true) {
      return res.status(403).json({ message: 'Quản trị viên không thể tạo đơn hàng' });
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
import mongoose from 'mongoose'

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Bạn cần đăng nhập' });
    }

    // cursor-based pagination: client sends `limit` and `cursor` (last _id from previous page)
    let { limit = 10, cursor } = req.query;
    limit = Math.min(Number(limit) || 10, 50); // cap to 50

    const { q } = req.query

    const query = { userId };
    if (q && q.trim().length > 0) {
      // search by item title snapshot stored in order.items.title
      query['items.title'] = { $regex: q.trim(), $options: 'i' };
    }

    if (cursor) {
      // only add cursor filter if cursor is a valid ObjectId
      try {
        query._id = { $lt: mongoose.Types.ObjectId(cursor) };
      } catch (e) {
        // invalid cursor - ignore and return first page
      }
    }

    // fetch one extra to determine hasMore
    const docs = await Order.find(query)
      .populate("items.productId", "title price selectedFile")
      .sort({ _id: -1 })
      .limit(limit + 1);

    let hasMore = false;

    if (docs.length > limit) {
      hasMore = true;
      docs.pop(); // trim to requested limit
    }

    const nextCursor = docs.length ? docs[docs.length - 1]._id : null;

    res.status(200).json({
      data: docs,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error(error);
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
      .populate("items.productId", "title price selectedFile")
      .populate("cancelledBy", "name")
      .populate("completedBy", "name");
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
    let { limit = 20, cursor, q } = req.query
    limit = Math.min(Number(limit) || 20, 100)

    const query = {}
    if (q && q.trim().length > 0) {
      query['items.title'] = { $regex: q.trim(), $options: 'i' }
    }

    if (cursor) {
      try {
        query._id = { $lt: mongoose.Types.ObjectId(cursor) }
      } catch (e) {}
    }

    const docs = await Order.find(query)
      .populate("userId", "name email")
      .sort({ _id: -1 })
      .limit(limit + 1)

    let hasMore = false
    if (docs.length > limit) {
      hasMore = true
      docs.pop()
    }

    const nextCursor = docs.length ? docs[docs.length - 1]._id : null

    res.status(200).json({ data: docs, nextCursor, hasMore })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Không thể lấy danh sách đơn hàng" })
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
    const { reason } = req.body;
    // Admin-only cancel (kept for backward compatibility)
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // prevent cancelling delivered/completed orders or already cancelled
    if (order.shippingStatus === "Giao hàng thành công" || order.shippingStatus === "Hoàn thành") {
      return res.status(400).json({ message: "Không thể hủy đơn đã giao hoặc đã hoàn thành" });
    }
    if (order.shippingStatus === "Đã hủy") {
      return res.status(400).json({ message: "Đơn hàng đã được hủy" });
    }

    // rollback stock
    for (const item of order.items) {
      const product = await productModel.findById(item.productId);
      if (product) {
        product.quantity += item.quantity;
        product.sold = Math.max(0, product.sold - item.quantity);
        await product.save();
      }
    }

    order.shippingStatus = "Đã hủy";
    order.paymentStatus = "FAILED";
    order.cancelReason = reason || order.cancelReason || "Cancelled by admin";
    order.cancelledBy = req.userId;
    order.cancelledAt = new Date();
    await order.save();

    res.status(200).json({ data: order, message: "Đã hủy đơn và hoàn kho" });
  } catch (error) {
    res.status(500).json({
      message: "Không thể hủy đơn hàng",
    });
  }
};

/* ===================== USER: CANCEL ORDER (with reason) ===================== */
export const userCancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(req.userId);
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    const isOwner = order.userId.toString() === req.userId.toString();
    if (!isOwner) return res.status(403).json({ message: "Bạn không có quyền" });

    // owner can only cancel when status is 'Chờ xác nhận'
    if (order.shippingStatus !== "Chờ xác nhận") {
      return res.status(400).json({ message: "Chỉ có thể hủy khi trạng thái là 'Chờ xác nhận'" });
    }

    // rollback stock
    for (const item of order.items) {
      const product = await productModel.findById(item.productId);
      if (product) {
        product.quantity += item.quantity;
        product.sold = Math.max(0, product.sold - item.quantity);
        await product.save();
      }
    }

    order.shippingStatus = "Đã hủy";
    order.paymentStatus = "FAILED";
    order.cancelReason = reason || "";
    order.cancelledBy = req.userId;
    order.cancelledAt = new Date();
    await order.save();

    res.status(200).json({ data: order, message: "Đơn hàng đã được hủy" });
  } catch (error) {
    res.status(500).json({ message: "Không thể hủy đơn hàng" });
  }
};

/* ===================== USER: MARK COMPLETE ===================== */
export const userCompleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.userId);
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    const isOwner = order.userId.toString() === req.userId.toString();
    if (!isOwner) return res.status(403).json({ message: "Bạn không có quyền" });

    if (order.shippingStatus !== "Giao hàng thành công") {
      return res.status(400).json({ message: "Chỉ có thể hoàn thành khi trạng thái là 'Giao hàng thành công'" });
    }

    order.shippingStatus = "Hoàn thành";
    order.completedBy = req.userId;
    order.completedAt = new Date();
    await order.save();

    res.status(200).json({ data: order, message: "Đơn hàng đã hoàn thành" });
  } catch (error) {
    res.status(500).json({ message: "Không thể hoàn thành đơn hàng" });
  }
};

/* ===================== ADMIN: ADVANCE SHIPPING STATUS ===================== */
export const advanceOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    const seq = [
      "Chờ xác nhận",
      "Đang xử lý",
      "Đang vận chuyển",
      "Giao hàng thành công",
    ];

    const idx = seq.indexOf(order.shippingStatus);
    if (idx === -1) {
      return res.status(400).json({ message: "Trạng thái hiện tại không thể chuyển tiếp" });
    }

    if (order.shippingStatus === "Giao hàng thành công") {
      return res.status(400).json({ message: "Không thể chuyển tiếp trạng thái sau khi đã giao" });
    }

    const next = seq[idx + 1];
    if (!next) return res.status(400).json({ message: "Không có trạng thái tiếp theo" });

    order.shippingStatus = next;
    // If order is delivered and payment was offline, mark as paid
    if (next === 'Giao hàng thành công' && order.paymentMethod === 'OFFLINE' && order.paymentStatus !== 'PAID') {
      order.paymentStatus = 'PAID';
      order.transactionId = `demo-offline-${Date.now()}`;
    }
    await order.save();

    res.status(200).json({ data: order, message: `Đã chuyển trạng thái sang '${next}'` });
  } catch (error) {
    res.status(500).json({ message: "Không thể chuyển trạng thái đơn hàng" });
  }
};
