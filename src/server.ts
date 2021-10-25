//external import
import app from './config/express-config';
import {createConnection} from 'typeorm';

//server run
app.listen(process.env.PORT, async () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
    try {
        await createConnection();
        console.log('Database connected');
    } catch (err) {
        console.log(err);
    }
})
