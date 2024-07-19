import 'dotenv/config'


// import Database
import { DB_connect } from './DB/DB_connect.js';

// import app 
import app from './app.js';
const PORT = process.env.SERVER_PORT || 5001;

DB_connect().then(() => {
    //Start App
    const server=app.listen(PORT, () => {
        console.log(`BACKEND SERVER RUNNING AT PORT : ${server.address().port}`);
    });
}).catch((err) => {
    console.log("MongoDB : CONNECTION FAILED !!");
})