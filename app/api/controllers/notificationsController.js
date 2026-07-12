// In-memory notifications — replace with DB persistence.
const notifications = [
  { id: 1, message: "Revenue milestone of ₹12M reached this month.",          read: false, createdAt: "2026-06-20T09:00:00.000Z" },
  { id: 2, message: "New data upload completed: sales_q1_2026.csv",           read: false, createdAt: "2026-06-19T14:30:00.000Z" },
  { id: 3, message: "Punjab crossed ₹3M in regional sales.",                  read: true,  createdAt: "2026-06-18T11:15:00.000Z" },
  { id: 4, message: "Order completion rate dipped below 90% — review needed.", read: false, createdAt: "2026-06-17T08:45:00.000Z" },
  { id: 5, message: "Electronics category up 22% this quarter.",               read: true,  createdAt: "2026-06-15T16:00:00.000Z" },
];

/**
 * GET /api/notifications  (protected)
 */
const getNotifications = async (req, res, next) => {
  try {
    res.status(200).json({ notifications });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/:id/read  (protected)
 */
const markAsRead = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const notification = notifications.find((n) => n.id === id);

    if (!notification) {
      const err = new Error(`Notification with id ${id} not found.`);
      err.status = 404;
      return next(err);
    }

    notification.read = true;

    res.status(200).json({ notification });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markAsRead };
