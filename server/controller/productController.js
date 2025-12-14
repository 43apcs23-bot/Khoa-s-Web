import productModel from "../models/productModel.js";
import { APIfeatures } from "./paginate.js";

/* ===================== GET PRODUCT PAGE ===================== */
export const getproductPage = async (req, res) => {
  try {
    req.query.page = parseInt(req.query.page);
    req.query.limit = parseInt(req.query.limit);

    const features = new APIfeatures(productModel.find(), req.query)
      .sorting()
      .paginating()
      .filtering();

    const data = await features.query;
    const paginateRemaining = features.paginate;

    const runnning = await productModel
      .find(features.queryString)
      .find({ shoeFor: "Running" })
      .skip(paginateRemaining.skip)
      .limit(paginateRemaining.limit);

    const lounging = await productModel
      .find(features.queryString)
      .find({ shoeFor: "Lounging" })
      .skip(paginateRemaining.skip)
      .limit(paginateRemaining.limit);

    const everyday = await productModel
      .find(features.queryString)
      .find({ shoeFor: "Everyday" })
      .skip(paginateRemaining.skip)
      .limit(paginateRemaining.limit);

    res.status(200).json({
      data,
      runnning,
      lounging,
      everyday,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Không thể lấy danh sách sản phẩm" });
  }
};

/* ===================== TOP PRODUCTS ===================== */
export const getTopProducts = async (req, res) => {
  try {
    const data = await productModel.find({}).sort({ sold: -1 }).limit(12);
    res.json({ data });
  } catch (error) {
    res.status(404).json({
      message: "Không thể lấy danh sách sản phẩm bán chạy",
    });
  }
};

/* ===================== CREATE PRODUCT ===================== */
export const createproductPage = async (req, res) => {
  const {
    title,
    description,
    selectedFile,
    price,
    category,
    quantity,
    shoeFor,
    brand,
  } = req.body;

  try {
    if (!title || !description) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc",
      });
    }

    const defaultImage =
      process.env.SERVER_DEFAULT_IMAGE || "/default-product.png";
    const finalSelectedFile =
      selectedFile && selectedFile.length
        ? selectedFile
        : [defaultImage];

    if (!price) {
      return res.status(400).json({
        message: "Vui lòng nhập giá sản phẩm",
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Vui lòng chọn danh mục sản phẩm",
      });
    }

    if (!quantity) {
      return res.status(400).json({
        message: "Vui lòng nhập số lượng sản phẩm",
      });
    }

    if (!shoeFor) {
      return res.status(400).json({
        message: "Vui lòng chọn mục đích sử dụng giày",
      });
    }

    if (!brand) {
      return res.status(400).json({
        message: "Vui lòng chọn thương hiệu",
      });
    }

    const productPageData = new productModel({
      title,
      description,
      selectedFile: finalSelectedFile,
      price,
      category,
      quantity,
      shoeFor,
      brand,
    });

    const savedproductPage = await productPageData.save();

    res.status(200).json({
      data: savedproductPage,
      message: `Sản phẩm "${savedproductPage.title}" đã được tạo thành công`,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

/* ===================== UPDATE PRODUCT ===================== */
export const updateProductById = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    selectedFile,
    price,
    category,
    quantity,
    shoeFor,
    brand,
  } = req.body;

  try {
    if (!title || !description) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc",
      });
    }

    const defaultImage =
      process.env.SERVER_DEFAULT_IMAGE || "/default-product.png";
    const finalSelectedFileUpdate =
      selectedFile && selectedFile.length
        ? selectedFile
        : [defaultImage];

    if (!price) {
      return res.status(400).json({
        message: "Vui lòng nhập giá sản phẩm",
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Vui lòng chọn danh mục sản phẩm",
      });
    }

    if (!quantity) {
      return res.status(400).json({
        message: "Vui lòng nhập số lượng sản phẩm",
      });
    }

    if (!shoeFor) {
      return res.status(400).json({
        message: "Vui lòng chọn mục đích sử dụng giày",
      });
    }

    if (!brand) {
      return res.status(400).json({
        message: "Vui lòng chọn thương hiệu",
      });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        selectedFile: finalSelectedFileUpdate,
        price,
        category,
        quantity,
        shoeFor,
        brand,
      },
      { new: true }
    );

    res.status(200).json({
      data: updatedProduct,
      message: `Sản phẩm "${updatedProduct.title}" đã được cập nhật thành công`,
    });
  } catch (error) {
    res.status(404).json({
      message: "Không thể cập nhật sản phẩm",
    });
  }
};

/* ===================== GET PRODUCT BY ID ===================== */
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const productById = await productModel.findById(id);
    res.json({
      data: productById,
      message: `Chi tiết sản phẩm: ${productById.title}`,
    });
  } catch (error) {
    res.status(404).json({
      message: "Không tìm thấy sản phẩm",
    });
  }
};

/* ===================== FILTER PRODUCT ===================== */
export const getfilterProduct = async (req, res) => {
  try {
    const data = await productModel.find({}).select("brand category");
    const pages = await productModel.find().countDocuments();
    const limit = 8;
    const totalPages = Math.ceil(pages / limit);

    const pageArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pageArray.push(i);
    }

    const brand = data.map((item) => item.brand);
    const category = data.map((item) => item.category);

    const allBrand = brand.reduce((acc, val) => acc.concat(val), []);
    const allCategory = category.reduce((acc, val) => acc.concat(val), []);

    const brandFilter = allBrand.filter(Boolean);
    const categoryFilter = allCategory.filter(Boolean);

    const brandCapitalize = brandFilter.map(
      (item) => item.charAt(0).toUpperCase() + item.slice(1)
    );
    const categoryCapitalize = categoryFilter.map(
      (item) => item.charAt(0).toUpperCase() + item.slice(1)
    );

    const uniqueBrand = [...new Set(brandCapitalize)];
    const uniqueCategory = [...new Set(categoryCapitalize)];

    res.json({
      data: {
        brand: uniqueBrand,
        category: uniqueCategory,
        pageNumbers: pageArray,
      },
    });
  } catch (error) {
    res.status(404).json({
      message: "Không thể lấy dữ liệu bộ lọc sản phẩm",
    });
  }
};
