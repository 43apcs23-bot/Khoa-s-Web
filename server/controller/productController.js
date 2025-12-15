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
        message: "Vui lòng chọn mục đích sử dụng sản phẩm",
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
        message: "Vui lòng chọn mục đích sử dụng sản phẩm",
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
/* ===================== FILTER PRODUCT ===================== */
export const getfilterProduct = async (req, res) => {
  try {
    // Lấy tất cả product cần filter
    const data = await productModel.find({}).select("brand category shoeFor price");

    // Pagination
    const totalDocs = await productModel.countDocuments();
    const limit = 8;
    const totalPages = Math.ceil(totalDocs / limit);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Lấy dữ liệu dropdown
    const allBrand = data.map(item => item.brand).filter(Boolean);
    const allCategory = data.map(item => item.shoeFor).flat().filter(Boolean);
    const allAge = data.map(item => item.category).flat().filter(Boolean);

    // Capitalize và unique
    const uniqueBrand = [...new Set(allBrand.map(b => b.charAt(0).toUpperCase() + b.slice(1)))];
    const uniqueCategory = [...new Set(allCategory.map(c => c.charAt(0).toUpperCase() + c.slice(1)))];
    const uniqueAge = [...new Set(allAge.map(a => a.charAt(0).toUpperCase() + a.slice(1)))];

    // Price ranges (hardcode tạm)
    const priceRanges = ["Tất cả", "0-100", "101-500", "501-1000", "1001+"];

    // Trả về JSON
    res.json({
      data: {
        brand: uniqueBrand,      // BrandDropdown
        category: uniqueCategory, // ProductDropdown (shoeFor)
        age: uniqueAge,          // AgeDropdown (Nam/Nữ/Trẻ em)
        priceRanges,             // PriceRangeDropdown
        pageNumbers
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Không thể lấy dữ liệu bộ lọc sản phẩm",
      error: error.message
    });
  }
};
