const express = require("express");
const router = express.Router();
const {
  uploadDocument,
  getDocumentsForEntity,
  getDocumentsForProject,
  deleteDocument,
} = require("../controllers/document.Controller");
const { idParamValidator } = require("../validators/documentValidator");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.post("/", protect, upload.single("file"), uploadDocument);
router.get("/", protect, getDocumentsForEntity);
router.get("/project/:projectId", protect, getDocumentsForProject);
router.delete("/:id", protect, idParamValidator, deleteDocument);

module.exports = router;
