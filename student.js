const express = require('express');
const path = require('path');
const db = require('./utils/db')
var cookieSession = require('cookie-session')
    //Kết nối database
db.connect()
const app = express();
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, './resources')));
require('./middleware/session.mdw')(app);
require('./middleware/local.mdw')(app);
require('./middleware/view/student_view.mdw')(app);
require('./middleware/route/student_route.mdw')(app);
require('./middleware/error.mdw')(app);
require('./middleware/other.mdw')


const PORT = 3000;
app.listen(PORT, _ => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});