const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    console.log('Get notifications for user:', req.user.userId);
    
    const notifications = await Notification.find({ 
      userId: req.user.userId,
      expiresAt: { $gt: new Date() }
    })
    .sort({ createdAt: -1 })
    .limit(50);

    const unreadCount = await Notification.countDocuments({ 
      userId: req.user.userId,
      read: false,
      expiresAt: { $gt: new Date() }
    });
    
    res.json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirimler yüklenirken hata oluştu'
    });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    console.log('Mark notification as read:', notificationId);
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: req.user.userId },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Bildirim bulunamadı'
      });
    }
    
    res.json({
      success: true,
      message: 'Bildirim okundu olarak işaretlendi'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim güncellenirken hata oluştu'
    });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    console.log('Mark all notifications as read for user:', req.user.userId);
    
    await Notification.updateMany(
      { userId: req.user.userId, read: false },
      { read: true, readAt: new Date() }
    );
    
    res.json({
      success: true,
      message: 'Tüm bildirimler okundu olarak işaretlendi'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirimler güncellenirken hata oluştu'
    });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    console.log('Delete notification:', notificationId);
    
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: req.user.userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Bildirim bulunamadı'
      });
    }
    
    res.json({
      success: true,
      message: 'Bildirim silindi'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim silinirken hata oluştu'
    });
  }
});

// Create notification (for internal use)
router.post('/', auth, async (req, res) => {
  try {
    const { userId, type, title, message, data, priority } = req.body;
    
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data: data || {},
      priority: priority || 'medium'
    });
    
    await notification.save();
    
    res.status(201).json({
      success: true,
      message: 'Bildirim oluşturuldu',
      data: notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim oluşturulurken hata oluştu'
    });
  }
});

module.exports = router;
