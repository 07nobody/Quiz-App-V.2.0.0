/**
 * Accessibility Helpers
 * Utilities to improve accessibility across the application
 */

/**
 * Generate proper ARIA attributes for various components
 */
export const ariaAttributes = {
  /**
   * Generate attributes for a modal
   * @param {string} title - Modal title
   */
  modal: (title) => ({
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': `${title.replace(/\s+/g, '-').toLowerCase()}-title`
  }),

  /**
   * Generate attributes for a button
   * @param {string} label - Button label
   * @param {boolean} isDisabled - Whether button is disabled
   */
  button: (label, isDisabled = false) => ({
    role: 'button',
    'aria-label': label,
    'aria-disabled': isDisabled
  }),

  /**
   * Generate attributes for a tab panel
   * @param {string} id - Tab ID
   * @param {boolean} isSelected - Whether tab is selected
   */
  tab: (id, isSelected = false) => ({
    role: 'tab',
    id: `tab-${id}`,
    tabIndex: isSelected ? 0 : -1,
    'aria-selected': isSelected,
    'aria-controls': `panel-${id}`
  }),

  /**
   * Generate attributes for a tab panel
   * @param {string} id - Panel ID
   * @param {string} labelledBy - Tab ID that labels this panel
   */
  tabPanel: (id, labelledBy) => ({
    role: 'tabpanel',
    id: `panel-${id}`,
    tabIndex: 0,
    'aria-labelledby': labelledBy ? `tab-${labelledBy}` : undefined
  }),

  /**
   * Generate attributes for a form field
   * @param {string} id - Field ID
   * @param {string} label - Field label
   * @param {boolean} isRequired - Whether field is required
   * @param {string} errorMessage - Error message (if any)
   */
  formField: (id, label, isRequired = false, errorMessage = '') => ({
    id: id,
    'aria-label': label,
    'aria-required': isRequired,
    'aria-describedby': errorMessage ? `${id}-error` : undefined,
    'aria-invalid': !!errorMessage
  })
};

/**
 * Keyboard event handlers for common accessibility interactions
 */
export const keyboardHandlers = {
  /**
   * Handler for Space and Enter key on interactive elements
   * @param {Function} onClick - Click handler to call
   */
  activationKey: (onClick) => (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      onClick(e);
    }
  },

  /**
   * Handler for Escape key
   * @param {Function} onEscape - Handler to call on Escape
   */
  escapeKey: (onEscape) => (e) => {
    if (e.key === 'Escape') {
      onEscape(e);
    }
  },

  /**
   * Handler for arrow key navigation within a list
   * @param {number} currentIndex - Current focused index
   * @param {number} maxIndex - Maximum index in the list
   * @param {Function} onChangeIndex - Function to call with new index
   * @param {boolean} vertical - Whether navigation is vertical (true) or horizontal (false)
   */
  arrowNavigation: (currentIndex, maxIndex, onChangeIndex, vertical = true) => (e) => {
    let newIndex = currentIndex;
    
    if ((vertical && e.key === 'ArrowDown') || (!vertical && e.key === 'ArrowRight')) {
      newIndex = Math.min(maxIndex, currentIndex + 1);
      e.preventDefault();
    } 
    else if ((vertical && e.key === 'ArrowUp') || (!vertical && e.key === 'ArrowLeft')) {
      newIndex = Math.max(0, currentIndex - 1);
      e.preventDefault();
    }
    else if (e.key === 'Home') {
      newIndex = 0;
      e.preventDefault();
    }
    else if (e.key === 'End') {
      newIndex = maxIndex;
      e.preventDefault();
    }
    
    if (newIndex !== currentIndex) {
      onChangeIndex(newIndex);
    }
  }
};

/**
 * Create an accessible ID by combining a base ID with an optional suffix
 * @param {string} baseId - Base identifier
 * @param {string} suffix - Optional suffix
 */
export const createAccessibleId = (baseId, suffix = '') => {
  const base = baseId.replace(/\s+/g, '-').toLowerCase();
  return suffix ? `${base}-${suffix}` : base;
};

/**
 * Focus trap for modal dialogs
 * @param {HTMLElement} rootElement - Root element to trap focus within
 * @returns {function} Cleanup function
 */
export const createFocusTrap = (rootElement) => {
  if (!rootElement) return () => {};
  
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  
  const focusableElements = rootElement.querySelectorAll(focusableSelectors.join(','));
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e) => {
    if (!rootElement.contains(document.activeElement)) {
      firstFocusable.focus();
      return;
    }
    
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };
  
  // Focus first element when trap is created
  if (firstFocusable) {
    setTimeout(() => {
      firstFocusable.focus();
    }, 100);
  }
  
  rootElement.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return () => {
    rootElement.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * Check if element should be announced to screen readers
 * @param {HTMLElement} element - Element to check
 */
export const shouldAnnounce = (element) => {
  if (!element) return false;
  
  const { ariaHidden, role, tabIndex } = element.attributes;
  
  return !(
    ariaHidden === 'true' ||
    role === 'presentation' ||
    (tabIndex && parseInt(tabIndex.value) < 0)
  );
};

/**
 * Create a screen reader only element with text
 * @param {string} text - Text to announce
 */
export const srOnly = (text) => {
  const style = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: '0'
  };
  
  return React.createElement('span', { 'aria-live': 'polite', style }, text);
};

export default {
  ariaAttributes,
  keyboardHandlers,
  createAccessibleId,
  createFocusTrap,
  shouldAnnounce,
  srOnly
};