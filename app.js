const express = require('express');
const mongooseBook = require('mongoose');
const mongooseUser = require('mongoose');
const credentials = require('./credentials.json');
const logged_user = require('./logged.json')
const app = express();

mongooseBook.connect(credentials.db.mongoDB.host, { useNewUrlParser: true, useUnifiedTopology: true });

const Books = mongooseBook.model('books', {
    name: String,
    author: String,
    qtd: Number,
    code: String,
    synopsis: String,
    rented: Number
});

const Users = mongooseBook.model('users', {
    name: String,
    password: Number,
    role: Number
});

app.set('view engine', 'ejs');
app.set('views', __dirname, '/views');
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("public"));

//Home page
app.route('/add')
    .get((req, res) => {
        res.render('form_add_book');
    })
    .post((req, res) => {
        let temp_book = new Books();
        temp_book.name = req.body.name;
        temp_book.qtd = req.body.qtd;
        temp_book.code = req.body.code;
        temp_book.author = req.body.author;
        temp_book.synopsis = req.body.synopsis;
        temp_book.rented = 0;
        temp_book.save((err) => {
            if (err) return res.status(500).send('Erro ao cadastrar livro');
            return res.redirect('/books');
        })
    });

app.route('/')
    .get((req, res) => {
        res.redirect('/books');
    });

app.route('/books')
    .get((req, res) => {
        Books.find({}, (err, element) => {
            if (err) return res.status(500).send('Erro ao consultar livros');
            res.render('books', { items: element, user: require('./logged.json') });
        });
    });

app.post('/delete/:id', (req, res) => {
    console.log(req)
    id_to_delete = req.params.id
    Books.deleteOne({ _id: id_to_delete }, (err, result) => {
        console.log(result);
        if (err) return res.status(500).send("Erro ao consultar livro");
    });
    res.redirect('/books');
});

app.post('/edit/:id', (req, res) => {
    Books.findById(req.params.id, (err, result) => {
        if (err) return res.status(500).send("Erro ao consultar livro");
        res.render('form_edit_book', { item: result });
    })
})

app.post('/editBook', (req, res) => {
    Books.findById(req.body.id, (err, temp_book) => {
        if (err)
            return res.status(500).send("Erro ao consultar livro");
        temp_book.name = req.body.name;
        temp_book.qtd = req.body.qtd;
        temp_book.code = req.body.code;
        temp_book.author = req.body.author;
        temp_book.synopsis = req.body.synopsis;
        temp_book.save(err => {
            if (err)
                return res.status(500).send("Erro ao cadastrar livro");
            return res.redirect('/books');
        });
    });
});

app.post('/login', (req, res) => {
    const {
        name, password
    } = req.body

    console.log(name)
    console.log(password)

    Users.find({ password: password }, (err, temp_user) => {
        console.log(temp_user)
        if (err)
            return res.status(500).send("Erro ao encontrar usuário, utilize credenciais válidas");
        const {
            name, role
        } = temp_user[0]

        logged_user.logged = name
        logged_user.role = role
        console.log(logged_user)
        return res.redirect('/books');

    });
});

app.post('/logout', (req, res) => {
    logged_user.logged = 0
    logged_user.role = 0
    return res.redirect('/books');

});



app.post('/search', (req, res) => {
    console.log(typeof req.body.search);
    let temp_search = req.body.search;
    Books.find({
        $or: [
            { name: { $regex: new RegExp("^.*" + temp_search + ".*$", "i") } },
            { code: { $regex: new RegExp("^.*" + temp_search + ".*$", "i") } },
            { author: { $regex: new RegExp("^.*" + temp_search + ".*$", "i") } }
        ]
    }, (err, result) => {
        console.log(result);
        if (err) return res.status(500).send("Erro ao consultar livro");
        res.render('books_search', { items: result });
    })
})

app.listen(credentials.db.mongoDB.port, () => {
    console.log(`Server is running! (port ${credentials.db.mongoDB.port})`);
})