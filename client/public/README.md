# Login Background Image

The application is looking for a file named `login-bg.jpg` in the public folder. 

## Instructions

1. Add a suitable background image for the login page to the public folder with the name `login-bg.jpg`
2. The image should be high quality and suitable for a login page background
3. Recommended dimensions: 1920x1080px or similar 16:9 aspect ratio
4. Optimize the image for web to keep the file size reasonable (under 500KB)

## Alternative Solution

If you prefer not to add an image file, you can modify the CSS in `src/pages/common/Login/styles.css` to use a gradient background instead:

```css
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: cover;
  background-position: center;
}
```