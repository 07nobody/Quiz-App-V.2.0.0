const router = require("express").Router();
const Exam = require("../models/examModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Question = require("../models/questionModel");

// add exam

router.post("/add", authMiddleware, async (req, res) => {
  try {
    // check if exam already exists
    const examExists = await Exam.findOne({ name: req.body.name });
    if (examExists) {
      return res
        .status(200)
        .send({ message: "Exam already exists", success: false });
    }
    req.body.questions = [];
    const newExam = new Exam(req.body);
    await newExam.save();
    res.send({
      message: "Exam added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all exams
router.post("/get-all-exams", authMiddleware, async (req, res) => {
  try {
    const exams = await Exam.find({});
    res.send({
      message: "Exams fetched successfully",
      data: exams,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get exam by id
router.post("/get-exam-by-id", authMiddleware, async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.examId).populate("questions");
    res.send({
      message: "Exam fetched successfully",
      data: exam,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// edit exam by id
router.post("/edit-exam-by-id", authMiddleware, async (req, res) => {
  try {
    await Exam.findByIdAndUpdate(req.body.examId, req.body);
    res.send({
      message: "Exam edited successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// delete exam by id
router.post("/delete-exam-by-id", authMiddleware, async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.body.examId);
    res.send({
      message: "Exam deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// add question to exam

router.post("/add-question-to-exam", authMiddleware, async (req, res) => {
  try {
    // add question to Questions collection
    const newQuestion = new Question(req.body);
    const question = await newQuestion.save();

    // add question to exam
    const exam = await Exam.findById(req.body.exam);
    exam.questions.push(question._id);
    await exam.save();
    res.send({
      message: "Question added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// edit question in exam
router.post("/edit-question-in-exam", authMiddleware, async (req, res) => {
  try {
    // edit question in Questions collection
    await Question.findByIdAndUpdate(req.body.questionId, req.body);
    res.send({
      message: "Question edited successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});


// delete question in exam
router.post("/delete-question-in-exam", authMiddleware, async (req, res) => {
     try {
        // delete question in Questions collection
        await Question.findByIdAndDelete(req.body.questionId);

        // delete question in exam
        const exam = await Exam.findById(req.body.examId);
        exam.questions = exam.questions.filter(
          (question) => question._id != req.body.questionId
        );
        await exam.save();
        res.send({
          message: "Question deleted successfully",
          success: true,
        });
     } catch (error) {
      
     }
});

// Register user for an exam
router.post("/register-exam", authMiddleware, async (req, res) => {
  try {
    const { examId, userId, email } = req.body;
    const exam = await Exam.findById(examId);
    
    if (!exam) {
      return res.status(404).send({
        message: "Exam not found",
        success: false,
      });
    }

    // Check if user is already registered
    const isRegistered = exam.registeredUsers.some(
      (user) => user.userId.toString() === userId
    );

    if (isRegistered) {
      return res.status(200).send({
        message: "You are already registered for this exam",
        success: true,
        data: { examCode: exam.examCode }
      });
    }

    // Add user to registered users
    exam.registeredUsers.push({
      userId,
      email,
      registeredAt: new Date(),
      paymentStatus: exam.isPaid ? "pending" : "completed"
    });

    await exam.save();

    // Send email with exam code
    await sendExamCodeEmail(email, exam.name, exam.examCode);

    res.status(200).send({
      message: "Successfully registered for the exam. Exam code has been sent to your email.",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Check if user is registered for an exam
router.post("/check-registration", authMiddleware, async (req, res) => {
  try {
    const { examId } = req.body;
    const userId = req.userId || req.body.userId; // Get userId from auth middleware or body
    
    if (!examId) {
      return res.status(400).send({
        message: "Exam ID is required",
        success: false,
      });
    }

    const exam = await Exam.findById(examId);
    
    if (!exam) {
      return res.status(404).send({
        message: "Exam not found",
        success: false,
      });
    }

    // Check if user is registered
    const userRegistration = exam.registeredUsers.find(
      (user) => user && user.userId && user.userId.toString() === userId
    );

    if (userRegistration) {
      return res.status(200).send({
        message: "User is registered for this exam",
        success: true,
        data: {
          isRegistered: true,
          paymentStatus: userRegistration.paymentStatus,
          examCode: exam.examCode
        }
      });
    } else {
      return res.status(200).send({
        message: "User is not registered for this exam",
        success: true,
        data: {
          isRegistered: false
        }
      });
    }
  } catch (error) {
    console.error("Error checking registration:", error);
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Helper function to send exam code via email
async function sendExamCodeEmail(email, examName, examCode) {
  // Assuming you have nodemailer setup similar to your password reset functionality
  const nodemailer = require("nodemailer");
  
  // Setup email transport - get these from your environment variables
  const transportConfig = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  // Create reusable transporter
  const transporter = nodemailer.createTransport(transportConfig);

  const mailOptions = {
    from: `"Quiz App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Exam Registration Confirmation - ${examName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F3460;">Quiz App - Exam Registration</h2>
        <p>You have successfully registered for the exam: <strong>${examName}</strong></p>
        <p>Your exam access code is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${examCode}</strong>
        </div>
        <p>You will need this code to access the exam when you're ready to take it.</p>
        <p>Good luck!</p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          This is an automated email, please do not reply.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Exam code email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending exam code email:", error);
    throw new Error("Failed to send exam code email");
  }
}

// Regenerate exam token
router.post("/regenerate-exam-token", authMiddleware, async (req, res) => {
  try {
    const { examId } = req.body;
    
    if (!examId) {
      return res.status(400).send({
        message: "Exam ID is required",
        success: false,
      });
    }

    // Find the exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).send({
        message: "Exam not found",
        success: false,
      });
    }

    // Generate a new token
    const newExamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Update the exam with the new code
    exam.examCode = newExamCode;
    await exam.save();

    // Notify all registered users about the new code
    const notificationPromises = exam.registeredUsers.map(user => 
      sendExamCodeEmail(user.email, exam.name, newExamCode)
    );
    
    await Promise.all(notificationPromises);

    res.status(200).send({
      message: "Exam token regenerated successfully and notifications sent",
      success: true,
      data: {
        examCode: newExamCode
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

module.exports = router;
