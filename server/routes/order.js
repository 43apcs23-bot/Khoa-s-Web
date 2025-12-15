import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  userCancelOrder,
  userCompleteOrder,
  advanceOrder
} from "../controller/order.js";

import { auth, checkAdmin } from "../middleware/auth.js";

const router = express.Router();

/* ===================== USER ===================== */

// tạo đơn hàng
router.post("/", auth, createOrder);

// xem đơn hàng của user hiện tại
router.get("/my-orders", auth, getMyOrders);

// xem chi tiết 1 đơn (user hoặc admin)
router.get("/:id", auth, getOrderById);


/* ===================== ADMIN ===================== */

// xem tất cả đơn hàng
router.get("/", auth, checkAdmin, getAllOrders);

// cập nhật trạng thái đơn
router.patch("/:id/status", auth, checkAdmin, updateOrderStatus);

// cancel (admin-only)
router.post("/:id/cancel", auth, checkAdmin, cancelOrder);
// user cancel request (owner only, allowed when status is 'Chờ xác nhận')
router.post("/:id/cancel-request", auth, userCancelOrder);
router.post("/:id/complete", auth, userCompleteOrder);
// admin advance
router.post("/:id/advance", auth, checkAdmin, advanceOrder);

export default router;
