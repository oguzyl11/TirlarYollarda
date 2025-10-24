const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// Mock notifications for development
const mockNotifications = [
  {
    _id: 'notif_1',
    userId: 'user_1',
    type: 'bid_received',
    title: 'Yeni Teklif Aldınız',
    message: 'İstanbul - Ankara rotası için 2.500 TL teklif aldınız.',
    data: { jobId: 'job_1', bidId: 'bid_1', amount: 2500 },
    read: false,
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'notif_2',
    userId: 'user_1',
    type: 'job_completed',
    title: 'İş Tamamlandı',
    message: 'İstanbul - İzmir rotasındaki işiniz başarıyla tamamlandı.',
    data: { jobId: 'job_2', rating: 5 },
    read: false,
    priority: 'medium',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 saat önce
  },
  {
    _id: 'notif_3',
    userId: 'user_1',
    type: 'system',
    title: 'Hoş Geldiniz',
    message: 'LoadING platformuna hoş geldiniz! İlk iş ilanınızı oluşturun.',
    data: {},
    read: true,
    priority: 'low',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 gün önce
  }
];

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    console.log('Get notifications for user:', req.user.userId);
    
    // Mock data for development
    const userNotifications = mockNotifications.filter(notif => notif.userId === req.user.userId);
    
    res.json({
      success: true,
      data: userNotifications,
      unreadCount: userNotifications.filter(n => !n.read).length
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
    
    // Mock update
    const notification = mockNotifications.find(n => n._id === notificationId);
    if (notification) {
      notification.read = true;
      notification.readAt = new Date().toISOString();
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
    
    // Mock update
    mockNotifications.forEach(notif => {
      if (notif.userId === req.user.userId && !notif.read) {
        notif.read = true;
        notif.readAt = new Date().toISOString();
      }
    });
    
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
    
    // Mock delete
    const index = mockNotifications.findIndex(n => n._id === notificationId);
    if (index > -1) {
      mockNotifications.splice(index, 1);
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
    
    const notification = {
      _id: `notif_${Date.now()}`,
      userId,
      type,
      title,
      message,
      data: data || {},
      read: false,
      priority: priority || 'medium',
      createdAt: new Date().toISOString()
    };
    
    mockNotifications.push(notification);
    
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
