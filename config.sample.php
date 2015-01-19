<?php
/**
 *  database info
 */

define("SDB_HOST", "127.0.0.1");
define("SDB_NAME", "");
define("SDB_USER", "");
define("SDB_PASS", "");
define("SDB_TABLE", "");

/**
 *  what columns from the database do you want to include
 *  in the returned results? ("*" will return everything)
 */

define("SDB_RETURN_COLS", "call_number,title,author,note,alt_title");


/**
 *  comma-delimited list of which columns are
 *  fulltext indexed to which search
 */

define("SDB_AUTHOR_COLS", "author");
define("SDB_KEYWORD_COLS", "title,note,alt_title,author");
define("SDB_TITLE_COLS", "title,note,alt_title");

