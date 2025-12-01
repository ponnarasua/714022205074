 Quick Setup Guide

## Prerequisites
- Node.js v14+ installed
- MongoDB running (locally or Atlas)

## Backend Setup

1. Navigate to Backend folder:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:8000
```

4. Start the server:
```bash
npm run dev
```

Backend will run on: http://localhost:8000

## Frontend Setup

1. Navigate to Frontend folder:
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

Frontend will run on: http://localhost:5173

## Testing

1. Open http://localhost:5173 in your browser
2. Enter a URL to shorten
3. Optionally set expiration time and custom ID
4. Click "Shorten URL"
5. Copy and share your shortened link!

## Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify `.env` file exists with correct values
- Check if port 8000 is available

**Frontend won't start:**
- Make sure all dependencies are installed
- Check if port 5173 is available
- Verify `src/api.js` has correct backend URL

**Short URLs not working:**
- Make sure backend is running
- Check MongoDB connection
- Verify BASE_URL in backend `.env` matches your setup

## Common Issues

**CORS errors:**
- Backend `index.js` has CORS enabled for all origins
- For production, update CORS settings to specific domains

**MongoDB connection fails:**
- Check if MongoDB service is running
- Verify connection string in `.env`
- For Atlas, check network access settings

## Features

✅ URL shortening with custom IDs
✅ Expiration time control
✅ Click tracking
✅ Copy to clipboard
✅ Responsive design
✅ Input validation
✅ Loading states & error handling

## Production Deployment

For production:
1. Update `BASE_URL` in backend `.env`
2. Update `baseURL` in frontend `src/api.js`
3. Build frontend: `npm run build`
4. Serve built files
5. Use environment variables for sensitive data
6. Enable HTTPS
7. Set up proper MongoDB security

## Tech Stack

- **Frontend:** React + Material-UI + Vite
- **Backend:** Node.js + Express + MongoDB
- **Database:** MongoDB with Mongoose
- **ID Generation:** nanoid

Happy URL shortening! 🔗
