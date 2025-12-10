# Image Steganography Tool
A client-side web application for hiding and revealing secret text messages within images using steganography techniques. This tool allows users to embed messages in PNG, JPG, or JPEG images and retrieve them securely, with optional password protection.

## Table of Contents
- Features
- Purpose
- How to Use
- Technical Details
- Installation and Setup
- Limitations
- Contributing
- License

## Features
- <b>Hide Messages:</b> Upload an image, enter a secret message, optionally set a key/password, and download the modified image containing the hidden data.
- <b>Reveal Messages:</b> Upload a steganographed image, enter the key (if used), and display the exact hidden message.
- <b>Drag-and-Drop Support:</b> Easy image upload via drag-and-drop or file selection.
- <b>Image Removal:</b> Remove uploaded images with a red bin icon for re-uploading.
- <b>Password Visibility Toggle:</b> Eye icon in key input fields to show/hide the entered password.
- <b>Error Handling:</b> Displays clear error messages (in red) for invalid keys, corrupted images, or capacity issues.
- <b>Responsive Design:</b> Modern, colorful UI with glassmorphism effects, optimized for desktop and mobile.
- <b>Client-Side Only:</b> No server required; all processing happens in the browser for privacy and security.

## Purpose
This app demonstrates image steganography, a technique for concealing data within digital media. It's useful for:
- Secure communication (e.g., hiding messages in images for discreet sharing).
- Educational purposes (learning about LSB steganography and basic encryption).
- Privacy-focused data hiding (no data is sent to any server; everything stays local).
Note: This is not intended for high-security applications. Use strong keys and avoid JPG/JPEG for hiding to prevent data loss due to compression.

## How to Use
1. <b>Open the App:</b> Load index.html in a modern web browser (Chrome, Firefox, Safari, etc.).
2. #### Hide a Message
   - Upload an image (PNG recommended) via drag-and-drop or click.
   - Enter your secret message in the textarea.
   - Enter a key/password for encryption (optional).
   - Click "Hide Message and Download" to save the steganographed image.
3. #### Reveal a Message:- 
   - Upload the modified image.
   - Enter the key (if used during hiding).
   - Click "Reveal Message" to see the hidden text.
### Additional Controls:
- Click the red bin icon to remove an uploaded image.
- Click the eye icon in key fields to toggle password visibility.

## Technical Details

1. ### Logic and Algorithms
- <b>Steganography Method:</b> Least Significant Bit (LSB) substitution. The app modifies the least significant bits of the RGB channels in image pixels to encode binary data. This is imperceptible to the human eye but recoverable with the correct key.
- <b>Encryption:</b> Optional XOR (exclusive OR) encryption with a user-provided key. The key is repeated cyclically to match the message length. If no key is provided, the message is hidden in plain binary.
- <b>Hiding:</b> Prepends a 32-bit binary length prefix to the message, encrypts the whole with XOR, and embeds it in LSBs.
- <b>Revealing:</b> Extracts LSBs, decrypts with XOR, reads the length prefix, and slices the exact message.
- <b>Capacity Check:</b> Ensures the image has enough pixels (3 bits per pixel) to hold the data; alerts if the message is too long.
- <b>Error Detection:</b> Validates extracted data; shows errors for wrong keys, corrupted images, or insufficient data.

2. ### Technologies and Languages
- <b>HTML5:</b> Structure of the web app, including forms, dropzones, and UI elements.
- <b>CSS3:</b> Styling with modern features like backdrop-filter for glassmorphism, flexbox for layout, and responsive design.
- <b>JavaScript (ES6+):</b> Core functionality, including Canvas API for image processing, event handling, and steganography logic. No external libraries (e.g., no jQuery or React) for simplicity and performance.

3. ### Browser APIs:
- <b>Canvas 2D API</b> for reading/writing image data.
- <b>File API</b> for handling uploads and downloads.
- <b>Blob API</b> for generating downloadable images.
- <b>No Server-Side:</b> Pure client-side app; runs entirely in the browser. Compatible with any modern browser supporting ES6+ and Canvas.

4. ### File Structure
- <b>index.html:</b> Main HTML file with UI structure.
- <b>styles.css:</b> CSS for styling and layout.
- <b>script.js:</b> JavaScript for logic, event listeners, and steganography functions.

## Installation and Setup
- <b>Download Files:</b> Save index.html, styles.css, and script.js in the same directory.
- <b>Run Locally:</b> Open index.html in a web browser. No installation or server needed.
- <b>Hosting (Optional):</b> Upload to a static web host like GitHub Pages, Netlify, or Vercel for online access.
- <b>Requirements:</b> Modern browser with JavaScript enabled. No dependencies.

## Limitations
- <b>Image Formats:</b> PNG is lossless and recommended. JPG/JPEG may corrupt hidden data due to compression.
- <b>Message Size:</b> Limited by image resolution (e.g., a 400x400 image can hold ~48,000 characters).
- <b>Security:</b> Basic XOR encryption; not suitable for sensitive data. LSB changes are subtle but detectable with analysis tools.
- <b>Browser Compatibility:</b> Requires Canvas support (most modern browsers). Mobile browsers may have limited performance for large images.
- <b>No Persistence:</b> Data is not stored; refresh the page to reset.

## License
This project is open-source under the MIT License. Use at your own risk. No warranties provided.



