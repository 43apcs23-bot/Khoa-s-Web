import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../statemanagement/slice/orderSlice";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((state) => state.order);

  const [activeTab, setActiveTab] = useState("uncompleted");

  useEffect(() => {
    dispatch(getMyOrders({ limit: 6 }));
  }, [dispatch]);

  const completedOrders = myOrders?.filter(
    (o) => o.shippingStatus === "DELIVERED"
  );

  const uncompletedOrders = myOrders?.filter(
    (o) => o.shippingStatus !== "DELIVERED"
  );

  return (
    <div className="container mx-auto px-4 min-h-[800px]">
      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <SummaryBox
          title="Đơn hoàn thành"
          value={completedOrders?.length || 0}
          color="bg-green-500"
        />
        <SummaryBox
          title="Đơn chưa hoàn thành"
          value={uncompletedOrders?.length || 0}
          color="bg-rose-500"
        />
      </div>

      {/* ===== ORDERS BOX ===== */}
      <div className="mt-8 bg-white rounded-xl shadow p-4">
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <TabButton
            active={activeTab === "uncompleted"}
            onClick={() => setActiveTab("uncompleted")}
            label="Chưa hoàn thành"
          />
          <TabButton
            active={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
            label="Hoàn thành"
          />
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center py-10">Đang tải đơn hàng...</p>
        ) : (
          <div className="space-y-4">
            {(activeTab === "completed"
              ? completedOrders
                  ?.slice()
                  ?.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  )
              : uncompletedOrders
            )?.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;


const SummaryBox = ({ title, value, color }) => {
  return (
    <div className={`${color} text-white rounded-xl p-6`}>
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

const TabButton = ({ active, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition
        ${
          active
            ? "border-b-2 border-rose-600 text-rose-600"
            : "text-gray-500"
        }`}
    >
      {label}
    </button>
  );
};


const OrderCard = ({ order }) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">Mã đơn: {order._id.slice(-6)}</p>
        <p className="text-sm text-gray-500">
          Ngày: {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm">
          Trạng thái:{" "}
          <span className="font-medium">
            {order.shippingStatus}
          </span>
        </p>
      </div>

      <div className="mt-3 sm:mt-0 text-rose-600 font-semibold">
        VND {order.totalAmount}
      </div>
    </div>
  );
};
