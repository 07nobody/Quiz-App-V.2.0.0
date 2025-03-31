import React, { useState } from 'react';
import { Button, Drawer, Radio, Tooltip, Divider, Input, message } from 'antd';
import { 
  SettingOutlined, 
  CheckOutlined, 
  CloseOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Theme customization component 
 * Provides theme preset selection and custom color options
 */
const ThemeCustomizer = () => {
  const [visible, setVisible] = useState(false);
  const [colorPickerKey, setColorPickerKey] = useState('');
  const { 
    currentTheme, 
    themePresets, 
    customColors, 
    changeTheme,
    updateCustomColors,
    resetToDefault,
    getThemeColors
  } = useTheme();
  
  const effectiveColors = getThemeColors();

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    setColorPickerKey('');
  };
  
  const handleThemeChange = (e) => {
    changeTheme(e.target.value);
    message.success('Theme updated successfully!');
  };
  
  const handleColorChange = (key, color) => {
    updateCustomColors({ [key]: color });
  };

  const handleResetTheme = () => {
    resetToDefault();
    message.success('Theme reset to default!');
  };
  
  // Get contrasting text color (black or white) based on background color
  const getContrastColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance using the common formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };
  
  // Color selector component
  const ColorSelector = ({ colorKey, label }) => {
    const currentColor = effectiveColors[colorKey] || themePresets.default[colorKey];
    const isEditing = colorPickerKey === colorKey;
    const textColor = getContrastColor(currentColor);
    
    return (
      <div className="color-selector">
        <div className="color-label">{label}</div>
        {isEditing ? (
          <div className="color-picker-container">
            <Input 
              value={currentColor}
              onChange={(e) => handleColorChange(colorKey, e.target.value)}
              addonBefore="#"
              addonAfter={
                <div style={{display: 'flex', gap: '8px'}}>
                  <CheckOutlined onClick={() => setColorPickerKey('')} />
                </div>
              }
              style={{width: '100%'}}
            />
            <input 
              type="color" 
              value={currentColor}
              onChange={(e) => handleColorChange(colorKey, e.target.value)}
              className="color-input"
            />
          </div>
        ) : (
          <div 
            className="color-swatch" 
            style={{ backgroundColor: currentColor, color: textColor }}
            onClick={() => setColorPickerKey(colorKey)}
          >
            {currentColor}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        icon={<SettingOutlined spin />}
        onClick={showDrawer}
        className="theme-button"
      />
      
      <Drawer
        title="Theme Customizer"
        placement="right"
        onClose={closeDrawer}
        open={visible}
        width={300}
        className="theme-drawer"
        footer={
          <Button 
            onClick={handleResetTheme}
            icon={<ReloadOutlined />}
            block
          >
            Reset to Default
          </Button>
        }
      >
        <div className="theme-selector-section">
          <h3>Theme Presets</h3>
          <Radio.Group onChange={handleThemeChange} value={currentTheme} className="theme-radio-group">
            {Object.entries(themePresets).map(([key, theme]) => (
              <Tooltip title={theme.name} key={key}>
                <Radio.Button 
                  value={key} 
                  className="theme-radio-button"
                  style={{ 
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    color: getContrastColor(theme.primary)
                  }}
                >
                  {currentTheme === key && <CheckOutlined />}
                </Radio.Button>
              </Tooltip>
            ))}
          </Radio.Group>
        </div>
        
        <Divider />
        
        <div className="color-customizer-section">
          <h3>Customize Colors</h3>
          <div className="color-selectors">
            <ColorSelector colorKey="primary" label="Primary Color" />
            <ColorSelector colorKey="accent" label="Accent Color" />
            <ColorSelector colorKey="success" label="Success Color" />
            <ColorSelector colorKey="warning" label="Warning Color" />
            <ColorSelector colorKey="danger" label="Danger Color" />
          </div>
        </div>
      </Drawer>
      
      <style jsx="true">{`
        .theme-button {
          position: fixed;
          bottom: 80px;
          right: 20px;
          z-index: 1000;
          width: 48px;
          height: 48px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        @media (max-width: 768px) {
          .theme-button {
            bottom: calc(var(--mobile-bottom-nav-height) + 16px);
          }
        }
        
        .theme-radio-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }
        
        .theme-radio-button {
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
          padding: 0 !important;
        }
        
        .color-customizer-section {
          margin-top: 16px;
        }
        
        .color-selectors {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 16px;
        }
        
        .color-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .color-label {
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .color-swatch {
          padding: 8px 12px;
          border-radius: 4px;
          font-family: monospace;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          border: 1px solid var(--border-color);
        }
        
        .color-swatch:hover {
          transform: scale(1.02);
        }
        
        .color-picker-container {
          position: relative;
          padding-right: 40px;
        }
        
        .color-input {
          position: absolute;
          right: 0;
          top: 0;
          height: 32px;
          width: 32px;
          padding: 0;
          border: none;
          border-radius: 4px;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default ThemeCustomizer;