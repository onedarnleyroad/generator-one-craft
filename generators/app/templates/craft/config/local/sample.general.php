<?php
/**
 * Local-only General Configuration
 *
 * The returned array will be merged ONLY with the in-built 'local' array in config/general.php,
 *
 * Usage: duplicate file as `config/local/general.php` and cutomise values below.
 */

return array(

    // disable caching
    'enableTemplateCaching' => false,

    // turn on devMode
    'devMode' => true,

    // Send all system emails to test address
    'testToEmailAddress' => 'somebody@domain.com',

);
