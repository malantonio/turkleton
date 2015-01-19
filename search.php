<?php
/**
 *  conducts a full-text search in the mysql database and returns
 *  the results in a friendly json format.
 */

require "config.php";

/**
 *  switches among scopes to return proper db fields. uses
 *  openURL conventions:
 *      "au" => author search
 *      "kw" => keyword search
 *      "ti" => title search
 *
 *  NOTE: the columns to search are set up in config.php
 *
 *  ALSO NOTE: this is super bare-bones and only set up for the
 *  whopping three fields we're using at the moment.
 *
 *  @param  string  short scope
 *  @return string  group of indexed fields to search
 */

function getScope($s) {
    switch ($s) {
        case "au": return SDB_AUTHOR_COLS;
        case "kw": return SDB_KEYWORD_COLS;
        case "ti": return SDB_TITLE_COLS;
        default: return SDB_KEYWORD_COLS;
    }
}

/**
 *  the simplicity of a pdo search even simpler
 *
 *  NOTE: uses constants defined in config.php:
 *      SDB_HOST -> database host
 *      SDB_NAME -> name of the database
 *      SDB_USER -> user to search database (only requires SELECT privilages)
 *      SDB_PASS -> password for user
 *
 *  @param  string   db query
 *  @param  array    values to prepare statement with
 *  @return array    associative array of results
 */

function querydb($query, array $vals = array()) {
    $addr = "mysql:host=" . SDB_HOST . ';dbname=' . SDB_NAME;
    $pdo = new PDO($addr, SDB_USER, SDB_PASS);
    $stmt = $pdo->prepare($query);
    $stmt->execute($vals);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt->closeCursor();
    return $results;
}

/**
 *  renders a formatted json response and exits
 *
 *  @param string   query used
 *  @param array    results from query
 */

function render_json($query, array $res) {
    $out = array(
        "query" => $query,
        "count" => count($res),
        "results" => $res
    );

    print_r(json_encode($out));
    exit();
}

// declare our json header before we do anything
header("Content-Type: application/json");

/**
 *  if we get nothing, we give nothing
 */

if ( !isset($_GET['q']) && !isset($_GET['s']) ) {
    render_json("", array());
}

/**
 *  define our defaults
 */

$query = isset($_GET['q']) ? $_GET['q'] : "";
$scope = isset($_GET['s']) ? $_GET['s'] : "kw";

/**
 *  do our searching
 */

$field = getScope($scope);
$db_query = "select ". SDB_RETURN_COLS ." from ". SDB_TABLE ." where match(" . $field . ") against(:q)";
$res = querydb($db_query, array("q" => $query));

/**
 *  and then get outta here
 */

render_json($scope . ":" . $query, $res);
