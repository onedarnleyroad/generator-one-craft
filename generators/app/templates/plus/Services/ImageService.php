<?php
namespace Plus\Services;

use Craft;
use function Craft\craft;
use function Craft\plus;

class ImageService
{

	public function transformFirst( $assets, $transform = null, $alwaysTransform = false)
	{

		if (gettype($transform) === "string") {
			$transform = plus()->one->config('transforms.' . $transform);
		}

		if (count($assets))
		{
			return $this->transform('url', $assets[0], $transform, $alwaysTransform);
		} else {
			return null;
		}
	}

	public function transformUrl($asset, $transform = null, $alwaysTransform = false)
	{
		if (gettype($transform) === "string") {
			$transform = plus()->one->config('transforms.' . $transform);
		}
		return $this->transform('url', $asset, $transform, $alwaysTransform);
	}

	public function transformWidth($asset, $transform = null, $alwaysTransform = false)
	{
		return $this->transform('width', $asset, $transform, $alwaysTransform);
	}

	public function transformHeight($asset, $transform = null, $alwaysTransform = false)
	{
		return $this->transform('height', $asset, $transform, $alwaysTransform);
	}

	public function transform($property = 'url', $asset, $transform = null, $alwaysTransform = false)
	{
		if($asset instanceof Craft\AssetFileModel)
		{
			$method = 'get' . ucfirst($property);

			$transform = craft()->assetTransforms->normalizeTransform($transform);

			if($transform)
			{
				if($alwaysTransform)
				{
					return $asset->$method($transform);
				}

				switch($transform->mode)
				{
					case 'fit': // maps to Image::scaleToFit()
					{
						// refactored to ensure that we check if a width is actually present, the constraint might only be on the width and not
						// the height, so height would be false, for example.
						if(($transform->width && $asset->width > $transform->width) || ($transform->height && $asset->height > $transform->height))
						{
							return $asset->$method($transform);
						}

						break;
					}

					case 'stretch': // maps to Image::resize()
					case 'crop': // maps to Image::scaleAndCrop()
					default:
					{
						// do we want to have an option to 'safe transform' even with cropping?
						if($asset->width > $transform->width || $asset->height > $transform->height)
						{
							return $asset->$method($transform);
						}

						break;
					}
				}
			}

			return $asset->$method();
		}

		return $asset;
	}

	public function percentageHeight( $asset )
	{
		return 100 * ($asset->height / $asset->width );
	}

	public function transparent($transform = null)
	{
		$width = $height = 0;

		if (gettype($transform) === "string") {
			$transform = plus()->one->config('transforms.' . $transform);
		}

		$transform = craft()->assetTransforms->normalizeTransform($transform);

		if($transform)
		{
			$width = $transform->width;
			$height = $transform->height;
		}

		return "data:image/svg+xml;charset=utf-8," . rawurlencode("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {$width} {$height}'/>");
	}

	public function placeholdit($transform = null)
	{
		$width = $height = 0;

		$transform = craft()->assetTransforms->normalizeTransform($transform);

		if($transform)
		{
			$width = $transform->width;
			$height = $transform->height;
		}

		return "http://placehold.it/{$width}x{$height}";
	}
}
