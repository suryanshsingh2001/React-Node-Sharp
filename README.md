# FilterPixel Hiring Challenge: Image Processing Web Server with Real-Time Preview

## Objective
Build a full-stack image processing web application that accepts image uploads, processes them on the backend, and provides real-time previews of the manipulated image. Users can download the final processed image in their desired format (PNG or JPEG).

---

## Features Checklist

- [x] **Image Upload**
  - Users can upload images in PNG or JPEG format.
  - Backend validates the file type and stores it temporarily.
  
- [x] **Real-Time Image Processing**
  - Low-quality previews are generated for fast real-time feedback.
  
- [x] **Image Conversion**
  - Convert images between PNG and JPEG.
  
- [x] **Brightness Adjustment**
  - Slider for adjusting image brightness in real-time.
  
- [x] **Contrast Adjustment**
  - Slider for adjusting image contrast in real-time.
  
- [x] **Saturation Adjustment**
  - Slider for adjusting image saturation in real-time.
  
- [x] **Image Rotation**
  - Rotate images from 0-360 degrees with real-time preview.
  
- [x] **Image Cropping**
  - Select a specific part of the image and crop it.
  
- [x] **Final Image Download**
  - Download the fully processed image in PNG or JPEG format.
  - Final image download is in high quality.
  
- [x] **Reset**
  - Reset all image manipulations and return to the original state.

---

## Tech Stack

### Backend:
- **Node.js** - Server-side JavaScript runtime
- **Express** - Web framework for creating REST APIs
- **Sharp** - Library for high-performance image processing
- **TypeScript** - Type safety and maintainability

### Frontend:
- **React** - Frontend library for building user interfaces
- **Context API** - State management across components
- **TypeScript** - Type safety for better code structure and error handling

---

## API Endpoints

### 1. Image Upload
- **Endpoint**: `/api/upload`
- **Method**: `POST`
- **Description**: Uploads an image (PNG or JPEG) and stores it temporarily on the server.

### 2. Image Download
- **Endpoint**: `/api/download`
- **Method**: `GET`
- **Description**: Downloads the processed image in high-quality based on the user’s selected format (PNG or JPEG).

### 3. Brightness Adjustment
- **Endpoint**: `/api/brightness`
- **Method**: `POST`
- **Description**: Adjusts the brightness of the image in real-time based on the slider input.

### 4. Saturation Adjustment
- **Endpoint**: `/api/saturation`
- **Method**: `POST`
- **Description**: Adjusts the saturation of the image in real-time based on the slider input.

### 5. Contrast Adjustment
- **Endpoint**: `/api/contrast`
- **Method**: `POST`
- **Description**: Adjusts the contrast of the image in real-time based on the slider input.

### 6. Image Rotation
- **Endpoint**: `/api/rotate`
- **Method**: `POST`
- **Description**: Rotates the image by a specific degree (0-360) and provides a real-time preview.

### 7. Image Cropping
- **Endpoint**: `/api/crop`
- **Method**: `POST`
- **Description**: Crops the image based on the selected area and provides a real-time cropped preview.

### 8. Reset Image
- **Endpoint**: `/api/reset`
- **Method**: `POST`
- **Description**: Resets all the image manipulations and reverts back to the original state of the image.

---

## How to Run the Project

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the backend server: `npm run server`.
4. Start the frontend client: `npm start`.

---

## License
This project is licensed under the MIT License.
