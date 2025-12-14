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
      enum: ["COD", "MOMO", "BANK", "CARD"],
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

    shippingStatus: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "SHIPPING",
        "DELIVERED",
        "CANCELLED",
        "RETURNED",
      ],
      default: "PENDING",
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

const Order = mongoose.model("Order", orderSchema);
export default Order;
