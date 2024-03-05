<?php
/* Version 1.2.0 */
namespace T4\CSVRedirect;



                
/**
 * CSV Redirect T4Version
 *
 * @package      T4
 * @subpackage   CSVRedirect
 * @category     CSVRedirect
 * @author       TerminalFour
 */
/* T4Version.php 
namespace T4\CSVRedirect;

 */

/**
 * Default Class to determine the version
 *
 * Specify the current version of the PHP Module
 * @internal This Class is used only internal to check version
 */
class T4Version
{
    /** @var string $version Current version number */
    private static $version    = "1.2.0";

    /**
     * get Current version number
     *
     * Method that returns the current version number
     * @see http://php.net/manual/en/function.version-compare.php
     *
     * @return string Version number.
     */
    public static function getVersion()
    {
        return self::$version;
    }
}

                
                
/**
 * CSV Redirect Core
 *
 * @package      T4
 * @subpackage   CSVRedirect
 * @category     CSVRedirect
 * @author       TerminalFour
 */
/* Core.php 
namespace T4\CSVRedirect;

 */


/**
 * Main Class to handle the CSV Redirects
 *
 * Handle the Smart 404 Script that redirect or show the 404 page using a list of URL passed via
 * @internal This Class is used only internal to check version
 */
class Core
{
    /**
     * Static function used to run the Smart 404 Script
     *
     * ##### CSV file path.
     * With `basename` is taking just the name of file of the current section.
     * The given CSV should be stricly of 2 columns where the first column is the URL that needs to be matched and the second one is that URL where needs to be redirect.
     *
     * ###### Used with File element
     * ```php
     * $element_filename = basename('< t4 type="content" name="CSV File" output="file" />');
     * ```
     * ###### Used with Media element
     * ```php
     * $element_filename = '< t4 type="content" name="CSV File" output="normal" formatter="path/*" />';
     * ```
     *
     * ##### Exact match setting variable
     * Used to determine if it will use an exact match or an approximate one.
     * Approximate match will return the redirect URL of those path that are at least 85% similar to that original file.
     * It is a string since is used within an element in **TERMINAL**FOUR.
     * It a boolean function and will be check if it is empty or not.
     *
     * ##### Domain including setting variable:
     * Used to determine if use the full URL or just the relevant path
     * It is a string since is used within an element in **TERMINAL**FOUR.
     * It a boolean function and will be check if it is empty or not.
     *
     * @param  string  $element_filename           CSV file path
     * @param  boolean|string $element_exactmatch  Exact Match setting variable
     * @param  boolean|string $element_ignorequery Domain including setting variable
     *
     * @return int use to pass the best percent for testing purpose
     */
    public static function run($element_filename, $element_exactmatch = false, $element_ignorequery = false)
    {

        ini_set("auto_detect_line_endings", true);
        //Check to work only not in preview.

        if (!preg_match("/t4_([0-9]{16,20}+)\.php/Ui", $_SERVER['REQUEST_URI'])) {
            //Check exactly instead using percent
            if (!empty($element_exactmatch)) {
                $exact_match = true;
            }

            if (!empty($element_ignorequery)) {
                $ignore_query = true;
            }

            // Get the referrer
            if (isset($ignore_query) && $ignore_query == true) {
                $request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            } else {
                $request = $_SERVER['REQUEST_URI'];
            }

            // convert to lower case
            $request = strtolower($request);

            // strip tid=whatever& out of the URI
            $request = preg_replace("(tid=[0-9]*&)", "", $request);

            // strip ekmensel whatever out of the URI
            $request = preg_replace("(&ekmensel=[a-zA-Z0-9_]*)", '', $request);


            $pregRequest = $request;
            $request = rtrim($request, '/');

            // prepare to read the redirects file
            $filename = $element_filename;

            if (is_file($filename)) {
                $handle = @fopen($filename, "r");
                if ($handle === false) {
                    echo "Unable to open file!";
                    return 0;
                }
            } else {
                echo "Unable to find file!";
                return 0;
            }

            // assume the worst case
            $best_percent = -1;
            $redirect_target = '';

            // open the CSV file with the redirects
            if (($handle = fopen($filename, "r")) !== false) {
                // while there is data to read, get a line
                while (($data = fgetcsv($handle, 1000, ",")) !== false) {
                    $pregFromURL = $fromURL    = isset($data[0]) ? strtolower($data[0]) : '';
                    $pregToURL = $toURL      = isset($data[1]) ? $data[1] : '';
                    // if any bits are blank, skip this entry
                    if ('' == trim($fromURL)) {
                        continue;
                    }
                    if ('' == trim($toURL)) {
                        continue;
                    }

                    $fromURL = rtrim($fromURL, '/');
                    $toURL = rtrim($toURL, '/');

                    if (strpos($fromURL, '*') !== false || strpos($toURL, '*') !== false) {
                        if (strpos($fromURL, '*') !== false) {
                            if (strpos(basename($pregRequest), '.') === false && substr($pregRequest, -1) !== '/' && strpos($pregRequest, '?') === false) {
                                $pregRequest .= '/';
                            }
                            $pregFromURL = str_replace('\*', '(.*)', preg_quote($pregFromURL));
                            $pregFromURL = str_replace('/', '\/', $pregFromURL);
                            
                            $check = preg_match('/^'.$pregFromURL.'$/', $pregRequest) === 1;
                        } else {
                            $pregFromURL = preg_quote($fromURL);
                            $pregFromURL = str_replace('/', '\/', $pregFromURL);
                            $check = $request == $fromURL;
                        }
                        
                        if ($check) {
                            if (strpos($toURL, '*') !== false) {
                                $toURLArray = preg_split('/\*/Ui', $pregToURL);
                                $i = 1;
                                $pregToURL = '';
                                foreach ($toURLArray as $part) {
                                    if (empty($part)) {
                                        $pregToURL .= '$'.$i;
                                        $i++;
                                    } else {
                                        $pregToURL .= $part;
                                    }
                                }
                                $redirect_target = preg_replace('/^'.$pregFromURL.'/', $pregToURL, $pregRequest);
                                $redirect_target = rtrim($redirect_target, '/');
                                $best_percent = 100;
                                break;
                            } else {
                                $redirect_target = $toURL;
                                $redirect_target = rtrim($redirect_target, '/');
                                $best_percent = 100;
                                break;
                            }
                        }
                    } elseif (isset($exact_match) && $exact_match === true) {
                        if ($request == $fromURL) {
                            $best_percent = 100;
                            $redirect_target = $toURL;
                            break;
                        }
                    } else {
                        // work out how similar the url is to the one the user tried
                        similar_text($request, $fromURL, $percent);

                        // if it's the best one so far then remember that
                        if ($percent > $best_percent) {
                            $best_percent = $percent;
                            $redirect_target = $toURL;
                        }
                        if ($best_percent == 100) {
                            break;
                        }
                    }
                }

                // close the file
                fclose($handle);
            }

            // if the best match was better than a 50% match
            if ($best_percent > 85) {
                // issue a 301 redirect
                header("HTTP/1.0 301 Moved Permanently");

                // if the target URL has a :// send it as a relative redirect
                // otherwise send it as a fully qualified (external) redirect
                if (strpos($redirect_target, '://') !== false) {
                    header("Location: " . $redirect_target);
                } else {
                    header("Location: https://" . $_SERVER['HTTP_HOST'] . $redirect_target);
                }
                header("Connection: close");
                return $best_percent;
            }

            // if there was not match in excess of 50%, redirect to the regluar 404
            header("HTTP/1.0 404 Not Found");
            return $best_percent;
        }

        return 0;
    }

    /**
     * Process the CSV File and Redirects to the 404 Page
     *
     * Extension of run method used to redirect to a different 404 page
     * @see Core::[run](#run)()
     *
     * @param  string  $element_filename           CSV file path
     * @param  string  $redirectPath               Path of the 404 page
     * @param  boolean|string $element_exactmatch  Exact Match setting variable
     * @param  boolean|string $element_ignorequery Domain including setting variable
     *
     * @return int use to pass the best percent for testing purpose
     */
    public static function runAndRedirect($element_filename, $redirectPath = "/404", $element_exactmatch = false, $element_ignorequery = false)
    {

        $best_percent = self::run($element_filename, $element_exactmatch, $element_ignorequery);
        if (!($best_percent > 85)) {
            $_GET['e'] = 404; //Set the variable for the error code
            header("Location: https://" . $_SERVER['HTTP_HOST'] . $redirectPath);
        }
        return $best_percent;
    }
}

                