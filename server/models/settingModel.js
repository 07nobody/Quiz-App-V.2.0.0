const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['general', 'study', 'notifications', 'privacy', 'theme']
    },
    key: {
      type: String,
      required: true,
      unique: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    dataType: {
      type: String,
      required: true,
      enum: ['string', 'number', 'boolean', 'json']
    },
    options: [{
      label: String,
      value: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true
  }
);

// Create compound index
settingSchema.index({ category: 1, key: 1 }, { unique: true });

const defaultSettings = [
  {
    category: 'study',
    key: 'defaultConfidenceThreshold',
    value: 4,
    isPublic: true,
    description: 'Minimum confidence level to consider a card mastered',
    dataType: 'number',
    options: [
      { label: 'Strict', value: 5 },
      { label: 'Normal', value: 4 },
      { label: 'Lenient', value: 3 }
    ]
  },
  {
    category: 'study',
    key: 'spacedRepetitionAlgorithm',
    value: 'supermemo2',
    isPublic: true,
    description: 'Algorithm used for spaced repetition scheduling',
    dataType: 'string',
    options: [
      { label: 'SuperMemo 2', value: 'supermemo2' },
      { label: 'Leitner', value: 'leitner' },
      { label: 'Custom', value: 'custom' }
    ]
  },
  {
    category: 'notifications',
    key: 'studyReminders',
    value: true,
    isPublic: true,
    description: 'Enable daily study reminder notifications',
    dataType: 'boolean'
  },
  {
    category: 'notifications',
    key: 'reminderTime',
    value: '09:00',
    isPublic: true,
    description: 'Daily study reminder time',
    dataType: 'string'
  },
  {
    category: 'privacy',
    key: 'defaultDeckVisibility',
    value: 'private',
    isPublic: true,
    description: 'Default visibility setting for new decks',
    dataType: 'string',
    options: [
      { label: 'Private', value: 'private' },
      { label: 'Public', value: 'public' },
      { label: 'Shared', value: 'shared' }
    ]
  },
  {
    category: 'theme',
    key: 'colorMode',
    value: 'light',
    isPublic: true,
    description: 'Default color mode for the application',
    dataType: 'string',
    options: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
      { label: 'System', value: 'system' }
    ]
  },
  {
    category: 'theme',
    key: 'primaryColor',
    value: '#1890ff',
    isPublic: true,
    description: 'Primary theme color',
    dataType: 'string'
  },
  {
    category: 'theme',
    key: 'fontFamily',
    value: 'default',
    isPublic: true,
    description: 'Font family for the application',
    dataType: 'string',
    options: [
      { label: 'Default', value: 'default' },
      { label: 'Serif', value: 'serif' },
      { label: 'Sans Serif', value: 'sans-serif' }
    ]
  }
];

settingSchema.statics.initializeDefaultSettings = async function() {
  try {
    const count = await this.countDocuments();
    if (count === 0) {
      await this.insertMany(defaultSettings);
      console.log('Default settings initialized');
    }
  } catch (error) {
    console.error('Error initializing default settings:', error);
  }
};

const Setting = mongoose.model("settings", settingSchema);

module.exports = Setting;