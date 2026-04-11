require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-southeast-1',
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
});

const S3_BUCKET = process.env.S3_BUCKET_NAME;

class AwsService {
  /**
   * Upload file to S3
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - File name
   * @param {string} folder - Folder in S3 (e.g., 'users', 'products')
   * @param {string} contentType - MIME type
   * @returns {Promise<string>} - S3 URL
   */
  async uploadFile(fileBuffer, fileName, folder = 'uploads', contentType = 'application/octet-stream', isPublic = true) {
    try {
      const key = `${folder}/${Date.now()}-${fileName}`;
      const params = {
        Bucket: S3_BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      };

      if (isPublic) {
        params.ACL = 'public-read';
      }

      const result = await s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      throw new Error(`Upload file failed: ${error.message}`);
    }
  }

  /**
   * Get signed URL for private files
   * @param {string} key - S3 object key
   * @param {number} expires - Expiration time in seconds
   * @returns {string} - Signed URL
   */
  getSignedUrl(key, expires = 3600) {
    try {
      return s3.getSignedUrl('getObject', {
        Bucket: S3_BUCKET,
        Key: key,
        Expires: expires,
      });
    } catch (error) {
      throw new Error(`Get signed URL failed: ${error.message}`);
    }
  }

  /**
   * Delete file from S3
   * @param {string} fileUrl - Full S3 URL or key
   * @returns {Promise<void>}
   */
  async deleteFile(fileUrl) {
    try {
      const key = fileUrl.includes('amazonaws.com') 
        ? fileUrl.split('.com/')[1] 
        : fileUrl;

      await s3.deleteObject({
        Bucket: S3_BUCKET,
        Key: key,
      }).promise();
    } catch (error) {
      throw new Error(`Delete file failed: ${error.message}`);
    }
  }

  /**
   * Delete multiple files from S3
   * @param {Array<string>} fileUrls - Array of S3 URLs or keys
   * @returns {Promise<Object>} - Object with deletedFiles array and errors array
   */
  async deleteFiles(fileUrls) {
    try {
      if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
        throw new Error('File URLs must be a non-empty array');
      }

      const deletedFiles = [];
      const errors = [];

      for (const fileUrl of fileUrls) {
        try {
          const key = fileUrl.includes('amazonaws.com') 
            ? fileUrl.split('.com/')[1] 
            : fileUrl;

          await s3.deleteObject({
            Bucket: S3_BUCKET,
            Key: key,
          }).promise();

          deletedFiles.push({ fileUrl, key });
        } catch (error) {
          errors.push({
            fileUrl,
            error: error.message,
          });
        }
      }

      return {
        deletedFiles,
        errors,
        successCount: deletedFiles.length,
        errorCount: errors.length,
      };
    } catch (error) {
      throw new Error(`Delete files failed: ${error.message}`);
    }
  }

  /**
   * Check if file exists
   * @param {string} key - S3 object key
   * @returns {Promise<boolean>}
   */
  async fileExists(key) {
    try {
      await s3.headObject({ Bucket: S3_BUCKET, Key: key }).promise();
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw new Error(`File exists check failed: ${error.message}`);
    }
  }

  /**
   * List files in a folder
   * @param {string} folder - Folder path in S3
   * @param {number} maxKeys - Maximum number of keys to return
   * @returns {Promise<Array>} - List of files
   */
  async listFiles(folder, maxKeys = 100) {
    try {
      const result = await s3.listObjectsV2({
        Bucket: S3_BUCKET,
        Prefix: folder,
        MaxKeys: maxKeys,
      }).promise();

      return result.Contents || [];
    } catch (error) {
      throw new Error(`List files failed: ${error.message}`);
    }
  }

  /**
   * Copy file in S3
   * @param {string} sourceKey - Source file key
   * @param {string} destKey - Destination file key
   * @returns {Promise<void>}
   */
  async copyFile(sourceKey, destKey) {
    try {
      await s3.copyObject({
        Bucket: S3_BUCKET,
        CopySource: `${S3_BUCKET}/${sourceKey}`,
        Key: destKey,
      }).promise();
    } catch (error) {
      throw new Error(`Copy file failed: ${error.message}`);
    }
  }

  /**
   * Get file metadata
   * @param {string} key - S3 object key
   * @returns {Promise<Object>} - File metadata
   */
  async getFileMetadata(key) {
    try {
      const metadata = await s3.headObject({
        Bucket: S3_BUCKET,
        Key: key,
      }).promise();

      return {
        size: metadata.ContentLength,
        type: metadata.ContentType,
        lastModified: metadata.LastModified,
        etag: metadata.ETag,
      };
    } catch (error) {
      throw new Error(`Get file metadata failed: ${error.message}`);
    }
  }
}

module.exports = new AwsService();
