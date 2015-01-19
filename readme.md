# turkleton

`turkleton` is a bare-bones single-page app (w/ a single-file php backend) used to perform a full-text query in mysql
and return the results in a nice-looking table. It's fairly limited in what it can do, but that's partially by design.

## what is it used for?

As our library migrates to a new ILS, we needed a stop-gap solution to be able to search our sheet-music collection, which
consists of ~24,000 records, until they're brought into the system. Using a CSV export of the records, we built a
MySQL table with the information and set up a few basic fulltext search indices to allow broader searching. 

## usage

```cli
$ git clone https://github.com/malantonio/turkleton
$ cd turkleton
$ mv config.sample.php config.php
```

then fill in the constants in `config.php`:

constant           | what it is
-------------------|-------------
`SDB_HOST`         | hostname for the mysql database (probably `localhost` or `127.0.0.1`)
`SDB_NAME`         | database name
`SDB_USER`         | user to access database (`turkleton` only uses `SELECT` queries, so the user can be limited)
`SDB_PASS`         | password for user
`SDB_TABLE`        | table in database to search against
`SDB_RETURN_COLS ` | which columns to return (use `*` to return everything)
`SDB_AUTHOR_COLS ` | which columns make up an author fulltext search
`SDB_KEYWORD_COLS` | which columns make up a keyword fulltext search
`SDB_TITLE_COLS`   | which columns make up a title fulltext search

`search.php` only accepts querystrings with the keys `q` (for the query itself) and `s` (for the scope of the query; currently
limited to `kw` (keyword), `ti` (title), and `au` (author)). This is done via javascript in `index.html`.

## license

MIT (`normalize.css` and `skeleton.css` are both licensed under MIT as well)
