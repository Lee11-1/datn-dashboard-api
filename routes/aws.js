const Router = require('koa-router');
const koaBody = require('koa-body');
const awsController = require('../controller/awsController');

const router = new Router({ prefix: '/api/aws' });

// Middleware for handling multipart form data with file uploads
const multipartMiddleware = koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 100 * 1024 * 1024, // 100MB max file size
    maxFields: 7,
    maxFieldsSize: 2 * 1024 * 1024,
    uploadDir: './uploads',
    keepExtensions: true,
  },
});


router.post('/upload', multipartMiddleware, awsController.uploadFiles.bind(awsController));

router.delete('/delete', awsController.deleteFile.bind(awsController));


router.get('/signed-url', awsController.getSignedUrl.bind(awsController));

/**
 * GET /api/aws/file-exists
 * Check if file exists in S3
 * Query: key
 */
router.get('/file-exists', awsController.fileExists.bind(awsController));

module.exports = router;
