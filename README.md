<<<<<<< HEAD
=======


>>>>>>> 08cc730c7ebdbb3604223a8f4b72f6c0270e563d
## LOST_FOUND_SERVER

Welcome to the LOST_FOUND_SERVER repository. This is the backend server for the Lost & Found web application, built using Node.js and Express.

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
- `GET /api/items` - Get a list of all lost and found items
- `POST /api/items` - Add a new item to the lost and found list
- `GET /api/items/:id` - Get details of a specific item
- `PUT /api/items/:id` - Update details of a specific item
- `DELETE /api/items/:id` - Remove an item from the list

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

<<<<<<< HEAD
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
=======
This project is licensed under the MIT License. See the [LICENSE](https://github.com/WebProject720?tab=repositories) file for more details.

---

Feel free to let me know if you need any more details or changes!
>>>>>>> 08cc730c7ebdbb3604223a8f4b72f6c0270e563d
