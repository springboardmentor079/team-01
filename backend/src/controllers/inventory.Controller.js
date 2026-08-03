const Inventory = require("../models/Inventory");
const InventoryLog = require("../models/InventoryLog");
const { validationResult } = require("express-validator");

const computeStatus = (item) => {
  if (item.currentStock <= 0) return "out-of-stock";
  if (item.currentStock <= item.minThreshold) return "low-stock";
  return "in-stock";
};

const withStatus = (item) => ({
  ...item.toObject(),
  status: computeStatus(item),
});

exports.createInventory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const item = await Inventory.create(req.body);
    res.status(201).json(withStatus(item));
  } catch (err) {
    next(err);
  }
};

exports.getInventoryByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const items = await Inventory.find({ projectId });
    res.json(items.map(withStatus));
  } catch (err) {
    next(err);
  }
};

exports.getInventoryById = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Inventory item not found" });
    res.json(withStatus(item));
  } catch (err) {
    next(err);
  }
};

exports.updateInventory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const allowedFields = [
      "itemName",
      "category",
      "unit",
      "minThreshold",
      "unitPrice",
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const item = await Inventory.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!item)
      return res.status(404).json({ message: "Inventory item not found" });
    res.json(withStatus(item));
  } catch (err) {
    next(err);
  }
};

exports.deleteInventory = async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Inventory item not found" });
    res.json({ message: "Inventory item deleted" });
  } catch (err) {
    next(err);
  }
};

exports.restockItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { quantity, reason } = req.body;
    const item = await Inventory.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Inventory item not found" });

    item.currentStock += quantity;
    await item.save();

    await InventoryLog.create({
      inventoryId: item._id,
      projectId: item.projectId,
      changeType: "restock",
      quantity,
      reason,
      performedBy: req.user?.id,
    });

    res.json(withStatus(item));
  } catch (err) {
    next(err);
  }
};

exports.consumeItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { quantity, reason } = req.body;
    const item = await Inventory.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Inventory item not found" });

    if (quantity > item.currentStock) {
      return res
        .status(400)
        .json({ message: "Cannot consume more than currentStock" });
    }

    item.currentStock -= quantity;
    await item.save();

    await InventoryLog.create({
      inventoryId: item._id,
      projectId: item.projectId,
      changeType: "consume",
      quantity,
      reason,
      performedBy: req.user?.id,
    });

    res.json(withStatus(item));
  } catch (err) {
    next(err);
  }
};

exports.adjustStock = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { quantity, reason } = req.body;
    const item = await Inventory.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Inventory item not found" });

    const newStock = item.currentStock + quantity;
    if (newStock < 0) {
      return res
        .status(400)
        .json({ message: "Adjustment would result in negative stock" });
    }

    item.currentStock = newStock;
    await item.save();

    await InventoryLog.create({
      inventoryId: item._id,
      projectId: item.projectId,
      changeType: "adjustment",
      quantity,
      reason,
      performedBy: req.user?.id,
    });

    res.json(withStatus(item));
  } catch (err) {
    next(err);
  }
};

exports.getInventoryLogs = async (req, res, next) => {
  try {
    const logs = await InventoryLog.find({ inventoryId: req.params.id })
      .sort({ createdAt: -1 })
      .populate("performedBy", "name email");
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

exports.getAllInventory = async (req, res, next) => {
  try {
    const { projectId, status } = req.query;
    const filter = {};
    if (projectId) filter.projectId = projectId;

    let items = await Inventory.find(filter).populate("projectId", "name");
    items = items.map(withStatus);

    if (status) {
      items = items.filter((item) => item.status === status);
    }

    res.json(items);
  } catch (err) {
    next(err);
  }
};
