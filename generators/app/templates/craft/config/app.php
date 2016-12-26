<?php

// As a precaution, only define constants once
if( ! defined('ENV_URI_SCHEME'))
{
	// Load up the site version
	define('ENV_SITE_VERSION', trim(@file_get_contents(CRAFT_BASE_PATH . '/../SITEVERSION' )) ?: '0.0.0');
}

return array(

	// pass our environment as config key
	'environment' => CRAFT_ENVIRONMENT,

	// Site Version.  Comes from package.json at project root
	'version' => ENV_SITE_VERSION,

	// Google Analytics ID
	'googleAnalyticsID' => 'UA-XXXXX-X',

);