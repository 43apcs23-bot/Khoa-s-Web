import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserDetails",
      required: true,
    },

    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    /* ================= PAYMENT ================= */
    paymentMethod: {
      type: String,
      enum: ["COD", "MOMO", "BANK", "CARD", "ONLINE", "OFFLINE"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "UNPAID",
    },

    transactionId: {
      type: String, // MoMo / Bank transaction id
    },

    // deposit/demo fields (optional)
    depositAmount: {
      type: Number,
    },
    depositRequired: {
      type: Boolean,
      default: false,
    },

    shippingStatus: {
      type: String,
      enum: [
        "Chờ xác nhận",
        "Đang xử lý",
        "Đang vận chuyển",
        "Giao hàng thành công",
        "Đã hủy",
        "Hoàn thành",
      ],
      default: "Chờ xác nhận",
    },

    // cancellation info
    cancelReason: {
      type: String,
    },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "UserDetails",
    },
    cancelledAt: {
      type: Date,
    },

    // completion info
    completedBy: {
      type: Schema.Types.ObjectId,
      ref: "UserDetails",
    },
    completedAt: {
      type: Date,
    },

    shippingFee: {
      type: Number,
      default: 0,
    },

    shippingInfo: {
      name: String,
      phone: String,
      address: String,
      note: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index to optimize queries for user orders sorted by newest
orderSchema.index({ userId: 1, _id: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
