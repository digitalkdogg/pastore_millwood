<?php
/* Write your awesome functions below */
 /*wp_enqueue_script( 'wpglobals', get_stylesheet_directory_uri() . '/staticresources/custom.js' ); */
/*wp_enqueue_script('custom', get_theme_file_path('/staticresources/custom.js'));*/

add_action( 'wp_footer', 'my_footer_scripts' );
function my_footer_scripts(){
    	wp_enqueue_style( 'customcss', get_stylesheet_directory_uri() . '/staticresources/custom.css' ); 
	wp_enqueue_script( 'customjs', get_stylesheet_directory_uri() . '/staticresources/custom.js' );
}
