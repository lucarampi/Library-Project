const express = require('express');
const mongoose = require('mongoose');
const credentials = require('./credentials.json');
const app = express();

mongoose.connect(credentials.db.mongoDB.host, { useNewUrlParser: true, useUnifiedTopology: true });

const Books = mongoose.model('books', {
    name: String,
    author: String,
    qtd: Number,
    code: String,
    synopsis: String,
    rented: Number
});

app.set('view engine', 'ejs');
app.set('views', __dirname, '/views');
app.use(express.urlencoded());
app.use(express.json());

//Home page
app.get('/', (req, res) => {
    res.render('form_add_book');
});

//List all books (page)
app.get('/books', (req, res) => {
    Books.find({}, (err, element) => {
        if (err) return res.status(500).send('Erro ao consultar livros');
        res.render('books', { items: element });
    });
});

const arrebita = () => {
    let temp_book = new Books();
    temp_book.name = "sdassa";
    temp_book.qtd = 12;
    temp_book.code = "asdsdadsa";
    temp_book.author = "asdsdadsa";
    temp_book.synopsis = "asdsdadsa";
    temp_book.rented = 0;
    temp_book.save()
}
// for (let i = 0; i < 1000; i++) {
//     console.log(i)
//     arrebita()
// }


app.post('/addBook', (req, res) => {
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
})

app.get('/delete/:id', (req, res) => {
    id_to_delete = req.params.id
    Books.deleteOne({ _id: id_to_delete }, (err, result) => {
        console.log(result);
        if (err) return res.status(500).send("Erro ao consultar livro");
    })
    res.redirect('/books');
})

app.get('/edit/:id', (req, res) => {
    Books.findById(req.params.id, (err, result) => {
        if (err) return res.status(500).send("Erro ao consultar livro");
        res.render('form_edit_book', { item: result });
    })
})

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

app.post('/editBook', (req, res) => {
    Books.findById(req.body.id, (err, element) => {
        if (err)
            return res.status(500).send("Erro ao consultar livro");
        element.name = req.body.name;
        element.qtd = req.body.qtd;
        element.code = req.body.code;
        element.author = req.body.author;
        element.synopsis = req.body.synopsis;
        element.save(err => {
            if (err)
                return res.status(500).send("Erro ao cadastrar livro");

            return res.redirect('/books');
        })
    })
})

app.listen(credentials.db.mongoDB.port, () => {
    console.log(`Server is running! (port ${credentials.db.mongoDB.port})`);
})