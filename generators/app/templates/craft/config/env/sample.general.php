<?php
/**
 * Environment-specific General Configuration
 *
 * The returned array will be merged with the CRAFT_ENVIRONMENT key's values in config/general.php.
 *
 * Usage: duplicate file as `config/env/general.php` and cutomise values below.
 */

return array(

	// turn on debug/logging
	'devMode' => true,

	// Where to send all test emails
	'testToEmailAddress' => 'your@email.com',
);
