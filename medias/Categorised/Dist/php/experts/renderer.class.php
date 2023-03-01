<?php 

abstract class Renderer {
  
    /* Main templating render function */
    protected function render( $filename, $data = array() ) {
        try {
            $file = 'template/' . $filename. '.php';
            if( !is_readable($file) ){
                throw new Exception("View $file not found!", 1);
            }
            $content = file_get_contents( $file );
            ob_start() && extract($data, EXTR_SKIP);
            eval('?>'.$content);
            $content = ob_get_clean();
            if( ob_get_level() > 0 ) {ob_flush();}
            return $content;  
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function output($elements, $template = null)
    {
        if(empty($template)) {
            $template = $this->getTemplate();
        }
        return $this->render($template, $elements);
    }

    public function getTemplate()
    {
		/* $template = 'page-old';
		if(!empty($_SERVER['HTTP_HOST'])) {
			switch ($_SERVER['HTTP_HOST']) {
				case 'www-stir.t4cms.stir.ac.uk':
				case 'mediadev.stir.ac.uk':
				case 'localhost':
				case 'dtp.stir.ac.uk':
				case 't4webdev.stir.ac.uk':
					$template = 'page-dtp';
					break;
				case 'www.stir.ac.uk':
				default:
					$template = 'page-old';
			}
		} */
		return 'page-2020'; //$template;
	}

}

?>