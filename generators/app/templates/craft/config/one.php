<?php

// As a precaution, only define constants once
if( ! defined('ENV_URI_SCHEME'))
{
	// Load up the site version
	$package = json_decode( file_get_contents(CRAFT_BASE_PATH . '/../package.json'), true);
    define('ENV_SITE_VERSION', trim($package['version']) );
}


// include transforms as part of our one bundle.
$transforms = @include(CRAFT_CONFIG_PATH . 'transforms.php');
if (!is_array( $transforms ) )
{
    $transforms = [];
}


return array(

	// pass our environment as config key
	'environment' => CRAFT_ENVIRONMENT,

	// Site Version.  Comes from package.json at project root
	'version' => ENV_SITE_VERSION,

	// Google Analytics ID
	'googleAnalyticsID' => 'UA-XXXXX-X',

    'transforms' => $transforms

);
