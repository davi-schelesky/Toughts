const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express();

// Models e config
const conn = require('./db/conn')
const Tought = require('./models/Tought')
const User = require('./models/User')

//Routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

// Controllers
const ToughtsController = require('./controllers/ToughtController')

//===TEMPLATE ENGINE===
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

//Receber resposta do body
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

//session middleware - onde o express salvará as sessões
app.use(session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: () => {},
        path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}))

// Flash messages
app.use(flash());

// public path
app.use(express.static('public'));

// set session to res
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session;
    }

    next();
})

// Direcionamento das rotas
app.use('/toughts', toughtsRoutes);
app.use('/', authRoutes);

app.get('/', ToughtsController.showToughts);

conn.sync().then(() => {
    app.listen(3000, () => {
        console.log("Server rodando na porta 3000!");
    })
}). catch ((error) => console.log(`Não foi possível conectar ao banco, erro: ${error}`));