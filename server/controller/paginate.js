export class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.running = query;
    this.lounging = query;
    this.everyday = query;
    this.paginate = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };
    
    // Handle price filter
    if (queryObj.price) {
      // Price expected as "min - max" numeric ranges; ignore non-numeric or unexpected formats
      if (typeof queryObj.price === 'string' && queryObj.price.includes('-')) {
        const parts = queryObj.price.split("-").map(p => p.trim());
        const min = parseInt(parts[0]);
        const max = parseInt(parts[1]);
        if (!Number.isNaN(min) && !Number.isNaN(max)) {
          queryObj.price = { $gte: min, $lte: max };
        } else {
          // invalid price range, remove it so it won't cause DB errors
          delete queryObj.price;
        }
      } else {
        // Not a range string; ignore
        delete queryObj.price;
      }
    }
    
    // Handle brand filter (case-insensitive regex)
    if (queryObj.brand) {
      queryObj.brand = {
        $regex: queryObj.brand,
        $options: "i",
      };
    }
    
    // Handle category filter (frontend 'category' param actually refers to shoeFor values)
    // The API returns 'category' data as the distinct `shoeFor` values (e.g., Running, Lounging)
    // Map the incoming category query to filter against the `shoeFor` array field.
    if (queryObj.category) {
      queryObj.shoeFor = {
        $in: [
          new RegExp(`^${queryObj.category}$`, "i")
        ]
      };
      delete queryObj.category; // remove original to avoid confusion
    }
    
    // Handle searchName filter (search by product title - case-insensitive regex)
    if (queryObj.searchName) {
      queryObj.title = {
        $regex: queryObj.searchName,
        $options: "i",
      };
      delete queryObj.searchName; // Remove searchName, we use title instead
    }
    
    // Remove pagination and sorting fields from query
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    
    // Build the final query - only include filters that are actually set
    const finalQuery = {};
    if (queryObj.price) {
      finalQuery.price = queryObj.price;
    }
    if (queryObj.brand) {
      finalQuery.brand = queryObj.brand;
    }
    if (queryObj.shoeFor) {
      finalQuery.shoeFor = queryObj.shoeFor;
    }
    if (queryObj.title) {
      finalQuery.title = queryObj.title;
    }
    // Handle age/gender filter (maps to product `category` array)
    if (queryObj.age) {
      finalQuery.category = { $in: [new RegExp(`^${queryObj.age}$`, "i")] };
      delete queryObj.age;
    }
    
    this.queryString = finalQuery;
    this.query.find(finalQuery);
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort;
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }
  paginating() {
    const page = this.paginate.page || 1;
    const limit = this.paginate.limit * 1 || 8;
    const skip = (page - 1) * limit;
    this.paginate = { skip, limit };
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
