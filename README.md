# BloodHero Backend

Backend API for the BloodHero blood donation platform.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values as needed

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Donors
- `GET /api/donors` - Get all donors
- `GET /api/donors/:id` - Get donor by ID
- `POST /api/donors` - Create a new donor
- `PUT /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Delete donor

### Blood Requests
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get request by ID
- `POST /api/requests` - Create a new request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request

### Emergency Requests
- `GET /api/emergency` - Get all emergency requests
- `POST /api/emergency` - Create emergency request
- `PUT /api/emergency/:id` - Update emergency request

### Volunteers
- `GET /api/volunteers` - Get all volunteers
- `POST /api/volunteers` - Register as volunteer
- `GET /api/volunteers/:id` - Get volunteer by ID

### File Uploads
- `POST /api/upload/profile-image` - Upload profile image
- `POST /api/upload/multiple` - Upload multiple files
- `DELETE /api/upload/:filename` - Delete uploaded file

### Statistics
- `GET /api/stats/overall` - Get overall platform statistics
- `GET /api/stats/donor/:donorId` - Get donor statistics
- `GET /api/stats/monthly` - Get monthly donation statistics (Admin only)
- `GET /api/stats/location` - Get request statistics by location (Admin only)

### Donation Events
- `GET /api/events` - Get all donation events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create a new donation event (Admin only)
- `PUT /api/events/:id` - Update an event (Admin or Organizer)
- `DELETE /api/events/:id` - Delete an event (Admin or Organizer)
- `POST /api/events/:id/volunteer` - Register as volunteer for an event
- `DELETE /api/events/:id/volunteer` - Cancel volunteer registration

### Dashboard
- `GET /api/dashboard/admin` - Get dashboard data for admin (Admin only)
- `GET /api/dashboard/donor` - Get dashboard data for donor
- `GET /api/dashboard/hospital` - Get dashboard data for hospital (Hospital only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Delete all notifications
- `POST /api/notifications/send` - Send notification to users (Admin only)

## Real-time Features

BloodHero uses Socket.IO for real-time notifications and updates:

### Socket Events
- `join` - Join user's personal room
- `joinBloodTypeRoom` - Join blood type specific room
- `joinLocationRoom` - Join location-based room

### Notification Types
- `new_blood_request` - New blood donation request
- `emergency_request` - Emergency blood request
- `request_fulfilled` - Blood request fulfilled
- `new_donation_event` - New donation event
- `donation_reminder` - Donation reminder
- `profile_update` - Profile update
- `volunteer_opportunity` - Volunteer opportunity
- `admin_announcement` - Admin announcement

## Project Structure

```
back/
├── config/
│   └── db.js                # Database configuration
├── controllers/             # Request handlers
│   ├── auth.controller.js   # Authentication controller
│   ├── dashboard.controller.js # Dashboard data
│   ├── donor.controller.js  # Donor management
│   ├── emergency.controller.js # Emergency requests
│   ├── event.controller.js  # Donation events
│   ├── notification.controller.js # Notifications
│   ├── request.controller.js # Blood requests
│   ├── stats.controller.js  # Statistics
│   ├── upload.controller.js # File uploads
│   └── volunteer.controller.js # Volunteer management
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── checkRole.js         # Role-based authorization
│   └── errorHandler.js      # Error handling
├── models/                  # Database models
│   ├── BloodRequest.js
│   ├── Donor.js
│   ├── EmergencyRequest.js
│   ├── Event.js
│   ├── User.js
│   └── Volunteer.js
├── routes/                  # API routes
│   ├── auth.routes.js
│   ├── dashboard.routes.js
│   ├── donor.routes.js
│   ├── emergency.routes.js
│   ├── event.routes.js
│   ├── notification.routes.js
│   ├── request.routes.js
│   ├── stats.routes.js
│   ├── upload.routes.js
│   └── volunteer.routes.js
├── tests/                   # Test files
│   ├── auth.test.js
│   └── setup.js
├── uploads/                 # Uploaded files storage
├── utils/                   # Utility functions
│   ├── email.js             # Email notifications
│   ├── fileUpload.js        # File upload utilities
│   ├── geo.js               # Geolocation utilities
│   ├── notifications.js     # Notification system
│   ├── socket.js            # Socket.IO integration
│   ├── statistics.js        # Statistics utilities
│   └── validation.js        # Input validation
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── package.json             # Project dependencies
├── README.md                # Project documentation
└── server.js                # Entry point
```

## Technologies Used
- Node.js
- Express
- MongoDB/Mongoose
- JWT Authentication
- Socket.IO (Real-time communication)
- Nodemailer
- Multer (File uploads)
- Google Maps Services (Geolocation)

## Testing
Run tests with:
```
npm test
```

## License
MIT
