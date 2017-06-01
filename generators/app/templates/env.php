<?php
/**
 * Define Craft's multi-environment key
 * If/Switch, I care not!
 */
if( ! defined('CRAFT_ENVIRONMENT'))
{
    // Setup environment-friendly configs
    switch ($_SERVER['SERVER_NAME']) {
        case 'www.<%= production_server %>' :
        case '<%= production_server %>' :
            define('CRAFT_ENVIRONMENT', 'production');
            break;

        case '<%= stagingServer %>' :
            define('CRAFT_ENVIRONMENT', 'staging');
            break;

        default :
            define('CRAFT_ENVIRONMENT', 'local');
    }
}
