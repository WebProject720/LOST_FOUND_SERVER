## LOST_FOUND_SERVER

Welcome to the LOST_FOUND_SERVER repository. This is the backend server for the Lost & Found web application, built using Node.js and Express with a MongoDB database. This project is part of the MERN stack (MongoDB, Express, React, Node.js) and serves as the backend for the application.

### Project Overview

This project is designed to create a lost and found system commonly used by organizations. Users can report lost items by writing messages, and those who find items can post messages. The system facilitates communication between the person who lost the item and the person who found it. Users can log in to the site to manage their messages and replies.

- **Frontend Repository:** [LOST_FOUND_FRONTEND](https://github.com/WebProject720/LOST_FOUND_REACTJS)

### Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Dev Dependencies](#dev-dependencies)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

### Getting Started

These instructions will help you set up the backend server on your local machine for development and testing purposes.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/WebProject720/LOST_FOUND_SERVER.git
   cd LOST_FOUND_SERVER
   ```

2. **Install dependencies:**

   Make sure you have [Node.js](https://nodejs.org/) installed. Then, run:

   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root directory and add the necessary environment variables. Example:

```plaintext
PORT=3000
DB_CONNECTION_STRING=<your-database-connection-string>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

### Running the Server

Start the server using the following command:

```bash
npm run dev
```

The server should now be running on `http://localhost:3000`.

### API Endpoints

Here are some of the main API endpoints provided by this server:

- `POST /api/login` - Authenticate user
- `POST /api/register` - Register a new user
- `POST /api/logout` - Logout user
- `POST /api/forgot-password` - Handle password reset
- `GET /api/profileImage` - Upload User Profile Image
- `POST /api/user-info` - Get logged user info
- `GET /api/send-and-save-otp` - Send OTP to email
- `PUT /api/reply-for-mail` - Write a reply for mail
- `DELETE /api/all-mails` - Delete all mails or data from DB

### Dev Dependencies

- `bcrypt`: ^5.1.1
- `cloudinary`: ^1.41.2
- `concurrently`: ^8.2.2
- `cookie-parser`: ^1.4.6
- `cors`: ^2.8.5
- `dompurify`: ^3.1.6
- `dotenv`: ^16.3.1
- `express`: ^4.18.2
- `jsdom`: ^24.1.0
- `jsonwebtoken`: ^9.0.2
- `mongodb`: ^6.3.0
- `mongoose`: ^8.0.4
- `mongoose-aggregate-paginate-v2`: ^1.0.7
- `multer`: ^1.4.5-lts.1
- `nodemailer`: ^6.9.14
- `two-step-auth`: ^1.1.2

### Scripts

- `start`: `node ./src/index.js`
- `dev`: `nodemon ./src/index.js`

### Deployment

This server is deployed online using the Render platform. You can access the dashboard and manage the deployment at [Render](https://dashboard.render.com/).

### Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

### License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/WebProject720) file for more details.
