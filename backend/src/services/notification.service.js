const Notification = require("../models/Notification");

/**
 * Creates a notification for a single user.
 * Called internally from other controllers (Procurement, Attendance, etc.)
 * — never exposed as a direct public API endpoint.
 */
exports.createNotification = async ({
  userId,
  type,
  message,
  entityType,
  entityId,
}) => {
  if (!userId) return null; // fail silently — a missing recipient shouldn't break the parent action

  try {
    return await Notification.create({
      userId,
      type,
      message,
      relatedEntity:
        entityType && entityId ? { entityType, entityId } : undefined,
    });
  } catch (err) {
    // Notification failure should never break the parent action (e.g. approving a PO).
    console.error("Failed to create notification:", err.message);
    return null;
  }
};

/**
 * Creates the same notification for multiple users at once (e.g. all admins).
 */
exports.createNotificationForMany = async ({
  userIds = [],
  type,
  message,
  entityType,
  entityId,
}) => {
  const results = await Promise.all(
    userIds.map((userId) =>
      exports.createNotification({
        userId,
        type,
        message,
        entityType,
        entityId,
      }),
    ),
  );
  return results;
};
