const router = require("express").Router();
const Payment = require("../models/paymentModel");
const Exam = require("../models/examModel");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new payment intent for an exam
router.post("/create-payment", authMiddleware, async (req, res) => {
  try {
    const { examId, userId, paymentMethod } = req.body;
    
    // Find the exam to get the price
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).send({
        message: "Exam not found",
        success: false,
      });
    }
    
    // Check if exam is paid
    if (!exam.isPaid) {
      return res.status(400).send({
        message: "This exam doesn't require payment",
        success: false,
      });
    }
    
    // Check if user is already registered for this exam
    const alreadyRegistered = exam.registeredUsers.find(
      (user) => user.userId.toString() === userId
    );
    
    if (alreadyRegistered && alreadyRegistered.paymentStatus === "completed") {
      return res.status(400).send({
        message: "You have already paid for this exam",
        success: false,
      });
    }
    
    // Create a unique transaction ID
    const transactionId = "TXN" + Date.now() + userId.substring(0, 5);
    
    // Create payment record
    const payment = new Payment({
      examId,
      userId,
      amount: exam.price,
      paymentMethod,
      transactionId,
      status: "pending"
    });
    
    await payment.save();
    
    // In a real app, you would initiate payment with a payment gateway here
    // For now, we'll simulate a successful payment
    
    res.status(200).send({
      message: "Payment initiated successfully",
      success: true,
      data: {
        paymentId: payment._id,
        transactionId,
        amount: exam.price,
      }
    });
    
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Complete a payment (simulated)
router.post("/complete-payment", authMiddleware, async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;
    
    // Find the payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).send({
        message: "Payment not found",
        success: false,
      });
    }
    
    // Verify transaction ID
    if (payment.transactionId !== transactionId) {
      return res.status(400).send({
        message: "Invalid transaction ID",
        success: false,
      });
    }
    
    // Update payment status
    payment.status = "completed";
    await payment.save();
    
    // Update user registration status in exam
    const exam = await Exam.findById(payment.examId);
    if (!exam) {
      return res.status(404).send({
        message: "Exam not found",
        success: false,
      });
    }
    
    // Find user in registered users
    const userIndex = exam.registeredUsers.findIndex(
      (user) => user.userId.toString() === payment.userId.toString()
    );
    
    if (userIndex >= 0) {
      // Update existing registration
      exam.registeredUsers[userIndex].paymentStatus = "completed";
    } else {
      // Add new registration (this should not happen normally)
      exam.registeredUsers.push({
        userId: payment.userId,
        paymentStatus: "completed"
      });
    }
    
    await exam.save();
    
    // Send receipt email
    // In a real app, you would send a receipt email here
    
    res.status(200).send({
      message: "Payment completed successfully",
      success: true,
      data: {
        receiptNumber: payment.receiptNumber,
        examCode: exam.examCode
      }
    });
    
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Get all payments for a user
router.post("/get-user-payments", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    
    const payments = await Payment.find({ userId })
      .populate("examId", "name category")
      .sort({ createdAt: -1 });
    
    res.status(200).send({
      message: "Payments fetched successfully",
      success: true,
      data: payments
    });
    
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

module.exports = router;