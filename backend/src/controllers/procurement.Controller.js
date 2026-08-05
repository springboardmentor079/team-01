const Procurement = require("../models/Procurement");
const Inventory = require("../models/Inventory");
const InventoryLog = require("../models/InventoryLog");
const { validationResult } = require("express-validator");

exports.createProcurement = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { quantity, unitPrice } = req.body;
    const totalAmount = unitPrice ? quantity * unitPrice : undefined;

    const procurement = await Procurement.create({
      ...req.body,
      totalAmount,
      requestedBy: req.user?.id,
    });

    res.status(201).json(procurement);
  } catch (err) {
    next(err);
  }
};

exports.getAllProcurements = async (req, res, next) => {
  try {
    const { projectId, status } = req.query;
    const filter = {};
    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;

    const procurements = await Procurement.find(filter)
      .populate("projectId", "name")
      .populate("vendorId", "name")
      .populate("inventoryId", "itemName");

    res.json(procurements);
  } catch (err) {
    next(err);
  }
};

exports.getProcurementById = async (req, res, next) => {
  try {
    const procurement = await Procurement.findById(req.params.id)
      .populate("projectId", "name")
      .populate("vendorId", "name")
      .populate("inventoryId", "itemName");
    if (!procurement)
      return res.status(404).json({ message: "Procurement not found" });
    res.json(procurement);
  } catch (err) {
    next(err);
  }
};

exports.approveProcurement = async (req, res, next) => {
  try {
    const procurement = await Procurement.findById(req.params.id);
    if (!procurement)
      return res.status(404).json({ message: "Procurement not found" });
    if (procurement.status !== "requested") {
      return res
        .status(400)
        .json({
          message: `Cannot approve from status '${procurement.status}'`,
        });
    }

    procurement.status = "approved";
    procurement.approvedBy = req.user?.id;
    await procurement.save();

    res.json(procurement);
  } catch (err) {
    next(err);
  }
};

exports.orderProcurement = async (req, res, next) => {
  try {
    const procurement = await Procurement.findById(req.params.id);
    if (!procurement)
      return res.status(404).json({ message: "Procurement not found" });
    if (procurement.status !== "approved") {
      return res
        .status(400)
        .json({ message: `Cannot order from status '${procurement.status}'` });
    }

    procurement.status = "ordered";
    procurement.orderedAt = new Date();
    await procurement.save();

    res.json(procurement);
  } catch (err) {
    next(err);
  }
};

exports.deliverProcurement = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { deliveredQuantity, notes } = req.body;

    const procurement = await Procurement.findById(req.params.id);
    if (!procurement)
      return res.status(404).json({ message: "Procurement not found" });
    if (procurement.status !== "ordered") {
      return res
        .status(400)
        .json({
          message: `Cannot deliver from status '${procurement.status}'`,
        });
    }

    const inventoryItem = await Inventory.findById(procurement.inventoryId);
    if (!inventoryItem)
      return res
        .status(404)
        .json({ message: "Linked inventory item not found" });

    inventoryItem.currentStock += deliveredQuantity;
    await inventoryItem.save();

    await InventoryLog.create({
      inventoryId: inventoryItem._id,
      projectId: inventoryItem.projectId,
      changeType: "restock",
      quantity: deliveredQuantity,
      reason: `Procurement delivery — PO ${procurement._id}`,
      performedBy: req.user?.id,
    });

    procurement.status = "delivered";
    procurement.deliveredQuantity = deliveredQuantity;
    procurement.deliveredAt = new Date();
    if (notes) procurement.notes = notes;
    await procurement.save();

    res.json(procurement);
  } catch (err) {
    next(err);
  }
};

exports.cancelProcurement = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const procurement = await Procurement.findById(req.params.id);
    if (!procurement)
      return res.status(404).json({ message: "Procurement not found" });
    if (procurement.status === "delivered") {
      return res
        .status(400)
        .json({ message: "Cannot cancel a delivered procurement" });
    }

    procurement.status = "cancelled";
    if (notes) procurement.notes = notes;
    await procurement.save();

    res.json(procurement);
  } catch (err) {
    next(err);
  }
};
