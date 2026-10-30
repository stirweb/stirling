<?php 

// Internal Specific Code - Vars
$staff_sect = 'internal-staff';		// directory name of the staff-only section
$uri_sects = explode('/', $_SERVER['REQUEST_URI']);
$cur_sect = $uri_sects[1];			// used for comparison

$access = $cur_sect === $staff_sect ? "staff" : "student"; // used for metadata tags

if(!$isPreview && !$login){
  $url = 'http' . (isset($_SERVER['HTTPS']) ? 's' : '') . '://' . "{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
  header('Location: https://portal.stir.ac.uk/security/login.jsp?requrl='.urlencode($url), true, 302);
  echo '<p><strong>Portal authentication required</strong></p>';
  echo '<p>To view this page you must be logged in via the Portal.</p>';
  echo '<form action="https://portal.stir.ac.uk/security/login.jsp" method=get>';
  echo '<button name=requrl value="'.$url.'">Log in now</button>';
  echo '</form>';
  exit();
} else {

  // Internal Specific Code - Staff can view anything. Students can only view stuff in their area.
  if(!$isPreview && $usertype == 'STUDENT' && $cur_sect ==  $staff_sect){
      exit('<pre>You do not have sufficient privilages to view this page. <a href="https://www.stir.ac.uk/internal-students/">Visit the student area</a>.</pre>');
  }

}
?>
