<?php
/* Write your awesome functions below */
 /*wp_enqueue_script( 'wpglobals', get_stylesheet_directory_uri() . '/staticresources/custom.js' ); */
/*wp_enqueue_script('custom', get_theme_file_path('/staticresources/custom.js'));*/

add_action( 'wp_footer', 'my_footer_scripts' );
function my_footer_scripts(){
    wp_enqueue_style( 'customcss', get_stylesheet_directory_uri() . '/staticresources/custom.css' ); 
	   wp_enqueue_script( 'customjs', get_stylesheet_directory_uri() . '/staticresources/custom.js' );
      wp_enqueue_style( 'foundationcss', get_stylesheet_directory_uri() . '/staticresources/foundation/css/foundation.min.css' ); 
     wp_enqueue_script( 'foundationjs', get_stylesheet_directory_uri() . '/staticresources/foundation/js/vendor/foundation.min.js' );
      wp_enqueue_style( 'slickcss',  get_stylesheet_directory_uri() . '/staticresources/slick/slick.min.css' );
      wp_enqueue_script( 'slickjs',  get_stylesheet_directory_uri() . '/staticresources/slick/slick.js' );
 


 /** 
  Global vars to be passed to custom javascript
  **/
  
  global $template;
  $dataToBePassed = array(
        'template'              => basename($template),
        'stylesheet_dir'        => get_stylesheet_directory_uri(),
        'home_url'              => get_home_url(),
        'site_url'              => get_option( 'siteurl' ),
        'is_admin'              => is_admin(),
        'rest_url'              => get_rest_url(),
        'menu'                  => wp_json_encode(wp_get_nav_menu_items('MainMenu')),
        'custom_super_options' => get_theme_super_customizations(),
        'template_events'       => get_custom_template_file('Templates/Events.html'),
        'template_events_single'=> get_custom_template_file('Templates/Events_single.html'),
        'template_news_single'  => get_custom_template_file('Templates/News_single.html')
    );
    wp_localize_script( 'customjs', 'php_vars', $dataToBePassed );

//var_dump(yourprefix_get_menu_items(''));

}

add_action('init', 'get_custom_template_file');
function get_custom_template_file($fileName){
    $pluginDirectory = plugin_dir_path( __FILE__ );
    $filePath = $pluginDirectory . $fileName;
    $fileContents = file_get_contents($filePath);
    return $fileContents;
}

function get_theme_super_customizations() {
  $options = array('homepage_show_events', 
                  'homepage_show_news',
                  'homepage_events_arrow_position',
                  'homepage_news_arrow_position',
                  'menu_mobile'
                ); 
  $returnarray = array();

  foreach ($options as &$value) {
    $returnarray[$value] = pastore_church_get_custom_option($value);
  }
  return $returnarray;
}

/**
 * Grab latest event posts
 *
 * @param array $data Options for the function.
 * @return $object, or null if none.  */
 
   function get_latest_events ( $params ){

    if ($params['post_type']=='') {
      $params['post_type'] = 'tribe_events';
    }
    if ($params['start_date'] =='') {
      $params['start_date'] = '2019-01-20 08:00:00';
    }


    $post = get_posts( array(
          'post_type' => $params['post_type'],
          'post_status' => 'publish',
          'meta_key' => '_EventStartDate',
          'meta_value' => $params['start_date'],
          'meta_compare' => '>=',
          'order_by' => '_EventStartDate',
          'order' => 'ASC'
     ) );


 
      if( empty( $post ) ){
        return null;
      }
    return $post;
      //return $post[0]->post_title;
     }



/**
 * Grab latest event posts
 *
 * @param array $data Options for the function.
 * @return $object, or null if none.  */
 
	 function get_latest_news ( $params ){

    if ($params['category']=='') {
      $params['category'] = 'homepagenews';
    }
    

    $category = get_term_by('name', $params['category'], 'category');

    if ($category != false) {
      $post = get_posts( array(
            'post_status' => 'publish',
            'cat' => $category->term_id,
            'posts_per_page' => 10,
            'orderby' => 'date',
            'order' => 'ASC' 
       ) );
    }

  	 	if( empty( $post ) ){
  	 		return null;
  	 	}
 		   
       return $post;
  	 	//return $post[0]->post_title;
  	 }

	 // Register the rest route here.
  	 add_action( 'rest_api_init', function () {     
            register_rest_route( 'calendar/v1', 'latest-events',array( 
                'methods'  => 'GET',
                'callback' => 'get_latest_events'
            ) );

            register_rest_route( 'news/v1', 'latest-news',array( 
                'methods'  => 'GET',
                'callback' => 'get_latest_news'
            ) );
     } );  
?>