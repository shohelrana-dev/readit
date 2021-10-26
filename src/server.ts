//external import
import app from './config/express-config';
import {createConnection} from 'typeorm';

//server run
const _port = process.env.PORT || 4000;
app.listen(_port, async () => {
    console.log(`Server running at http://localhost:${_port}`);
    try {
        await createConnection();
        console.log('Database connected');
    } catch (err) {
        console.log(err);
    }
})
