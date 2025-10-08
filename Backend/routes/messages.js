const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Simple Message Schema
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    conversationId: {
        type: String,
        required: true,
        index: true
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

// Generate conversation ID from two user IDs
const generateConversationId = (userId1, userId2) => {
    return [userId1, userId2].sort().join('-');
};

// @route   POST /api/messages
// @desc    Send message
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { receiver, content } = req.body;

        if (!receiver || !content) {
            return res.status(400).json({
                success: false,
                message: 'Alýcý ve mesaj içeriði gereklidir'
            });
        }

        const conversationId = generateConversationId(req.user.userId, receiver);

        const message = new Message({
            sender: req.user.userId,
            receiver,
            content,
            conversationId
        });

        await message.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'profile')
            .populate('receiver', 'profile');

        res.status(201).json({
            success: true,
            data: populatedMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Mesaj gönderilirken hata oluþtu'
        });
    }
});

// @route   GET /api/messages/:conversationId
// @desc    Get messages in conversation
// @access  Private
router.get('/:conversationId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
            .populate('sender', 'profile')
            .populate('receiver', 'profile')
            .sort('createdAt');

        // Mark messages as read
        await Message.updateMany(
            {
                conversationId: req.params.conversationId,
                receiver: req.user.userId,
                read: false
            },
            { read: true }
        );

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Mesajlar getirilirken hata oluþtu'
        });
    }
});

// @route   GET /api/messages/conversations/list
// @desc    Get all conversations for user
// @access  Private
router.get('/conversations/list', auth, async (req, res) => {
    try {
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(req.user.userId) },
                        { receiver: new mongoose.Types.ObjectId(req.user.userId) }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$conversationId',
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$receiver', new mongoose.Types.ObjectId(req.user.userId)] },
                                        { $eq: ['$read', false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        // Populate user details
        await Message.populate(conversations, {
            path: 'lastMessage.sender lastMessage.receiver',
            select: 'profile'
        });

        res.json({
            success: true,
            data: conversations
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            message: 'Konuþmalar getirilirken hata oluþtu'
        });
    }
});

module.exports = router;