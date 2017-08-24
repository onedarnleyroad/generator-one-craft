<?php

/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/general.php
 *
 * To determine the environment, look at public/index.php for the logic.
 *
 * More at: http://buildwithcraft.com/docs/config-settings
 * Hat-tip to: https://github.com/BarrelStrength/Craft-Master
 */

// As a precaution, only define constants once
if( ! defined('ENV_URI_SCHEME'))
{

    // Load up the site version from package.json
    $package = json_decode(@file_get_contents(CRAFT_BASE_PATH . '/../package.json'), true) ?: array('version' => '1.0.0');
    define('ENV_SITE_VERSION', trim($package['version']) );

    // Ensure our urls have the right scheme
    if (isset($_SERVER['HTTPS']) && (strcasecmp($_SERVER['HTTPS'], 'on') === 0 || $_SERVER['HTTPS'] == 1)
     || isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strcasecmp($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') === 0)
    {
        define('ENV_URI_SCHEME', 'https://');
    } else {
        define('ENV_URI_SCHEME', 'http://');
    }

	// The site url
    define('ENV_SITE_URL', ENV_URI_SCHEME . $_SERVER['SERVER_NAME'] . '/');

    // The base url environmentVariable to use for Assets
    define('ENV_BASE_URL', ENV_URI_SCHEME . $_SERVER['SERVER_NAME'] . '/');

	// The site base path
	// note the folder is configurable via yo generator
	define('ENV_BASE_PATH',       realpath(CRAFT_BASE_PATH . '/../<%= publicFolder %>') . '/');
}


// we start by building a default config array
$config = array(

	// global & defaults (required when configuring different environments)
	'*' => array(

        // Do not identify ourselves as a Craft-powered website in server response headers
        'sendPoweredByHeader' => false,

		// customise our CP login
		// configurable via yo generator
		'cpTrigger' => 'one',

		// error code templates
		'errorTemplatePrefix' => "_errors/",

		// i18n
		// http://buildwithcraft.com/docs/config-settings#siteUrl
		// http://craftcms.stackexchange.com/questions/920/what-s-the-recommended-way-to-set-the-site-url/921#921
		'siteUrl' => array(
			'en' => ENV_BASE_URL
		),

		// used in CP settings
		'environmentVariables' => array(
			'basePath'   => ENV_BASE_PATH,
            'baseUrl' => ENV_BASE_URL,
            'siteUrl' => ENV_SITE_URL
		),

		// Enable CSRF Protection (will default to true in Craft 3.0)
		'enableCsrfProtection' => true,

		// Disable auto updates
		'allowAutoUpdates' => false,

		// remove username field
		'useEmailAsUsername' => true,

		// omit 'index.php' from urls
		'omitScriptNameInUrls' => true,

	),

	// production
	'production' => array(),

	// staging
	'staging' => array(

		// keep staging offline
		'isSystemOn' => false,

		// Route all generated emails to internal account
		'testToEmailAddress' => 'digital@onedarnleyroad.com'
	),

	// local / development
	'local' => array(

		// disable template caching
		'enableTemplateCaching' => false,

		// log debugging info to browser console
		'devMode' => true,

		// enable updating from the CP
		'allowAutoUpdates' => true,

		// Route all generated emails to internal account
		'testToEmailAddress' => 'digital@onedarnleyroad.com'
	)
);

// If environment config file exists, merge
if (is_array($envConfig = @include(CRAFT_CONFIG_PATH . 'env/general.php')))
{
    // Merge or straight up add to config
    $config[CRAFT_ENVIRONMENT] = ( array_key_exists(CRAFT_ENVIRONMENT, $config) )
                                 ? array_merge($config[CRAFT_ENVIRONMENT], $envConfig)
                                 : $envConfig;
}

// return our $config back to craft
return $config;
