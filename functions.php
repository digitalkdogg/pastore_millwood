<?php
/* Write your awesome functions below */
 /*wp_enqueue_script( 'wpglobals', get_stylesheet_directory_uri() . '/staticresources/custom.js' ); */
/*wp_enqueue_script('custom', get_theme_file_path('/staticresources/custom.js'));*/

add_action( 'wp_footer', 'my_footer_scripts' );
function my_footer_scripts(){
    	wp_enqueue_style( 'customcss', get_stylesheet_directory_uri() . '/staticresources/custom.css' ); 
	wp_enqueue_script( 'customjs', get_stylesheet_directory_uri() . '/staticresources/custom.js' );
}

/**
 * Grab latest event posts
 *
 * @param array $data Options for the function.
 * @return $object, or null if none.  */
 
	 function get_latest_events ( $params ){
  	 $post = get_posts( array(
		'post_type' => $params['post_type'],
            	'posts_per_page'  => 3,
            	'offset'      => 0
      ) );

 
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
     } );  
