const router = require("express").Router();
const Setting = require("../models/settingModel");
const authMiddleware = require("../middlewares/authMiddleware");
const { validateAdmin } = require("../middlewares/authMiddleware");

// Get all settings (admin only)
router.get("/", [authMiddleware, validateAdmin], async (req, res) => {
  try {
    const settings = await Setting.find({});
    res.status(200).send({
      message: "Settings retrieved successfully", 
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get public settings
router.get("/public", async (req, res) => {
  try {
    const settings = await Setting.find({ isPublic: true });
    res.status(200).send({
      message: "Public settings retrieved successfully",
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get settings by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    
    // If the category is 'theme', make it accessible without authentication
    if (category === 'theme') {
      const settings = await Setting.find({ 
        category,
        isPublic: true 
      });
      return res.status(200).send({
        message: "Theme settings retrieved successfully",
        success: true,
        data: settings,
      });
    }
    
    // For other categories, require authentication
    if (!req.headers.authorization) {
      return res.status(401).send({
        message: "You are not authenticated",
        success: false
      });
    }
    
    // Apply the middleware manually for non-theme categories
    authMiddleware(req, res, async () => {
      const settings = await Setting.find({ 
        category,
        $or: [
          { isPublic: true },
          { _id: { $in: req.body.allowedSettings || [] } }
        ]
      });
      res.status(200).send({
        message: "Settings retrieved successfully",
        success: true,
        data: settings,
      });
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Update settings (admin only)
router.post("/update", [authMiddleware, validateAdmin], async (req, res) => {
  try {
    const { settings } = req.body;
    
    // Validate settings
    for (const setting of settings) {
      const existingSetting = await Setting.findById(setting._id);
      if (!existingSetting) {
        return res.status(404).send({
          message: `Setting ${setting._id} not found`,
          success: false,
        });
      }

      // Type validation
      switch (existingSetting.dataType) {
        case 'number':
          if (typeof setting.value !== 'number') {
            return res.status(400).send({
              message: `Invalid value type for setting ${setting.key}. Expected number.`,
              success: false,
            });
          }
          break;
        case 'boolean':
          if (typeof setting.value !== 'boolean') {
            return res.status(400).send({
              message: `Invalid value type for setting ${setting.key}. Expected boolean.`,
              success: false,
            });
          }
          break;
        case 'json':
          try {
            JSON.parse(JSON.stringify(setting.value));
          } catch {
            return res.status(400).send({
              message: `Invalid JSON value for setting ${setting.key}`,
              success: false,
            });
          }
          break;
      }

      // Validate against options if they exist
      if (existingSetting.options?.length > 0) {
        const validValues = existingSetting.options.map(opt => opt.value);
        if (!validValues.includes(setting.value)) {
          return res.status(400).send({
            message: `Invalid value for setting ${setting.key}. Must be one of: ${validValues.join(', ')}`,
            success: false,
          });
        }
      }
    }

    // Update settings
    for (const setting of settings) {
      await Setting.findByIdAndUpdate(setting._id, {
        value: setting.value,
      });
    }

    res.status(200).send({
      message: "Settings updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Reset settings to default (admin only)
router.post("/reset", [authMiddleware, validateAdmin], async (req, res) => {
  try {
    await Setting.deleteMany({});
    await Setting.initializeDefaultSettings();
    
    res.status(200).send({
      message: "Settings reset to default successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;