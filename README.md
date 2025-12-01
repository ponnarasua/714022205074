# 🔗 MERN URL Shortener

A modern, full-stack URL shortener application built with the MERN stack (MongoDB, Express, React, Node.js). This application allows users to create short, shareable links with custom IDs and expiration times.

## ✨ Features

- 🎨 **Modern UI** - Beautiful, responsive interface with Material-UI components and gradient design
- ⚡ **Fast & Efficient** - Quick URL shortening with instant results
- 🎯 **Custom IDs** - Create personalized short links with custom identifiers
- ⏰ **Expiration Control** - Set custom expiration times for your short URLs
- 📋 **Copy to Clipboard** - One-click copying of shortened URLs
- 📊 **Click Tracking** - Monitor clicks, user agents, referrers, and IP addresses
- ✅ **Input Validation** - Comprehensive validation for URLs and custom IDs
- 🔄 **Real-time Feedback** - Loading states, success messages, and error handling
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **Material-UI (MUI)** - Component library and styling
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **nanoid** - Unique ID generation

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:8000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📖 Usage

1. **Enter a URL** - Paste the long URL you want to shorten
2. **Set Expiration** - Choose how long the short URL should remain valid (in seconds)
3. **Custom ID (Optional)** - Create a custom identifier for your short URL
4. **Click "Shorten URL"** - Generate your short link
5. **Copy & Share** - Use the copy button to quickly copy your shortened URL

## 🎯 API Endpoints

### Create Short URL
```
POST /shorturls/
```

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very-long-url",
  "validity": 3600,
  "customId": "my-link"
}
```

**Response:**
```json
{
  "shortUrl": "http://localhost:8000/my-link",
  "expiresAt": "2025-11-17T12:00:00.000Z",
  "code": "my-link"
}
```

### Redirect to Original URL
```
GET /:code
```

Redirects to the original URL and tracks the click.

## 🗂️ Project Structure

```
714022205074/
├── Backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Click.js        # Click tracking model
│   │   │   └── ShortUrl.js     # Short URL model
│   │   ├── routes/
│   │   │   ├── redirect.js     # Redirect route
│   │   │   └── shorten.js      # URL shortening route
│   │   ├── db.js               # Database connection
│   │   └── index.js            # Server entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── ShortenerPage.jsx  # Main shortener component
│   │   ├── api.js              # API configuration
│   │   ├── App.jsx             # Root component
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 🎨 UI Enhancements

- **Gradient Backgrounds** - Eye-catching purple gradient theme
- **Animated Icons** - Subtle animations for better UX
- **Material Design** - Following Material-UI best practices
- **Loading States** - Clear feedback during operations
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Snackbar alerts for actions
- **Copy Functionality** - Quick clipboard access
- **Time Formatting** - Human-readable expiration times

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 4000 |
| `MONGODB_URI` | MongoDB connection string | - |
| `BASE_URL` | Base URL for short links | - |

### Frontend API Configuration

Update `Frontend/src/api.js` to match your backend URL:
```javascript
const API = axios.create({
  baseURL: "http://localhost:8000"
});
```

## 🚦 Validation Rules

### URL Validation
- Must be a valid URL format
- Must include `http://` or `https://` protocol

### Custom ID Validation
- 3-30 characters long
- Only letters, numbers, hyphens, and underscores
- Must be unique

### Expiration Time
- Must be a positive number (in seconds)
- Default: 3600 seconds (1 hour)

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Material-UI for the excellent component library
- The MERN stack community
- All contributors and users

---

Made with ❤️ using the MERN stack