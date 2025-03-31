#!/bin/bash

# Reorganization script for Quiz Application
echo "Starting project reorganization..."

# Base directories
PROJECT_ROOT="/home/neel/Documents/TYBCA-FINAL-PROJECT/Project-Quiz-Application"
CLIENT_DIR="$PROJECT_ROOT/client"
SERVER_DIR="$PROJECT_ROOT/server"

# 1. Create new directory structure in client
echo "Creating new directory structure..."
mkdir -p $CLIENT_DIR/src/components/core
mkdir -p $CLIENT_DIR/src/components/layout
mkdir -p $CLIENT_DIR/src/components/ui
mkdir -p $CLIENT_DIR/src/components/forms
mkdir -p $CLIENT_DIR/src/services/api
mkdir -p $CLIENT_DIR/src/utils/helpers
mkdir -p $CLIENT_DIR/src/utils/constants
mkdir -p $CLIENT_DIR/src/hooks
mkdir -p $CLIENT_DIR/src/assets/images
mkdir -p $CLIENT_DIR/src/assets/icons

# 2. Organize server-side code better
echo "Organizing server structure..."
mkdir -p $SERVER_DIR/controllers
mkdir -p $SERVER_DIR/utils
mkdir -p $SERVER_DIR/config/db
mkdir -p $SERVER_DIR/config/auth

# 3. Move API services to proper location
echo "Reorganizing API services..."
mkdir -p $CLIENT_DIR/src/services/api
cp $CLIENT_DIR/src/apicalls/*.js $CLIENT_DIR/src/services/api/

# 4. Consolidate styles
echo "Consolidating styles..."
mkdir -p $CLIENT_DIR/src/styles/themes
mkdir -p $CLIENT_DIR/src/styles/components
mkdir -p $CLIENT_DIR/src/styles/layouts
mkdir -p $CLIENT_DIR/src/styles/pages

# Create main style index for importing all styles
cat > $CLIENT_DIR/src/styles/index.js << EOL
/**
 * Main styles entry point
 * Centralizes all style imports
 */

// Base styles and themes
import './main.css';
import './themes/light.css';
import './themes/dark.css';

// Component-specific styles
import './components/buttons.css';
import './components/cards.css';
import './components/forms.css';
import './components/navigation.css';

// Layout styles
import './layouts/admin.css';
import './layouts/user.css';
import './layouts/auth.css';
EOL

# Move existing stylesheets to new organized structure
echo "Moving stylesheets to new structure..."
if [ -d "$CLIENT_DIR/src/stylesheets" ]; then
  # Move theme styles
  [ -f "$CLIENT_DIR/src/stylesheets/theme.css" ] && cp "$CLIENT_DIR/src/stylesheets/theme.css" "$CLIENT_DIR/src/styles/themes/base.css"
  
  # Move component styles
  [ -f "$CLIENT_DIR/src/stylesheets/custom-components.css" ] && cp "$CLIENT_DIR/src/stylesheets/custom-components.css" "$CLIENT_DIR/src/styles/components/custom.css"
  
  # Move layout styles
  [ -f "$CLIENT_DIR/src/stylesheets/layout.css" ] && cp "$CLIENT_DIR/src/stylesheets/layout.css" "$CLIENT_DIR/src/styles/layouts/main.css"
  
  # Copy index.css
  [ -f "$CLIENT_DIR/src/index.css" ] && cp "$CLIENT_DIR/src/index.css" "$CLIENT_DIR/src/styles/main.css"
fi

# 5. Create client side structure for components
echo "Moving components to better structure..."

# Function to categorize components
categorize_components() {
  local source_dir=$1
  
  # Core components (fundamental building blocks)
  echo "Categorizing core components..."
  for component in PageTitle Loader ErrorBoundary ProtectedRoute LottiePlayer FormHelper MessageProvider ResourcePreloader; do
    if [ -f "$source_dir/${component}.js" ] || [ -f "$source_dir/${component}.jsx" ]; then
      find "$source_dir" -name "${component}.*" -exec cp {} "$CLIENT_DIR/src/components/core/" \;
      echo " - Moved $component to core components"
    fi
  done

  # Layout components
  echo "Categorizing layout components..."
  for component in Navigation BottomNav AppContent Sidebar Header Footer ActionButtons; do
    if [ -f "$source_dir/${component}.js" ] || [ -f "$source_dir/${component}.jsx" ]; then
      find "$source_dir" -name "${component}.*" -exec cp {} "$CLIENT_DIR/src/components/layout/" \;
      echo " - Moved $component to layout components"
    fi
  done

  # UI components
  echo "Categorizing UI components..."
  for component in ExamCard AvailableExamCard InfoItem DarkModeToggle ResponsiveCard AchievementBadge LevelUpNotification ConfettiEffect; do
    if [ -f "$source_dir/${component}.js" ] || [ -f "$source_dir/${component}.jsx" ]; then
      find "$source_dir" -name "${component}.*" -exec cp {} "$CLIENT_DIR/src/components/ui/" \;
      echo " - Moved $component to UI components"
    fi
  done

  # Form components
  echo "Categorizing form components..."
  for component in LoginForm EnhancedQuestionEditor QuestionEditor RegisterForm; do
    if [ -f "$source_dir/${component}.js" ] || [ -f "$source_dir/${component}.jsx" ]; then
      find "$source_dir" -name "${component}.*" -exec cp {} "$CLIENT_DIR/src/components/forms/" \;
      echo " - Moved $component to form components"
    fi
  done
}

# Process the components directory
if [ -d "$CLIENT_DIR/src/components" ]; then
  categorize_components "$CLIENT_DIR/src/components"
fi

# Create index.js files for each component directory to enable better imports
for dir in core layout ui forms; do
  if [ -d "$CLIENT_DIR/src/components/$dir" ] && [ "$(ls -A "$CLIENT_DIR/src/components/$dir")" ]; then
    echo "Creating index.js for $dir components..."
    
    # Start the index file
    echo "/**
 * $dir Components
 * Auto-generated index file
 */
" > "$CLIENT_DIR/src/components/$dir/index.js"
    
    # Add exports for each component in the directory
    for file in "$CLIENT_DIR/src/components/$dir"/*; do
      if [[ "$file" != *"index.js"* ]]; then
        filename=$(basename "$file")
        component_name="${filename%.*}"
        echo "export { default as $component_name } from './$filename';" >> "$CLIENT_DIR/src/components/$dir/index.js"
      fi
    done
  fi
done

# 6. Remove duplicate src directory from root (after ensuring everything is moved)
echo "Cleaning up duplicate directories..."
if [ -d "$PROJECT_ROOT/src" ]; then
  # Check if we've copied everything important
  echo "Checking for content in root src directory before removal..."
  src_file_count=$(find "$PROJECT_ROOT/src" -type f | wc -l)
  
  if [ $src_file_count -gt 0 ]; then
    echo "WARNING: Found $src_file_count files in root src directory."
    echo "Creating backup before removal..."
    backup_dir="$PROJECT_ROOT/temp/src_backup_$(date +%Y%m%d%H%M%S)"
    mkdir -p "$backup_dir"
    cp -r "$PROJECT_ROOT/src"/* "$backup_dir/"
    echo "Backup created at $backup_dir"
  fi
  
  rm -rf "$PROJECT_ROOT/src"
  echo "Removed duplicate src directory from project root"
fi

# Create a helpful README in the client/src directory
cat > $CLIENT_DIR/src/README.md << EOL
# Project Structure

This project follows a standardized structure to improve maintainability and code organization.

## Directories

- \`assets/\`: Images, icons, and other static assets
- \`components/\`: React components organized by category
  - \`core/\`: Fundamental building blocks and utilities
  - \`layout/\`: Structural components (navigation, sidebar, etc.)
  - \`ui/\`: Reusable UI components
  - \`forms/\`: Form-specific components
- \`contexts/\`: React context providers
- \`hooks/\`: Custom React hooks
- \`pages/\`: Page components organized by user role
- \`redux/\`: Redux store, slices, and actions
- \`services/\`: API services and external integrations
- \`styles/\`: CSS styles organized by purpose
- \`utils/\`: Utility functions and helpers

## Best Practices

1. Import components from index files (e.g., \`import { Button } from 'components/ui'\`)
2. Keep components focused on a single responsibility
3. Centralize API calls in the services directory
4. Use proper code splitting for improved performance
EOL

echo "Project reorganization complete!"
exit 0
