<?php
//Initialise
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '0');

require('dbi.php');
require('class.stemmer.inc.php');
require('renderer.class.php');

//$uri = 
/* if (empty($_SERVER['HTTP_X_FORWARDED_SERVER'])) {
	$uri = implode('/',array_slice(explode('/',$_SERVER['SCRIPT_NAME']), 0, -1));;
} else {
}
 */
$uri = 'https://www.stir.ac.uk/news/find-an-expert';

if (!function_exists('str_ireplace')) { 
    function str_ireplace($needle, $str, $haystack) { 
        return preg_replace("/$needle/i", $str, $haystack); 
    }
}

/**
 * Replace last occurence of a string within a string
 */
function str_lreplace($search, $replace, $subject)
{
    return strrpos($subject, $search) !== false ? substr_replace($subject, $replace, strrpos($subject, $search), strlen($search)) : $subject;
}

class MediaGuideBase extends Renderer {

    
    private $DICTIONARY = array(       
		1                   => 'one',
        2                   => 'two',
        3                   => 'three',
        4                   => 'four',
        5                   => 'five',
        6                   => 'six',
        7                   => 'seven',
        8                   => 'eight',
        9                   => 'nine',
        10                  => 'ten');
    
    static function searchtype() {
        return empty($_REQUEST['searchtype']) ? "0" : $_REQUEST['searchtype'];
    }
    
    static function safepost() {
        return empty($_REQUEST['query']) ? '' : preg_replace('/[^\'\- a-zA-z0-9]/', '',$_REQUEST['query']);
	}
	
	public function sanitise($input) {
		return preg_replace('/[^\'\- a-zA-z0-9]/', '',$input);
	}
    
    static function mgpath() {
        return self::getCurrentURI(); //$_SERVER["PHP_SELF"];
    }
    
    static function getCurrentURI() {
        //$uri = implode('/', array_slice(explode('/', $_SERVER['SCRIPT_NAME']), 0, -1)) . '/';
        
        //echo '<!-- ' . print_r($_SERVER, true) . ' -->';
        //subtract the base-path from the rewrittern URI (so this can run in any subfolder - everything is relative to the base-path.)
        //$uri = substr((empty($_SERVER['REDIRECT_URL'])?$_SERVER['REQUEST_URI']:$_SERVER['REDIRECT_URL']), strlen($uri));
        //if there is a query string chop it off, we'll deal with it later - it's not part of routing.
        //$has_query_string_pos = strpos($uri, '?');
		//return $has_query_string_pos===false ? $uri : substr($uri, 0, $has_query_string_pos);
		global $uri;
        return $uri;
    }

}

class MediaGuide extends MediaGuideBase {
    
    private $flag, $exactwords, $browser, $hitphrases, $partwords, $meta;

	public $expert_name,$expert_in;

    public function __construct($browser) {
        $this->browser = $browser;
        $this->partwords = array();
        $this->expert_name = '/expert/name/'; //'browse.php?n='; //
		$this->expert_in   = '/expert/in/';   //'browse.php?f='; //
		$this->meta = array(
			'pagetitle'=>'Find an expert',
			'pagedescription'=>'The University of Stirling’s Expert Search offers you a quick and efficient way to find experts working in areas of current media interest.',
			'pagekeywords'=>array('academic expert', 'media guide', 'expert topic', 'academic discipline', 'search for an expert'));
    }
    
	private function getResearchHubLink($email)
	{
		//return;
		if(empty($email)) {
			return;
		}
		//disable SSL checking!
		/* $contextOptions = array(
			'ssl' => array(
				'verify_peer' => false,
				'verify_peer_name' => false
			)
		);
		$context = stream_context_create($contextOptions); */
		$data = '';
		$email = urlencode($email);
		$url = "https://search.stir.ac.uk/s/search.json?collection=stir-research&query=[type:profile][email:$email]&fmo=true";
		//$data = file_get_contents($fb, false, $context);

		//  Initiate curl
		$ch = curl_init();
		// Will return the response, if false it print the response
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		// Set the url
		curl_setopt($ch, CURLOPT_URL,$url);
		// Execute
		$result=curl_exec($ch);
		// Closing
		curl_close($ch);

		$data = json_decode($result, true);

		//var_dump($data);

		if(empty($data)) {
			return; // failed to get data?
		}
		
		if(empty($data["response"])){
			return; // failed to decode data?
		}
		if($data['response']['resultPacket']['resultsSummary']['fullyMatching'] == 0) {
			return; //no results!
		}

		return $data['response']['resultPacket']['results'][0]['liveUrl'];
	}
    
    public function footer() {
        $data = array();
        
        $sql = 'SELECT COUNT(DISTINCT e.ID) as total FROM experts e LEFT JOIN `ExpertToSpecialism` s ON e.ID = s.ExpertID WHERE ExpertSpecialismsID IS NOT NULL';
        $result = mysqli_query($GLOBALS['link'], $sql);
        $row = mysqli_fetch_assoc($result);
		$data['browseByName'] = MediaGuide::getCurrentURI() . '/' . $this->browser.'/name/';
		$data['totalExperts'] = $row['total'];
 
		$sql = 'SELECT COUNT(s.ID) as total FROM ExpertSpecialisms s LEFT JOIN `ExpertToSpecialism` e2 ON s.ID = ExpertSpecialismsID WHERE e2.ExpertID IS NOT NULL';
        $result = mysqli_query($GLOBALS['link'], $sql);
        $row = mysqli_fetch_assoc($result);
		$data['browseByTopic'] = MediaGuide::getCurrentURI() . '/' . $this->browser.'/';
		$data['totalTopics'] = $row['total'];

		$data['more'] = $this->render('still-looking');
        
        return $this->output($data, 'footer');
    }
    
    
    public function search() {
        $r = array();
        if((MediaGuide::searchtype() === "0" )&&(is_array($this->hitphrases))){
            foreach($this->hitphrases as $word){ 
                $r[] = '<a href="?query='.$word.'">'.$word.'</a>';
            }
        }
        return  implode(' | ', $r); 
    }
    
    public function form() {
        return $this->output(array('mgpath'=>''/*MediaGuide::mgpath()*/,'safepost' => MediaGuide::safepost(),'searchtype' => MediaGuide::searchtype()), 'form');
    }
    
    public function query() {
        //Handle the query
		if(MediaGuide::safepost()!==''){
			$myStemmer = new Stemmer();
			$rhs = $this->render('still-looking');
			$q = MediaGuide::safepost();
			$this->flag = 0;
			$q = trim($q);
			$q = strtolower($q);
			$q = str_replace("-",' ',$q);
			$alpha = str_replace(' ',':',$q);
			$boom = explode(':', $alpha);
			$words = array();
			$temp = array();
			
			$this->exactwords = array();
			
			$i=0;	
			foreach($boom as $pop){
				//CREATE A STEMMED (and escaped) VERSION...
				$words[$i] = "'".mysqli_real_escape_string($GLOBALS['link'], $myStemmer->stem($pop))."'";// mysql_real_escape_string() to escape apostrophe, etc.
		
				//AND A COPY OF THE ORIGINAL WORD
				$wordtracker[$i] = $pop;
				$i++;
			}
			
			$sql = "SELECT ID, Phrase FROM `ExpertDictionary` WHERE `Phrase` IN (".implode(',', $words).")";
			if($result = mysqli_query($GLOBALS['link'], $sql)){
				while($row = mysqli_fetch_assoc($result)){
					$this->flag = 1; //HIT
					$this->exactwords[] = $row['ID'];
					$temp[$row['ID']] = $row['Phrase'];
					$this->hitphrases[] = $wordtracker[array_search("'".$row['Phrase']."'", $words, false)];
				}
				if(mysqli_num_rows($result) < 1){
					$sql = "SELECT ID FROM `ExpertDictionary` WHERE ";
					$sql2 = array();
						foreach($boom as $word){
							if(!in_array($word, $temp)){
								$sql2[] = " `Phrase` LIKE '".$word."%' ";
							}
						}
					$sql .= implode(' OR ', $sql2);
					if($result = mysqli_query($GLOBALS['link'], $sql)){
						$flagok = 0;
						while($row = mysqli_fetch_assoc($result)){
							//PARTIAL HITS 
							$this->partwords[] = $row['ID'];
							$flagok = 1;
						}
						if($flagok == 1) {$this->flag += 2; }
					}
					else {}
				}
			}
			else{}
		}
	}
	
	public function getMeta() {
		return $this->meta;
	}
    
    public function results() {
        
        $r = '';


        if(isset($this->flag)){
        	if($this->flag > 0){
        		if(MediaGuide::searchtype() === "1"){
        		$searchtype = 'Name Search';
        		$sql = '
        		SELECT DISTINCT e.*, s.*, d.Name as department, f.Name as faculty
        		FROM (
        		  (SELECT * FROM `NamesIndex` 
        		     WHERE ';
        		   if($this->flag === 1 || $this->flag === 3){
           			 foreach($this->exactwords as $keywordID){
        				$sqltemp[] = '`SpecialismID` IN (SELECT SpecialismID FROM `NamesIndex` WHERE `DictionaryID` = \''.$keywordID.'\')';
        			 }
        			 $sql .= '( '.implode(' AND ', $sqltemp) . ' )';
        		  }
        		  if( $this->flag === 2){
        		     foreach($this->partwords as $keywordID){
        				$sqltemp[] = '`SpecialismID` IN (SELECT SpecialismID FROM `NamesIndex` WHERE `DictionaryID` = \''.$keywordID.'\')';
        			 }
        			 $sql .= implode(' OR ', $sqltemp);
        		  }
        		  if( $this->flag === 3){
        		     foreach($this->partwords as $keywordID){
        				$sqltemp[] = '`SpecialismID` IN (SELECT SpecialismID FROM `NamesIndex` WHERE `DictionaryID` = \''.$keywordID.'\')';
        			 }
        			 $sql .= ' AND ( ' . implode(' AND ', $sqltemp) . ' ) ';
        		  }
        		   $sql .= '
        		     )
        		  ) 
        		  a,
        		  `experts` e,
        		  `ExpertSpecialisms` s,
				  `Department` d,
				  `Faculty` f,
        		  `ExpertToSpecialism` e2s
        		WHERE
        		e.ID = a.SpecialismID AND 
        		e2s.ExpertID = e.id AND
        		e2s.ExpertSpecialismsID = s.ID AND
				d.ID = e.dept AND
				f.ID = e.faculty
        		ORDER BY e.Surname
        		';
        		} else {
        			$searchtype = 'Topic Search';
        		
        		$sql = '
        		SELECT DISTINCT e.*, s.`Specialism`, s.`SpAlpha`, d.`Name` as department, f.`Name` as faculty
        		FROM (
        		  (SELECT SpecialismID FROM `SpecialismIndex` 
        		     WHERE ';
        		   if($this->flag === 1 || $this->flag === 3){
           			 foreach($this->exactwords as $keywordID){
        				$sqltemp[] = '`SpecialismID` IN (SELECT SpecialismID FROM `SpecialismIndex` WHERE `DictionaryID` = \''.$keywordID.'\')';
        			 }
        			 $sql .= '( '.implode(' AND ', $sqltemp) . ' )';
        		  }
        		  if( $this->flag === 2){
        		     foreach($this->partwords as $keywordID){
        				$sqltemp[] = '`SpecialismID` IN (SELECT SpecialismID FROM `SpecialismIndex` WHERE `DictionaryID` = \''.$keywordID.'\')';
        			 }
        			 $sql .= implode(' OR ', $sqltemp);
        		  }
        		  if( $this->flag === 3){
        		     foreach($this->partwords as $keywordID){
        				$sqltemp[] = '`SpecialismID` IN (SELECT SpecialismID FROM `SpecialismIndex` WHERE `DictionaryID` = \''.$keywordID.'\')';
        			 }
        			 $sql .= ' AND ( ' . implode(' AND ', $sqltemp) . ' ) ';
        		  }
        		   $sql .= '
        		     )
        		  ) 
        		  a,
        		  `ExpertSpecialisms` s,
        		  `experts` e,
        		  `Department` d,
          		  `Faculty` f,
        		  `ExpertToSpecialism` e2s
        		WHERE
        		s.ID = a.SpecialismID AND 
        		e2s.ExpertSpecialismsID = s.ID AND
        		e.id = e2s.ExpertID AND
				d.ID = e.dept AND
				f.ID = e.faculty
        		ORDER BY s.Specialism ASC
        		';
        		}
        		
        		if($result = mysqli_query($GLOBALS['link'], $sql)){
        			
        			$number_of_results = mysqli_num_rows($result);
        			
        			if($number_of_results > 0){           

            			if(MediaGuide::searchtype() === "0"){
							$srch = $this->search();
							$r .= ('<div id="searchtopper"><p><span id="type">Your '. strtolower($searchtype));
							$r .= empty($srch) ? '' : ' for &ldquo;' . $srch . '&rdquo;';
            			    $r .= (' <span id="results">returned '. $number_of_results .' result'.($number_of_results===1?'':'s').'</span></p>'); //($number_of_results <= 10 ? $this->DICTIONARY[$number_of_results] : $number_of_results)
            			    $r .= ('</div>');
            			}
        				
        			} else{
        				$r .= ('<p>No Results.</p>');
        				$r .= ('<p>If you are unable to find what you are looking for you can try the <a href="' . MediaGuide::getCurrentURI() . '/' . $this->browser.'/">Expert Directory Index</a>.</p>');
        				/* if(count($this->hitphrases)>0 && MediaGuide::searchtype() === "0"){
        					$r .= ('<p>Perhaps focus on the main area of your search?<br>'.$r.'</p>');
        				} */
        			}
        		} else { $r .=  mysqli_error($GLOBALS['link']); }
        		
        		if(MediaGuide::searchtype() === "0"){
        			//TOPIC SEARCH
        			while($row = mysqli_fetch_assoc($result)){
        				
        				
        				$data = array();
						$data['fn']         = $row['Title'].' '.$row['name'].' '.$row['Surname'];
						$data['url']        = $this->expert_name .$row['alpha_id'];
						$data['department'] = $row['department'];
						$data['faculty']    = $row['faculty'];
						$data['telephone']  = $row['telephone'];
						$data['note']		= empty($row['Note']) ? '' : $row['Note'];
						$data['topic'] 		= $row['Specialism'];
						list($data['email'], $data['mailto']) = $this->getObfuscatedEmail($row['email']);
        				
        				//$op = '<p><span class="stir-largerlink"><a href="' . $this->expert_in .$row['SpAlpha'].'">'.$row['Specialism'].'</a></span><br>'..'<br>'.$row['faculty'].'<br>'.$row['telephone'].'<br>'.
        				//'<a href="mailto:'.$x0mailto.'">'.$x0email.'</a>'.$note.'</p>';
        				$r .=  $this->render('topic', $data); //$op;
        			}
        		} else {
        			//NAME SEARCH
        			$thisName = '';
        			$thatName = '';
        			$op = '';
        			$headcount = 0;
        			
        			
        			while($row = mysqli_fetch_assoc($result)){
        				
						$thisName = $row['Title'].' '.$row['name'].' '.$row['Surname'];
						$data = array();
						$data['fn']         = $thisName;
						$data['url']        = $this->expert_name .$row['alpha_id'];
						$data['department'] = $row['department'];
						$data['faculty']    = $row['faculty'];
						$data['telephone']  = $row['telephone'];
						$data['note']		= empty($row['Note']) ? '' : $row['Note'];
						//$data['specialism'] = $row['Specialism'];

        				if($thisName != $thatName){
							
							list($data['email'], $data['mailto']) = $this->getObfuscatedEmail($row['email']);
							$op .= $this->render('contact', $data);
							//'<p><span class="stir-largerlink"><a href="'. .'">'.$thisName.'</a></span><br>'.$row['department'].'<br>'.$row['faculty'].'<br>'.$row['telephone'].'<br>'.'<a href="mailto:'.$x0mailto.'">'.$x0email.'</a>'.$note.'</p>';
        					$headcount++;
        				} else {
        					
        				}
        				$thatName=$thisName;
        			}
        			$r .= ('<p><span id="results">Showing '.$headcount.' result'.($headcount!= 1?'s':'').'</span></p>');
        			$r .= ('<br class="clearer">');
					//$r .= $this->render('grid-container', array('grid' => $op));
					$r .= $op;
        		}
        	}
            else {
                //$r .= ('<p>No Results.</p>');
                $r .= ('<p>If you are unable to find what you are looking for, please try the <a href="'.$this->browser.'">Expert Directory Index</a>.</p>');
        	}
        }
        else {

            $r .= $this->output(array('browser'=>$this->browser), 'default');

        }

        return $r;// . $this->footer();
    }
    
    public function listing() {
        /***
         * SQL updated 12/10/2009 to include only Experts and Specialisms that are 
         * linked up via the ExpertsToSpecialisms table. This is to account for 
         * the updated database which may include redundant data. For example an 
         * orphan Specialism that is no longer related to any expert. 
         ***/
         
            $_REQUEST['by'] = (empty($_REQUEST['by'])?'':$_REQUEST['by']);
         
        	if($_REQUEST['by'] == 'name'){
        		$sql = 'SELECT DISTINCT e.Surname, e.name, e.alpha_id FROM `experts` e LEFT JOIN `ExpertToSpecialism` s ON e.ID = s.ExpertID WHERE ExpertSpecialismsID IS NOT NULL ORDER BY e.Surname';
        	} elseif($_REQUEST['by'] == 'dept'){
        		$sql = "
        		SELECT DISTINCT 
        			e.Surname, e.name, e.alpha_id, d.Name 
        		FROM 
        			`experts` e LEFT JOIN
        			 ExpertToSpecialism e2s ON (e.ID = e2s.ExpertID),
        			 Department d,
        			 ExpertToDepartment e2d
        		WHERE
        			ExpertSpecialismsID IS NOT NULL AND
        			e2d.ExpertID = e.id AND 
        			d.ID = e2d.DepartmentID 
        		ORDER BY 
        			d.Name, e.Surname";
        	} elseif($_REQUEST['by']=='dept-topic'){
        		$sql = '
        		SELECT DISTINCT a.Specialism, a.SpAlpha, d.Name as `department`
        		FROM 
        			 `experts` e LEFT JOIN
        			 ExpertToSpecialism e2s ON (e.ID = e2s.ExpertID),
        			Department d,
        			`ExpertSpecialisms` a,
        			ExpertToDepartment e2d
        		WHERE
        			ExpertSpecialismsID IS NOT NULL AND
        			e2d.ExpertID = e.ID AND
        			a.ID = e2s.ExpertSpecialismsID AND
        			d.ID = e2d.DepartmentID
        		ORDER BY d.Name ASC , a.Specialism ASC';
        	} else {
        		$sql = "
        		SELECT DISTINCT
        			a.*
        		FROM
        			`experts` e LEFT JOIN
        			 ExpertToSpecialism e2s ON (e.ID = e2s.ExpertID),
        			`ExpertSpecialisms` a
        		WHERE
        			ExpertSpecialismsID IS NOT NULL AND
        			e2s.ExpertSpecialismsID = a.ID
        			
        		ORDER BY
        			a.SpAlpha";
        	}
        	$result = mysqli_query($GLOBALS['link'], $sql);
        	echo mysqli_error($GLOBALS['link']);
        	$world_n = array();
        	$world_f = array();
        	$x = 0;
        	while($row = mysqli_fetch_assoc($result)){
        		//echo('<!-- '.$row['SpAlpha'].' | '.strtoupper(substr($row['SpAlpha'],0,1)).' -->');
        
        		if($_REQUEST['by'] == 'name'){
        			$alpha = strtoupper(substr($row['Surname'],0,1));
        			$world_f[$alpha][$x] = $this->expert_name.$row['alpha_id'];
        			$world_n[$alpha][$x] = $row['Surname'].', '.$row['name'];
        			$x++;
        		} elseif($_REQUEST['by'] == 'dept-topic'){
        			$alpha = ($row['department']);
        			$world_f[$alpha][$x] = $this->expert_in.$row['SpAlpha'];
        			$world_n[$alpha][$x] = $row['Specialism'];
        			$x++;
        		}elseif($_REQUEST['by'] == 'dept'){
        			$alpha = ($row['Name']);
        			$world_f[$alpha][$x] = $this->expert_name.$row['alpha_id'];
        			$world_n[$alpha][$x] = $row['Surname'].', '.$row['name'];
        			$x++;
        		} else {			
        			$alpha = strtoupper(substr($row['SpAlpha'],0,1));
        			$world_f[$alpha][$x] = $this->expert_in.$row['SpAlpha'];
        			$world_n[$alpha][$x] = $row['Specialism'];
        //			$temptemptemp[$alpha][$x] = $row['SpAlpha'];
        			$x++;
        		}
        	}

		$r = '<div id="menuwrapper"><ul id="p7menubar">';
		
		if(($_REQUEST['by'] == 'dept') || ($_REQUEST['by'] == 'dept-topic')){$glue = ' | ';} else {$glue = ' ';}
		
		foreach($world_n as $alpha => $item){
			$frag = urlencode(str_replace(' ','-', strtolower($alpha)));
		
			$navi[] = '<a href="#'.$frag.'">'.$alpha.'</a>';
        	$r .= '<li>
            	<p class="alphaheader"><a id="'.$frag.'"></a>'.$alpha.'</p>
          		<ul>';
             foreach($item as $k => $hyperlink){ 
                	$r .= '
					<li><a href="'.$world_f[$alpha][$k].'">'.$world_n[$alpha][$k].'</a></li>';
             }
			 $r .= '
                 </ul>
             </li>';
        }
		$r .= '</ul>';
		$r = ('<p>'.implode($glue,$navi).'</p>') . $r . '</div>';

        return $r;
        	
    }
    
    public function meta() {
        
        //$this->meta = array('pagetitle'=>'', 'pagedescription'=>'', 'pagekeywords'=>'');
        
        if(isset($_GET['by'])){
        	/***
        	 *	Sets the metadata for the browsing pages.
        	 ***/
        	switch($_GET['by']){
        		case 'dept-topic':
        		  $this->meta['pagetitle'] = 'Expert Guide - Find specific expertise in an academic discipline at the University of Stirling';
         		  $this->meta['pagedescription'] = 'A selected list of expertise areas listed by academic discipline to help you find a expert on a given topic.';
        		  $this->meta['pagekeywords'] = array('expert guide','academic experts','experts at the university of Stirling');
        		  break;
        		
        		case 'name':
        		  $this->meta['pagetitle'] = 'Expert Guide - Find an academic expert by name';
         		  $this->meta['pagedescription'] = 'An alphabetical list of experts at the University of Stirling';
        		  $this->meta['pagekeywords'] = array('list of experts','expert guide','academic experts','experts at the university of Stirling');
        		  break;
        		
        		case 'dept':
        		  $this->meta['pagetitle'] = 'Expert Guide - Find an academic expert';
         		  $this->meta['pagedescription'] = 'An alphabetical list of experts at the University of Stirling as ordered by academic discipline';
        		  $this->meta['pagekeywords'] = array('list of experts','experts guide','academic expert search','experts at the university of Stirling');
				break;
		}
		} else {
			$this->meta['pagetitle'] = 'Guide to academic experts | University of Stirling';
		}
        return $this->meta;
	}
	
	/**
	 * Protect an email address (a bit, maybe?) by obfuscating it with HTML entities and hex-codes.
	 * @param email (String) The email address we want to protect.
	 */
	public function getObfuscatedEmail($email) {
		$len  = strlen($email);
		$arr  = array();		//this will become an HTML-entity representation of the email
		$x000 = array();		//this will becom a hex-code representation of the email
		for($i=0; $i<$len; $i++){
			$arr[$i] = '&#'.(ord(substr($email,$i,1))).';'; 
			$x000[$i] = '%'.dechex(ord(substr($email,$i,1))).''; 
		}
		return array(implode('',$arr), implode('', $x000));
	}
	
	public function getObfuscatedEmailLink($email) {
		list($email, $mailto) = $this->getObfuscatedEmail($email);
		return '<a href="mailto:' . $mailto . '" class="email">' . $email . '</a>';
	}

	public function getOtherSpecialismsForExpert($id, $spAlpha, $name) {
		//Begin SQL query
		$sql = "SELECT * FROM ExpertSpecialisms, ExpertToSpecialism WHERE `SpAlpha` <> $spAlpha AND `ExpertToSpecialism`.`ExpertSpecialismsID` = `ExpertSpecialisms`.`ID` AND `ExpertToSpecialism`.`ExpertID` = $id";
		$result = mysqli_query($GLOBALS['link'], $sql);
		$html = ''; // HTML string to be returned

		if(mysqli_num_rows($result)>0){
			$r = array();
			$html .= '<p>';
			while($line = mysqli_fetch_assoc($result)){
				//list all specialisms - these will be links to the respective specialism pages
				$r[] = ('<a href="/expert/in/'.$line['SpAlpha'].'">'.$line['Specialism'].'</a>');
			}
			$html .= "$name may also be consulted about:<br/>".implode(' | ', $r).'</p>';
		}
		return $html;
	}

	
    public function request() {
        
		$content = '';
		$numrows = 0;
        
        if(isset($_REQUEST['f']) && ($_REQUEST['f'] != '') && ($_REQUEST['f'] == $this->sanitise($_REQUEST['f']))){
        	/***
        	 * this SQL selects all the experts for a given topic. This is not 
        	 * a 'search' like the keyword search but instead looking for a
        	 * specific expertID associated with a given topicID. The topic is 
        	 * found by it's "SPALPHA" which is a unique alphanumeric identifier.
        	 * Depending on how the data was imported, there may be more than
        	 * one expert per specialism.
        	 ***/
        	$sql = "
        	SELECT
        		e.*, e.id as ExpertID, s.Specialism, s.SpAlpha, d.Name as department, f.Name as faculty
        	FROM 
        		`ExpertSpecialisms` s, 
        		`experts` e, 
				Department d,
				Faculty f,
        		ExpertToSpecialism e2s
        	WHERE 
        		s.SpAlpha = '" . $this->sanitise($_REQUEST['f']) . "' AND 
        		s.ID = e2s.ExpertSpecialismsID AND
        		e.id = e2s.ExpertID AND
				d.ID = e.dept AND
				f.ID = e.faculty";


			$result = mysqli_query($GLOBALS['link'], $sql);
			$numrows = mysqli_num_rows($result);
			if($numrows > 0){
				/***
				 *	This page needs two database queries, one for the expert, then another for all of their specialisms.
				 *	We shoudln't (can't?) make two concurrent queries, so we'll BUFFER the one we just made, by storing 
				 *	the contents in a variable, then make the second query.
				 ***/
				$expertbuffer = array();					//temporary store for data on the requested expert (may be more than one!)
				while($row = mysqli_fetch_assoc($result)){
					$expertbuffer[] = $row;
				}
				$content  = '<h1>'.$expertbuffer[0]['Specialism'].' expert' . (mysqli_num_rows($result) > 1 ? 's' : '').'</h1>';
				$this->meta['pagetitle'] = 'Expert' . (mysqli_num_rows($result) > 1 ? 's' : '') .' in: '.$expertbuffer[0]['Specialism'].'';
				$this->meta['pagekeywords'] = array('Experts in '.$expertbuffer[0]['Specialism']);
				$this->meta['pagedescription'] = 'Academic experts in ' . $expertbuffer[0]['Specialism'] . ' at the University of Stirling.';
				
				/***
				 *	Now that we have all the experts we need, we're going to 
				 *	look up all of their specialist topics.
				 ***/
				$temp = '';
				foreach($expertbuffer as $row){
					$name = (empty($row['Title']) ? '' : $row['Title'] . " ") . $row['name'].' '. $row['Surname'];
					array_push($this->meta['pagekeywords'], $name);
					$temp .= '<div class="expert">';
					$email = $this->getObfuscatedEmailLink($row['email']);
					
					if(!empty($row['Note'])){
						$note = '<br><strong>Note:</strong> '.$row['Note'];
					} else { $note = ''; }
					
					$temp .= '<div class="vcard"><p><strong class="fn">'.$row['Title'].' '.$row['name'].' '.$row['Surname'].'</strong>';
					$temp .= '<br><span class="org organization-unit">'.$row['faculty'].'</span></p><p>';
					$temp .= !empty($row['telephone']) ? '<span class="tel"><span class="type">T: </span><span class="value">'.$row['telephone']."</span></span><br>" : '';
					$temp .= "E: $email</p>".(empty($note)?'':'<p class="note">'.$note.'</p>').'</div>';
			
					$temp .= $this->getOtherSpecialismsForExpert($row['ExpertID'], $row['SpAlpha'], $name);
					
					$temp .= '</div> <!-- .expert -->';
				}
				$content .= $temp;
			} 
        }
        
        if(isset($_REQUEST['n']) && ($_REQUEST['n'] != '') && ($_REQUEST['n'] == $this->sanitise($_REQUEST['n']))){
        	/***
        	 *	This query selects an expert by name. In fact, the 'n' value is 
        	 *	an ALPHA ID which should be a unique alphanumeric identifier 
        	 *	that we'll use to pick out one expert. Note that experts with
        	 *	the same name can exist because a unique number is appended to 
        	 *	the ALPHA ID. Thus, the ALPHA ID is human-friendly and keyword-
        	 *	friendly if the users are searching for this expert by name!
        	 ***/
        	$sql = "
        	SELECT 
        		e.*, e.id as expertID, d.Name as department, f.Name as faculty
        	FROM 
        		`experts` e, 
				Department d,
				Faculty f
        	WHERE 
        		e.alpha_id = '". $_REQUEST['n']."' AND 
        		d.ID = e.dept AND
				f.ID = e.faculty";
			
			$result = mysqli_query($GLOBALS['link'], $sql);   		
			$numrows = mysqli_num_rows($result);

			if($numrows > 0){
        		$row=mysqli_fetch_assoc($result); //no while loop because we only expect one result!
        
        		$content = '<div class="vcard"><h1 class="fn">'.$row['Title'].' '.$row['name'].' '.$row['Surname'].'</h1>';
//				$researchHubLink = $this->getResearchHubLink($row['email']);
				$name = $row['Title'] . (empty($row['Title']) ? '' : ' ') . $row['name'] . ' ' . $row['Surname'];
				$expertID = $row['expertID'];
				$email = $this->getObfuscatedEmailLink($row['email']);


				$this->meta['pagetitle'] = "$name – Find an expert | University of Stirling";
				$this->meta['pagedescription'] = "$name, {$row['department']}, {$row['faculty']} at the University of Stirling.";

        		if(!empty($row['Note'])){
        			$note = '<p><strong>Note:</strong> '.$row['Note'].'</p>';
				} else { $note = ''; }
				
        		$content .= "<p>{$row['faculty']}<br>";
				$content .= !empty($row['telephone']) ? "T: {$row['telephone']}<br>" : '';
				$content .= "E: $email</p>$note</div>";
				
				$sql = "SELECT * 
        		FROM 
        			ExpertSpecialisms s, 
        			ExpertToSpecialism e2s
        		WHERE 
        			e2s.`ExpertSpecialismsID` = s.`ID` AND 
					e2s.`ExpertID` = $expertID";
        		$result2 = mysqli_query($GLOBALS['link'], $sql);
        		if(mysqli_num_rows($result2) > 0 && !empty($expertID)){
        			$content .= '<p>'.$row['Title'].' '.$row['name'].' '.
        					$row['Surname'].' may be consulted about: <ul>';
        			while($row = mysqli_fetch_assoc($result2)){
        				$content .= ('<li><a href="/expert/in/'.$row['SpAlpha'].'">'.$row['Specialism'].'</a></li>');
        				$pagekeywords[] = $row['Specialism'];
					}
					$pagekeywords = implode(", ", $pagekeywords);
					$content .= '</ul></p>';
					$this->meta['pagekeywords'] = strtolower($pagekeywords);
					$this->meta['pagedescription'] .= " Expert in " . str_lreplace(", ", " and ", $pagekeywords) . ".";
        		}
				else {
					//return mysqli_error($GLOBALS['link']);
				}

				$content .= '<div data-fb-content data-hub-xref="'.$this->getResearchHubLink($row['email']).'"></div>';
//				if(!empty($researchHubLink)) {
//					$content .= "<p>View <a href=\"" . $researchHubLink . "\">$name's profile</a> on the Research Hub</p>";
//				}
        	} else {
				//return mysqli_error($GLOBALS['link']);
			}
		}
		
		if( ( !empty($_REQUEST['n']) || !empty($_REQUEST['f'])) && (!empty($result)) && ( $numrows == 0)) {
			/**
			 * If a name `n` or topic `f` *was* specifid, but `result` has zero items we ought 
			 * to throw a 404 error. (Maybe the expert was deleted or the parameter passed
			 * was gibberish).
			 **/
			header('Content-Type: text/html; charset=iso-8859-1', true, 404);
			return "<h1>Not found</h1><p>The page you requested could not be found. Please try again, or browse the list of expert specialisms below.</p><hr>" . $this->listing();
		}

		if(empty($content)) {
			/**
			 * If content is empty but no specific request was made, then this is a browse request
			 * so we will show the browsing options, listings, etc.
			 */
			return $this->output(array('browser'=>$this->browser), 'browse-intro') . $this->listing();;
		}
		
		/**
		 * If you've made it this far it must be a legitimate request. Hooray!
		 */
		return $content;
        
		//$content .= $this->footer();
		
    }
    
}

?>
