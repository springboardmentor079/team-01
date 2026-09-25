const Document = require("../models/Document");

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { projectId, entityType, entityId } = req.body;
    if (!projectId || !entityType || !entityId) {
      return res
        .status(400)
        .json({ message: "projectId, entityType, and entityId are required" });
    }

    const document = await Document.create({
      projectId,
      entityType,
      entityId,
      fileName: req.file.originalname,
      fileUrl: req.file.path, // Cloudinary URL, set by multer-storage-cloudinary
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user?.id,
    });

    res.status(201).json(document);
  } catch (err) {
    next(err);
  }
};

exports.getDocumentsForEntity = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.query;
    if (!entityType || !entityId) {
      return res
        .status(400)
        .json({ message: "entityType and entityId query params are required" });
    }

    const documents = await Document.find({ entityType, entityId }).sort({
      createdAt: -1,
    });
    res.json(documents);
  } catch (err) {
    next(err);
  }
};

exports.getDocumentsForProject = async (req, res, next) => {
  try {
    const documents = await Document.find({
      projectId: req.params.projectId,
    }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    next(err);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });
    res.json({ message: "Document deleted" });
  } catch (err) {
    next(err);
  }
};
