const ProductDetails = require('../models/ProductDetails');
class ProductService {

  async createProductDetails(productId, detailsData) {
    try {
      const productDetails = new ProductDetails({
        productId: productId,
        components: detailsData.components || '',
        usageInstructions: detailsData.usageInstructions || '',
        manufacturingPlace: detailsData.manufacturingPlace || '',
        manufacturerContact: detailsData.manufacturerContact || {}
      });
      
      const savedDetails = await productDetails.save();
      console.log('Product details created successfully for product ID:', productId);
      return savedDetails;
    } catch (error) {
      console.error('Error creating product details:', error.message);
      throw error;
    }
  }

  async getProductDetails(productId) {
    try {
      const productDetails = await ProductDetails.findOne({ productId });
      if (!productDetails) {
        throw new Error('Product details not found');
      }
      return productDetails;
    } catch (error) {
      console.error('Error fetching product details:', error.message);
      throw error;
    }
  }

  async updateProductDetails(productId, updateData) {
    try {
      const productDetails = await ProductDetails.findOneAndUpdate(
        { productId },
        updateData,
        { new: true, runValidators: true }
      );
      if (!productDetails) {
        throw new Error('Product details not found');
      }
      console.log('Product details updated for product ID:', productId);
      return productDetails;
    } catch (error) {
      console.error('Error updating product details:', error.message);
      throw error;
    }
  }

  async deleteProductDetails(productId) {
    try {
      const result = await ProductDetails.deleteOne({ productId });
      console.log('Product details deleted for product ID:', productId);
      return result;
    } catch (error) {
      console.error('Error deleting product details:', error.message);
      throw error;
    }
  }
}

module.exports = new ProductService();
