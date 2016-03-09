<?php

/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/general.php
 */


// As a precaution, only define constants once
if( ! defined('ENV_URI_SCHEME'))
{
    // use the existing protocol, unless we're on production
    $productionProtocol = 'http://';
    $protocol = ( isset($_SERVER['HTTPS'] ) ) ? 'https://' : 'http://';
    define('ENV_URI_SCHEME', (CRAFT_ENVIRONMENT == 'live') ? $productionProtocol : $protocol );

    // The site url
    define('ENV_SITE_URL', ENV_URI_SCHEME . $_SERVER['SERVER_NAME'] . '/');

    // The site filesystem path
    define('ENV_FILESYSTEM_PATH', realpath(CRAFT_BASE_PATH . '/../') . '/');

    // The site base path
    define('ENV_BASE_PATH', realpath(CRAFT_BASE_PATH) . '/');
}

$config = array(
    '*' => array(
        'errorTemplatePrefix' => "_errors/",

        // Immediately log in users after account creation
        'autoLoginAfterAccountActivation' => true,

        // Remove index.php? from URLs
        'omitScriptNameInUrls' => true,

        // never add trailing slash to outputted urls
        'addTrailingSlashesToUrls' => false,

        // pass our environment as config key
        'environment' => CRAFT_ENVIRONMENT,

        // i18n
        // http://buildwithcraft.com/docs/config-settings#siteUrl
        // http://craftcms.stackexchange.com/questions/920/what-s-the-recommended-way-to-set-the-site-url/921#921
        'siteUrl' => array(
            'en' => ENV_SITE_URL
        ),

        // used in CP settings
        // i.e. siteUrl => {siteUrl}, basePath => {basePath}
        'environmentVariables' => array(
            'filesystemPath'    => ENV_FILESYSTEM_PATH,
            'basePath'  => ENV_FILESYSTEM_PATH . '<%= public_folder %>/', //ENV_BASE_PATH,
            'siteUrl' => ENV_SITE_URL
        ),

        // Disable auto updates
        'allowAutoUpdates' => false

    ),

    'local' => array(

        // customise our CP login
        'cpTrigger' => 'one',

        // disable caching locally
        'enableTemplateCaching' => false,

        // log debugging info to browser console
        'devMode' => true,

        // enable local environment to auto update
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
