<?php 
// https://getgrav.org/blog/macos-sonoma-apache-multiple-php-versions
// sphp 8.1

/*
    FP HELPERS


function curry($func)
{
    return function () use ($func) {
        $args = func_get_args();
        return function () use ($func, $args) {
            return call_user_func_array($func, array_merge($args, func_get_args()));
        };
    };
}

function flatten(iterable $coll): array
{
    $result = [];
    foreach ($coll as $value) {
        if (is_iterable($value)) {
            foreach (flatten($value) as $v) {
                $result[] = $v;
            }
        } else {
            $result[] = $value;
        }
    }
    return $result;
}

function filter(callable $fn, iterable $coll): array
{
    $args = to_array($coll);
    try {
        return array_filter($args, $fn, ARRAY_FILTER_USE_BOTH);
    } catch (ArgumentCountError $error) {
        return array_filter($args, $fn);
    }
}

function filter_fresh(callable $fn, iterable $coll): array
{
    return array_values(filter($fn, $coll));
}

function map(callable $fn, iterable $coll): array
{
    try {
        return ___map_indexed($fn, $coll);
    } catch (ArgumentCountError $error) {
        return array_map($fn, to_array($coll));
    }
}

function ___map_indexed(callable $fn, iterable $coll): array
{
    $result = [];
    foreach ($coll as $key => $value) {
        $result[$key] = $fn($value, $key);
    }
    return $result;
}

function to_array(iterable $coll): array
{
    return $coll instanceof Traversable ? iterator_to_array($coll) : $coll;
}

function apply(callable $fn, iterable $args = [])
{
    return $fn(...to_array($args));
}

function reduce(callable $fn, iterable $coll, $initial = null)
{
    $acc = $initial;
    foreach ($coll as $key => $value) {
        $acc = $fn($acc, $value, $key);
    }
    return $acc;
}

function pipe(callable ...$fns): callable
{
    $compose = static function ($composition, $fn) {
        return static function (...$args) use ($composition, $fn) {
            return null === $composition
                ? $fn(...$args)
                : $fn($composition(...$args));
        };
    };
    return reduce($compose, $fns);
}

function sorter(callable $fn, iterable $coll): array
{
    $sorted = to_array($coll);
    usort($sorted, $fn);
    return $sorted;
}

$sort = curry("sorter");
$map = curry("map");
$filter = curry("filter");
$filter_fresh = curry("filter_fresh");
$reduce = curry("reduce");
$flattenCurry = curry("flatten");
$flattened = $flattenCurry();

*/

/*
    FP TESTS
*/
/*
// CURRY
echo '<p>CURRY</p>';

$add = fn($x, $y) => $x + $y;
$add_curry = curry($add);
$add2 = $add_curry(2);

echo $add2(10);
echo '<br><br>';




// MAP
echo '<p>MAP</p>';

$map_curry = $map($add2);
$maps2 = $map_curry([1, 2, 3, 4, 5]);

$maps = map($add2, [1, 2, 3, 4, 5]);

print_r($maps);
echo '<br>';
print_r($maps2);

echo '<br><br>';



// FILTERS
echo '<p>FILTERS</p>';

$animals = [
    0 => ['name' => 'Jerry', 'species' => 'mouse'],
    1 => ['name' => 'Tweety', 'species' => 'bird'],
    2 => ['name' => 'Tom', 'species' => 'cat'],
    3 => ['name' => 'Sylvester', 'species' => 'cat'],
];

$cats = fn($animal) => $animal['species'] === 'cat';

// $moreThan10 = fn ($number) => $number > 10;

$moresCurry = $filter_fresh(fn($number) => $number > 10);
$mores = $moresCurry([1, 5, 8, 13, 19, 11, 10]);

print_r($mores);
echo '<br>';


$cats_filtered = $filter($cats)($animals);
$cats_fresh_curry = $filter_fresh($cats);
$cats_fresh = $cats_fresh_curry($animals);

print_r($cats_filtered);
echo '<br>';
print_r($cats_fresh);

echo '<br>';

echo $cats_filtered[2]["name"];
echo '<br>';
echo $cats_fresh[0]["name"];

echo '<br><br>';




// FLATTEN
echo '<p>FLATTEN</p>';

print_r($flattened([1, [2, 3], [4, [5, 6], [[[[[7, 8]]]]]]]));
echo '<br><br>';




// SORT
echo '<p>SORT</p>';

$mysort = fn($one, $other) => $one === $other ? 0 : ($one > $other ? 1 : -1);
$sort_curry = $sort($mysort);

print_r($sort_curry([9, 1, 2, 3, 4, 1, 5, 6, 7, 4, 9, 8]));
echo '<br><br>';



// PIPE
echo '<p>PIPE</p>';

$multiplier = fn($a, $b) => $a * $b;
$byTwoDivider = fn($num) => $num / 2;

$my_pipe = pipe($multiplier, $byTwoDivider, $add2);
echo apply($my_pipe, [20, 10]);


