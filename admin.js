const express = require('express');
const path = require('path');
const db = require('./utils/db')
var cookieSession = require('cookie-session')
db.connect()
const app = express();
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],

    maxAge: 24 * 60 * 60 * 1000
  }))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, './resources')));
require('./middleware/session.mdw')(app);
require('./middleware/local.mdw')(app);
require('./middleware/view/admin_view.mdw')(app);
require('./middleware/route/admin_route.mdw')(app);
require('./middleware/error.mdw')(app);
require('./middleware/other.mdw')


const PORT = 4000;
app.listen(PORT, _ => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});