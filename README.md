# WorkNomad

WorkNomad is a platform in India that connects freelancers/remote developers with Property Owners. The platform facilitates searching and booking of:
- Coworking Spaces
- Coliving Spaces
- Meeting Rooms
- Private Offices
- Virtual Offices

## Features
- Modern, responsive UI with animations
- User authentication and authorization
- Property search and filtering
- Booking management system
- Reviews and ratings
- Analytics dashboard for property owners
- Real-time availability updates
- Secure payment integration
- Interactive property maps
- User profiles and history

## Tech Stack
### Frontend
- React.js: Frontend framework
- Material-UI: UI components
- Redux Toolkit: State management
- Framer Motion: Animations
- React Slick: Carousels
- Axios: API requests

### Backend
- Node.js: Runtime environment
- Express.js: Backend framework
- MongoDB: Database
- JWT: Authentication
- Mongoose: ODM
- Bcrypt: Password hashing

## Project Structure
```
worknomad/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── styles/        # CSS files
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js & Express backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── package.json
└── README.md             # Project documentation
```

## Setup Instructions
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd worknomad
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd client && npm install

   # Install backend dependencies
   cd ../server && npm install
   ```

3. Environment Setup:
   - Create a `.env` file in the server directory with:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5003
     ```
   - Create a `.env` file in the client directory with:
     ```
     REACT_APP_API_URL=http://localhost:5003
     PORT=3003
     ```

4. Start the development servers:
   ```bash
   # Start backend server (from server directory)
   npm start

   # Start frontend server (from client directory)
   npm start
   ```

5. Access the application:
   - Frontend: http://localhost:3003
   - Backend API: http://localhost:5003

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License
This project is licensed under the MIT License.
