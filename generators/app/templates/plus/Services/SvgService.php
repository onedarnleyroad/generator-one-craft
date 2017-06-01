<?php
namespace Plus\Services;

use Craft;
use function Craft\craft;
use function Craft\plus;

class SvgService
{
	public function output($key)
	{
		$html = "";

		$html .= '<span class="svgwrapper  svgwrapper--'.$key.'">';
		$html .= '<svg xmlns="http://www.w3.org/2000/svg" class="'.$key.'">';
		$html .= '<use xlink:href="#' . $key . '"></use>';
		$html .= '</svg>';
		$html .= '</span>';


		return $html;
	}
}
