import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
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

export default router;
