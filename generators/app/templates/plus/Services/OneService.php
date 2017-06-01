<?php
namespace Plus\Services;

use Craft;
use function Craft\craft;
use function Craft\plus;

class OneService
{
	public function config($key)
	{
		$keys = explode('.', $key);

		$config = craft()->config->get($keys[0], 'one');

		for($i = 1; $i < count($keys); $i++)
		{
			if( ! array_key_exists($keys[$i], $config))
			{
				return null;
			}

			$config = $config[$keys[$i]];
		}

		return $config;
	}
}
