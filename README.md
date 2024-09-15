# FilterPixel Hiring Challenge

## Table of Contents
1. [Objective](#objective)
2. [Demo](#demo)
3. [Local Setup Instructions](#local-setup-instructions)
    - [Frontend Setup](#frontend-setup)
    - [Backend Setup](#backend-setup)
4. [Features Checklist](#features-checklist)
5. [Tech Stack](#tech-stack)
    - [Backend](#backend)
    - [Frontend](#frontend)
6. [Image Storage](#image-storage)
7. [Main Components](#main-components)
    - [ImageControls](#1-imagecontrols)
    - [ImagePreview](#2-imagepreview)
    - [ImageUpload](#3-imageupload)
    - [ImageDownload](#4-imagedownload)
8. [API Endpoints](#api-endpoints)
    - [Image Upload](#1-image-upload)
    - [Image Download](#2-image-download)
    - [Brightness Adjustment](#3-brightness-adjustment)
    - [Saturation Adjustment](#4-saturation-adjustment)
    - [Contrast Adjustment](#5-contrast-adjustment)
    - [Image Rotation](#6-image-rotation)
    - [Image Cropping](#7-image-cropping)
    - [Reset Image](#8-reset-image)

---

## Objective
Build a full-stack image processing web application that accepts image uploads, processes them on the backend, and provides real-time previews of the manipulated image. Users can download the final processed image in their desired format (PNG or JPEG).

## Demo


## Local Setup Instructions

### Frontend Setup:
1. Navigate to the `frontend` directory.
2. Install dependencies: 
    ```bash
    npm i
    ```
3. Set up the environment variables:
    - Copy the contents from `.envexample` to `.env`.
4. Start the frontend development server: 
    ```bash
    npm run dev
    ```
5. Open your browser at the provided URL to interact with the web application.

### Backend Setup:
1. Navigate to the `backend` directory.
2. Install dependencies: 
    ```bash
    npm i
    ```
3. Start the backend server: 
    ```bash
    npm start
    ```

## Features Checklist

- [x] **Image Upload**
  - Users can upload images in PNG or JPEG format.
  - Backend validates the file type and stores it temporarily in the `uploads` folder.
  
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
  - Final image download is in high quality and saved in the `exports` folder.
  
- [x] **Reset**
  - Reset all image manipulations and return to the original state.

---

## Tech Stack

### Backend:
- **Node.js** - Server-side JavaScript runtime
- **Express** - Web framework for creating REST APIs
- **Multer** - Middleware for handling file uploads
- **Sharp** - Library for high-performance image processing
- **TypeScript** - Type safety and maintainability

### Frontend:
- **React** - Frontend library for building user interfaces
- **Context API** - State management across components
- **TypeScript** - Type safety for better code structure and error handling

---

## Image Storage

- **Uploads Folder**: 
  - `uploads/original`: Contains the original image uploaded by the user.
  - `uploads/preview`: Contains the preview images generated after real-time processing.
  
- **Exports Folder**: 
  - Contains all the final exported high-quality images after processing for user download.
  
- **Static Files**: Both `uploads` and `exports` directories are exposed as static files, making the images accessible through the frontend for previews and downloads.

---

## Main Components

### 1. **ImageControls**
- Handles the various image manipulations (brightness, contrast, saturation, rotation, cropping).
- Contains sliders for real-time adjustment of the image properties.
- Sends real-time updates to the backend for immediate preview feedback.

### 2. **ImagePreview**
- Displays the real-time preview of the manipulated image.
- Updates dynamically as the user changes brightness, contrast, saturation, and rotation.
- Shows the cropped version of the image after cropping is applied.

### 3. **ImageUpload**
- Component responsible for handling image uploads from the user.
- Validates the image format (PNG/JPEG) before sending it to the backend.
- Provides a preview of the uploaded image before any manipulations.

### 4. **ImageDownload**
- Allows users to download the final processed image.
- Provides options for the user to choose the image format (PNG or JPEG) before downloading.
- Fetches the high-quality image from the backend and prompts the user to save it locally.

---

## API Endpoints

### 1. Image Upload
- **Endpoint**: `/api/upload`
- **Method**: `POST`
- **Description**: Uploads an image (PNG or JPEG) and stores it temporarily on the server in the `uploads/original` folder.

### 2. Image Download
- **Endpoint**: `/api/download`
- **Method**: `GET`
- **Description**: Downloads the processed image in high-quality from the `exports` folder based on the user’s selected format (PNG or JPEG).

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
