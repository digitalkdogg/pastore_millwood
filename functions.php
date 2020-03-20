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
      wp_enqueue_script('fbjs', 'https://connect.facebook.net/en_US/all.js');



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
        'template_news_single'  => get_custom_template_file('Templates/News_single.html'),
        'template_fb_single'    => get_custom_template_file('Templates/fb_single.html'),
    );
    wp_localize_script( 'customjs', 'php_vars', $dataToBePassed );

//var_dump(yourprefix_get_menu_items(''));

}

function remove_nonadmin_menu_items() {
    if( !current_user_can( 'administrator' ) ):
        remove_menu_page( 'edit.php?post_type=services' );
        remove_menu_page( 'edit.php?post_type=clients' );
        remove_menu_page( 'edit.php?post_type=testimonial' );
        remove_menu_page( 'users.php' );
        remove_menu_page( 'tools.php' );
        remove_menu_page( 'options-general.php' );

    endif;
}
add_action( 'admin_menu', 'remove_nonadmin_menu_items' );


add_action('init', 'get_custom_template_file');
function get_custom_template_file($fileName){
    $pluginDirectory = plugin_dir_path( __FILE__ );
    $filePath = $pluginDirectory . $fileName;
    $fileContents = file_get_contents($filePath);
    return $fileContents;
}

function get_theme_super_customizations() {
  $options = array('homepage_show_events',
                  'homepage_show_events_page',
                  'homepage_show_news',
                  'homepage_show_news_page',
                  'homepage_events_rev_arrows',
                  'homepage_news_rev_arrows',
                  'homepage_events_arrow_position',
                  'homepage_news_arrow_position',
                  'homepage_show_fb',
                  'homepage_fb_access_token',
                  'homepage_fb_app_id',
                  'homepage_fb_rev_arrows',
                  'homepage_fb_limit',
                  'homepage_fb_months_ago',
                  'menu_mobile',
                  'api_show_cc_news',
                  'api_news_page'
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
	//$params['start_date'] = date_sub($params['start_date'], date_interval_create_from_date_string("2 days"));

    $date = new DateTime($params['start_date']);
    $date->modify('-2 day')->format('Y-m-d H:i:s');

   // var_dump($date);

   // $date = trim($date, "/t");


    $post = get_posts( array(
          'post_type' => $params['post_type'],
          'post_status' => 'publish',
          'meta_key' => '_EventStartDate',
          'meta_value' => date_format($date, "Y-m-d H:i:s"),
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
            'order' => 'DESC'
       ) );

       //var_dump($post[0]);
       $postmeta = null;
       foreach ($post as $postitem) {

          $postmeta = get_post_meta( $postitem->ID, FALSE, TRUE );
          $postitem->meta = $postmeta;

        }

    }

  	 	if( empty( $post ) ){
  	 		return null;
  	 	}

       return $post;
  	 	//return $post[0]->post_title;
  	 }

     /**
 * Grab latest event posts
 * @param array $data Options for the function.
 * @return $object, or null if none.  */

   function get_latest_cc ( $params ){
     global $wpdb;
     $result = $wpdb->get_results('SELECT * FROM wp_campaigns where status = "Done" order by created_at desc');
     return json_encode($result);

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

            register_rest_route('cc/v1', 'latest-cc',array(
              'methods' => 'GET',
              'callback' => 'get_latest_cc'
            ));
     } );
?>
