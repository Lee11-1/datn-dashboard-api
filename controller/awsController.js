const awsService = require('../service/awsService');
const fs = require('fs').promises;
const path = require('path');

class AwsController {
  /**
   * Upload multiple files to S3
   * Expects: files array from multipart form + folder_name in body or query
   * @param {Object} ctx - Koa context
   */
  async uploadFiles(ctx) {
    try {
      const { folder_name = 'uploads', isPublic = true } = ctx.request.body;
      const filesData = ctx.request.files?.files || ctx.request.files?.image || [];

      const fileArray = Array.isArray(filesData) ? filesData : (filesData ? [filesData] : []);

      if (!fileArray || fileArray.length === 0) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'No files provided',
        };
        return;
      }

      if (!folder_name || typeof folder_name !== 'string') {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Folder name is required and must be a string',
        };
        return;
      }

      const uploadedFiles = [];
      const errors = [];

      for (const file of fileArray) {
        try {
          const fileBuffer = await fs.readFile(file.path);
          const fileName = file.name || file.originalFilename || path.basename(file.path);
          const contentType = file.type || file.mimetype || 'application/octet-stream';

          const fileUrl = await awsService.uploadFile(
            fileBuffer,
            fileName,
            folder_name,
            contentType,
            isPublic
          );

          uploadedFiles.push({
            fileName,
            url: fileUrl,
            size: file.size,
            type: contentType,
          });

          try {
            await fs.unlink(file.path);
          } catch (cleanupError) {
            console.warn(`Warning: Could not delete temp file ${file.path}`, cleanupError.message);
          }
        } catch (error) {
          errors.push({
            fileName: file.name || file.originalFilename || 'unknown',
            error: error.message,
          });
        }
      }

      if (uploadedFiles.length === 0) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'All files failed to upload',
          errors,
        };
        return;
      }

      ctx.status = 201;
      ctx.body = {
        success: true,
        message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
        data: {
          uploadedFiles,
          failedFiles: errors.length > 0 ? errors : null,
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Delete file(s) from S3
   * Supports only array of file URLs
   * @param {Object} ctx - Koa context
   */
  async deleteFile(ctx) {
    try {
      let fileUrls = ctx.request.body?.fileUrls || ctx.request.query?.fileUrls;

      if (!fileUrls) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'fileUrls array is required',
        };
        return;
      }

      if (!Array.isArray(fileUrls)) {
        fileUrls = [fileUrls];
      }

      const result = await awsService.deleteFiles(fileUrls);

      ctx.body = {
        success: result.errorCount === 0,
        message: `Deleted ${result.successCount} file(s)`,
        data: {
          deletedFiles: result.deletedFiles,
          failedFiles: result.errors.length > 0 ? result.errors : null,
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get signed URL for private file
   * @param {Object} ctx - Koa context
   */
  async getSignedUrl(ctx) {
    try {
      const key = ctx.request.body?.key || ctx.request.query?.key;
      const expires = ctx.request.body?.expires || ctx.request.query?.expires || 3600;

      if (!key) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'File key is required',
        };
        return;
      }

      const signedUrl = awsService.getSignedUrl(key, expires);

      ctx.body = {
        success: true,
        data: {
          signedUrl,
          expiresIn: expires,
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Check if file exists
   * @param {Object} ctx - Koa context
   */
  async fileExists(ctx) {
    try {
      const key = ctx.request.body?.key || ctx.request.query?.key;

      if (!key) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'File key is required',
        };
        return;
      }

      const exists = await awsService.fileExists(key);

      ctx.body = {
        success: true,
        data: {
          exists,
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = new AwsController();
