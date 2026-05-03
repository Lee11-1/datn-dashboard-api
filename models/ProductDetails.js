const mongoose = require('mongoose');

const productDetailsSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    components: {
      type: String,
      description: 'Thành phần cấu tạo sản phẩm'
    },
    uses: {
      type: String,
      description: 'Công dụng của sản phẩm'
      
    },
    usageInstructions: {
      type: String,
      description: 'Hướng dẫn sử dụng'
    },
    manufacturingPlace: {
      type: String,
      description: 'Nơi sản xuất'
    },
    manufacturerContact: {
      type: {
        name: String,
        phone: String,
        email: String,
        address: String
      },
      description: 'Thông tin liên hệ nhà sản xuất'
    }
  },
  {
    timestamps: true,
    collection: 'product_details'
  }
);

module.exports = mongoose.model('ProductDetails', productDetailsSchema);
