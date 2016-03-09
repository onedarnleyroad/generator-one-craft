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
    // Ensure our urls have the right scheme
    define('ENV_URI_SCHEME',  ( isset($_SERVER['HTTPS'] ) ) ? "https://" : "http://" );

    // The site base url
    define('ENV_BASE_URL',    ENV_URI_SCHEME . $_SERVER['SERVER_NAME'] . '/');

    // The site base path
    // note the folder is configurable via yo generator
    define('ENV_BASE_PATH',       realpath(CRAFT_BASE_PATH . '/../<%= public_folder %>') . '/');
}


// we start by building a default config array
$config = array(

    // global & defaults (required when configuring different environments)
    '*' => array(

        // customise our CP login
        // configurable via yo generator
        'cpTrigger' => 'one',

        // error code templates
        'errorTemplatePrefix' => "errors/",

        // i18n
        // http://buildwithcraft.com/docs/config-settings#siteUrl
        // http://craftcms.stackexchange.com/questions/920/what-s-the-recommended-way-to-set-the-site-url/921#921
        'siteUrl' => array(
            'en' => ENV_BASE_URL
        ),

        // used in CP settings
        'environmentVariables' => array(
            'basePath'  => ENV_BASE_PATH,
            'baseUrl' => ENV_BASE_URL
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
    'staging' => array(),

    // local / development
    'local' => array(

        // disable template caching
        'enableTemplateCaching' => false,

        // log debugging info to browser console
        'devMode' => true,

        // enable updating from the CP
        'allowAutoUpdates' => true,
    )
);

// If a local config file exists, merge
if (is_array($localConfig = @include(CRAFT_CONFIG_PATH . 'local/general.php')))
{
    // does our default config already have a local key?
    if(array_key_exists('local', $config))
    {
        // If so, merge what's in our local/general.php
        $config['local'] = array_merge($config['local'], $localConfig);
    }
    else
    {
        // Otherwise, just set as our 'local' key
        $config['local'] = $localConfig;
    }
}

// return our $config back to craft
return $config;
