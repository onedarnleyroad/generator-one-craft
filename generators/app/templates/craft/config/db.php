<?php

/**
 * Database Configuration
 *
 * All of your system's database configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/db.php
 */

$config = array(

	// global & defaults (required when configuring different environments)
	'*' => array(
		// The database server name or IP address. Usually this is 'localhost' or '127.0.0.1'.
		'server' => '',

		// The name of the database to select.
		'database' => '',

		// The database username to connect with.
		'user' => '',

		// The database password to connect with.
		'password' => '',

		// The prefix to use when naming tables. This can be no more than 5 characters.
		'tablePrefix' => 'craft',
	),

	// production
	'production' => array(),

	// staging
	'staging' => array(),

	// local / development
	'local' => array(
		// The database server name or IP address. Usually this is 'localhost' or '127.0.0.1'.
		'server' => 'localhost',

		// The name of the database to select.
		'database' => '<%= localdatabase %>',

		// The database username to connect with.
		'user' => 'root',

		// The database password to connect with.
		'password' => 'root'
	),

);


// If a local config file exists, merge
if (is_array($localConfig = @include(CRAFT_CONFIG_PATH . 'local/db.php')))
{
	// does our default config already have a local key?
	if(array_key_exists('local', $config))
	{
		// If so, merge what's in our local/db.php
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
