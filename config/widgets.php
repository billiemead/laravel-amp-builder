<?php
return [
	"classes"=>[
		"float_module_class"=> "module",
		"module_class"=> "module",
		"zone_class"=> "section",
		"popup_class"=> "popup-section",
		"container_class"=> "container"
	],
	"safeUrls"=>[
	"https://landingtemplate.stsengine.com"
	],
	"tools"=>[
		"text"=> [
			"name"=> "Text",
			"html"=> "<div style=\"width:100%;height:100%;\">{{{data.text}}}</div>",
			//"html_blade"=> "<div style=\"width:100%;height:100%;\">{{$data['text'}}}</div>",
			"properties"=> [
				"text"=> [
					"type"=> "input",
					"default"=> "Double click to edit text"
				]
			],
			"width"=> "auto",
			"height"=> "auto"
		],
		"heading"=> [
			"name"=> "Heading",
			"wrapper"=>"<h1></h1>",
			"html"=> "{{data.text}}",
			"width"=> "auto",
			"height"=>  "auto",
			"properties"=> [
				"tag"=>"h1",
				"text"=> "Heading"
			]
		],
		"page"=> [
			"name"=> "Page"
		],
		"page_template"=> [
			"name"=> "Page"
		],
		"section_global"=> [
			"name"=> "Global Block"
		],
		"row_global"=> [
			"name"=> "Global Block"
		],
		"popup_global"=> [
			"name"=> "Global Block"
		],
		
		"column_global"=> [
			"name"=> "Global Block"
		],
		"section"=> [
			"name"=> "Section",
			"children"=>[
				"overlay"=> "> .overlay"
			]
		],
		"popup_template"=> [
			"name"=> "Popup"
		],
		"popup"=> [
			"name"=> "Popup",
			"html"=> "<div class=\"container\"></div>",
			//"html_blade"=> "<div class=\"container\"></div>",
			"properties"=> [
				
			],
			"width"=> "auto",
			"height"=> "auto"
		],
		"form"=> [
			"name"=> "Form",
			"html"=> "<form></form>",
			//"html_blade"=> "<div style=\"width:100%;height:100%;\"></div>",
			"properties"=> [
				"method"=> [
					"type"=> "input",
					"default"=> "POST"
				],
				"action"=> [
					"type"=> "input",
					"default"=> ""
				],
				"success"=> [
					"type"=> "input",
					"default"=> "success"
				],
				"integration_type"=> [
					"type"=> "input",
					"default"=> ""
				]
			],
			"fields"=>[
				"name"=>[
					"type"=>"input",
					"data"=>[
						"name"=>"name"
					]
				],
				"email"=>[
					"type"=>"email",
					"data"=>[
						"name"=>"email"
					]
				],
				"message"=>[
					"type"=>"text_area",
					"data"=>[
						"name"=>"message"
					]
				],
				"submit"=>[
					"type"=>"submit_button",
					"data"=>[
						"text"=>"Submit"
					]
				]
			],
			"width"=> "auto",
			"height"=> "auto"
		],
		"circle"=> [
			"name"=> "Circle",
			"html"=> "<div></div>",
			"width"=> "100",
			"height"=> "100",
			"properties"=> []
		],
		"rectangle"=> [
			"name"=> "Rectangle",
			"width"=> "100",
			"height"=> "100",
			"html"=> "<div></div>"
		],
		"image"=> [
			"name"=> "Image",
			"html"=> "<amp-img src=\"{{data.src}}\" layout=\"{{amp_layout.layout}}\" width=\"{{amp_layout.width}}\"  height=\"{{amp_layout.height}}\"></amp-img>",
			//"html_blade"=> "<div style=\"width:100%;height:100%;\">{{$data['src'}}}</div>",
			"amp_layout"=>[
				"width"=>1,
				"height"=>0.75,
				"layout"=>"responsive"
			],
			"properties"=> [
				"src"=> [
					"type"=> "image",
					"default"=> "https://via.placeholder.com/150"
				]
			],
			"width"=> "100%",
			"height"=> "auto",
			"children"=>[
				"image"=> "> amp-img"
			]
		],
		"addthis"=> [
			"name"=> "Addthis",
			"html"=> "<amp-addthis layout=\"responsive\" width=\"1\" height=\"1\" data-pub-id=\"{{data.pub_id}}\" data-widget-id=\"{{data.widget_id}}\" data-widget-type=\"{{data.widget_type}}\"></amp-addthis>",
			"width"=> "auto",
			"height"=> "auto",
			"properties"=> [
				"pub_id"=>"ra-5c191331410932ff",
				"widget_id"=>"957l",
				"widget_type"=>"inline"
			]
		],
		"instagram"=> [
			"name"=> "Instagram",
			"html"=> "<amp-instagram layout=\"responsive\" width=\"1\" height=\"1\" data-shortcode=\"{{data.shortcode}}\"></amp-instagram>",
			"width"=> "auto",
			"height"=> "auto",
			"properties"=> [
				"shortcode"=>"_hIitKIFcg"
			]
		],
		"facebookcomment"=> [
			"name"=> "Facebook comment",
			"html"=> "<amp-facebook-comments layout=\"responsive\" width=\"1\" height=\"1\" data-numposts=\"{{data.numposts}}\" data-href=\"{{data.href}}\"></amp-facebook-comments>",
			"width"=> "auto",
			"height"=> "auto",
			"properties"=> [
				"href"=>"https://amp.dev",
				"numposts"=>50
			]
		],
		"video"=> [
			"name"=> "Video",
			"html"=> "{{{data.code}}}",
			//"html_blade"=> "<div style=\"width:100%;height:100%;\">{{$data['src'}}}</div>",
			"width"=> "360",
			"height"=> "240",
			"properties"=> [
				"code"=>"<div>Video Code</div>"
			]
		],
		"embed"=> [
			"name"=> "Embed",
			"html"=> "{{{data.code}}}",
			//"html_blade"=> "<div style=\"width:100%;height:100%;\">{{$data['src'}}}</div>",
			"width"=> "auto",
			"height"=> "auto",
			"properties"=> [
				"code"=>"<div>Embed Code</div>"
			]
		],
		"html"=> [
			"name"=> "HTML",
			"html"=> "<div style=\"width:100%;height:100%;\">{{data.code}}</div>",
			//"html_blade"=> "<div style=\"width:100%;height:100%;\">{{$data['src'}}}</div>",
			"width"=> "auto",
			"height"=> "auto",
			"properties"=> []
		],
		
		"button"=> [
			"name"=> "Button",
			"wrapper"=>"<a></a>",
			"html"=> "<span>{{{data.text}}}</span>",
			//"html_blade"=> "<a style=\"width:100%;height:100%;\" href=\"{{$data['href'}}}\"><span>{{$data['text'}}}</span</a>",
			"width"=> "150",
			"height"=> "50",
			"properties"=> [
				"text"=> [
					"type"=> "input",
					"default"=> "Button"
				]
				
			],
			"children"=>[
				"hover"=> ":hover"
			]
		],
		"link_block"=>[
			"name"=> "Link block",
			"wrapper"=>"<a></a>",
			"html"=> "",
			"width"=> "auto",
			"height"=> "auto",
			"properties"=> [
			],
			"additional_fields"=> [
				"link_text"=> [
					"name"=> "Text"
				],
				"link_image"=> [
					"name"=> "Image"
				],
				"link_icon"=> [
					"name"=> "SVG Icon"
				]
			]
		],
		"amp_list"=> [
			"name"=> "List",
			"html"=> "<amp-list src=\"{{data.src}}\" layout=\"{{amp_layout.layout}}\" width=\"{{amp_layout.width}}\"  height=\"{{amp_layout.height}}\"><template type=\"amp-mustache\">{{{data.template}}}</template></amp-list>",
			//"html_blade"=> "<div style=\"width:100%;height:100%;\">{{$data['src'}}}</div>",
			"amp_layout"=>[
				"width"=>1,
				"height"=>0.75,
				"layout"=>"responsive"
			],
			"properties"=> [
				"src"=> "https://amp.dev/static/inline-examples/data/amp-list-urls.json",
				"template"=>"<div class=\"url-entry\"><a href=\"{{url}}\">{{title}}</a></div>"
			],
			"width"=> "auto",
			"height"=> "auto",
			"children"=>[
				"image"=> "> amp-img"
			]
		],
		"link_image"=> [
			"name"=> "Image",
			"wrapper"=>"<span></span>",
			"html"=> "<amp-img src=\"{{data.src}}\" layout=\"{{amp_layout.layout}}\" width=\"{{amp_layout.width}}\"  height=\"{{amp_layout.height}}\"></amp-img>",
			//"html_blade"=> "<div style=\"width:100%;height:100%;\">{{$data['src'}}}</div>",
			"amp_layout"=>[
				"width"=>1,
				"height"=>0.75,
				"layout"=>"responsive"
			],
			"properties"=> [
				"src"=> [
					"type"=> "image",
					"default"=> "images/default-image.svg"
				]
			],
			"width"=> "auto",
			"height"=> "auto",
			"children"=>[
				"image"=> "> amp-img"
			]
		],
		"link_text"=> [
			"name"=> "Text",
			"wrapper"=>"<span></span>",
			"html"=> "{{data.text}}",
			//"html_blade"=> "<div style=\"width:100%;height:100%;\">{{$data['src'}}}</div>",
			
			"properties"=> [
				"text"=> "Button"
			],
			"width"=> "auto",
			"height"=> "auto"
		],
		"link_icon"=> [
			"name"=> "Icon",
			"wrapper"=>"<span></span>",
			"html"=> " {{{data.code}}}",
			"width"=>100,
			"height"=>100
		],
		"textnode_svg"=> [
			"name"=> "Icon",
			"wrapper"=>"<svg></svg>",
			"html"=> " {{{data.code}}}",
			"width"=>100,
			"height"=>100
		],
		"link_button"=> [
			"name"=> "Button",
			"wrapper"=>"<a></a>",
			"html"=> "<span>{{{data.text}}}</span>",
			//"html_blade"=> "<a style=\"width:100%;height:100%;\" href=\"{{$data['href'}}}\"><span>{{$data['text'}}}</span</a>",
			"width"=> "auto",
			"height"=> "auto",
			"properties"=> [
				"text"=> [
					"type"=> "input",
					"default"=> "Button"
				]
				
			]
		],
		"submit_button"=> [
			"name"=> "Submit",
			"wrapper"=>"<button type=\"submit\"></button>",
			"html"=> "<span>{{{data.text}}}</span>",
			//"html_blade"=> "<button type=\"submit\" style=\"width:100%;height:100%;\"><span>{{$data['text'}}}</span</button>",
			"width"=> "150",
			"height"=> "50",
			"properties"=> [
				"text"=> [
					"type"=> "input",
					"default"=> "Submit"
				]
			],
			"children"=>[
				"hover"=> ":hover"
			]
		],
		"line"=> [
			"name"=> "Line",
			"html"=> " <svg height=\"100%\" width=\"100%\">\n  <line x1=\"0\" y1=\"50%\" x2=\"100%\" y2=\"50%\" />\n</svg>",
			"width"=>"auto",
			"height"=>20
		],
		"hline"=> [
			"name"=> "H Line",
			"html"=> " <svg height=\"100%\" width=\"100%\">\n  <line x1=\"50%\" y1=\"0\" x2=\"50%\" y2=\"100%\" />\n</svg>",
			
			"width"=>20,
			"height"=>150
		],
		"svg"=> [
			"name"=> "Shape",
			"wrapper"=>"<a></a>",
			"html"=> " {{{data.code}}}",
			"width"=>100,
			"height"=>100,
			"children"=>[
				"hover"=> ":hover"
			]
		],
		"countdown"=> [
			"name"=> "Countdown",
			"width"=>"auto",
			"height"=> "auto",
			"children"=>[
				"unit"=> ".unit",
				"number"=> ".count",
				"section"=> ".countdown-section"
			]
		],
		"carousel"=> [
			"name"=> "Carousel",
			"width"=>"auto",
			"height"=> "auto",
			"properties"=> [
				"images"=> [
					["src"=>"https://via.placeholder.com/300"],
					["src"=>"https://via.placeholder.com/300"],
					["src"=>"https://via.placeholder.com/300"]
				],
				'thumbnail_width'=>60,
				'thumbnail_height'=>40,
			],
			"amp_layout"=>[
				"width"=>1,
				"height"=>0.75,
				"layout"=>"responsive"
			]
		],
		"slider"=> [
			"name"=> "Slider",
			"width"=>"auto",
			"height"=> "auto",
			"properties"=> [
				"slideCount"=>3
			],
			"amp_layout"=>[
				"width"=>"auto",
				"height"=>400,
				"layout"=>"fixed-height"
			],
			"children"=>[
				"slider"=> "> amp-carousel > div > div > div > .inner_slide"
			]
		],
		"input"=> [
			"name"=> "Input",
			"html"=> "<input type=\"text\" name=\"{{data.name}}\" placeholder=\"{{data.placeholder}}\" style=\"width:100%;height:100%;\"/>",
			"width"=>"auto",
			"height"=> "auto"
		],
		"label"=> [
			"name"=> "Form Label",
			"html"=> "{{data.text}}",
			"width"=> "auto",
			"height"=>  "auto",
			"properties"=> [
				"text"=>"Field Label"
			]
		],
		"email"=> [
			"name"=> "Email",
			"html"=> "<input type=\"email\" name=\"{{data.name}}\" placeholder=\"{{data.placeholder}}\" style=\"width:100%;height:100%;\"/>",
			"width"=> "auto",
			"height"=>  "auto"
		],
		"phone"=> [
			"name"=> "Phone",
			"html"=> "<input type=\"tel\" name=\"{{data.name}}\" placeholder=\"{{data.placeholder}}\" style=\"width:100%;height:100%;\"/>",
			"width"=> "auto",
			"height"=>  "auto"
		],
		"number"=> [
			"name"=> "Number",
			"html"=> "<input type=\"number\" name=\"{{data.name}}\" placeholder=\"{{data.placeholder}}\" style=\"width:100%;height:100%;\"/>",
			"width"=> "auto",
			"height"=>  "auto"
		],
		"password"=> [
			"name"=> "Password",
			"html"=> "<input type=\"password\" name=\"{{data.name}}\" placeholder=\"{{data.placeholder}}\" style=\"width:100%;height:100%;\"/>",
			"width"=> "auto",
			"height"=>  "auto"
		],
		"hidden"=> [
			"name"=> "Hidden",
			"html"=> "<input type=\"hidden\" name=\"{{data.name}}\"/>",
			"width"=> "auto",
			"height"=>  "auto"
		],
		
		"text_area"=> [
			"name"=> "Text area",
			"html"=> "<textarea name=\"{{data.name}}\" placeholder=\"{{data.placeholder}}\"></textarea>",
			"width"=> "auto",
			"height"=> "200"
		],
		"dropdown"=> [
			"name"=> "Dropdown",
			"html"=> "<select name=\"{{data.name}}\" style=\"width:100%;height:100%;\">{{#data.values}}<option value=\"{{.}}\">{{.}}</option>{{/data.values}}</select>",
			"width"=> "auto",
			"height"=>  "auto",
			"properties"=> [
				"values"=> [
					"type"=> "input",
					"default"=> [
						"Option 1",
						"Option 2"
					]
				]
			]
		],
		"multi_dropdown"=> [
			"name"=> "Multi select",
			"html"=> "<select name=\"{{data.name}}\" multiple=\"multiple\">{{#data.values}}<option value=\"{{.}}\">{{.}}</option>{{/data.values}}</select>",
			"width"=> "auto",
			"height"=>  "auto",
			"properties"=> [
				"values"=> [
					"type"=> "input",
					"default"=> [
						"Option 1",
						"Option 2"
					]
				]
			]
		],
		"checkbox"=> [
			"name"=> "Checkbox",
			"html"=> "{{#data.values}}<label><input type=\"checkbox\" value=\"{{.}}\">{{.}}</label>{{/data.values}}",
			"width"=> "auto",
			"height"=> "auto",
			"properties"=> [
				"values"=> [
					"type"=> "input",
					"default"=> [
						"Checkbox 1",
						"Checkbox 2"
					]
				]
			]
		],
		"radio"=> [
			"name"=> "Radio",
			"html"=> "{{#data.values}}<label><input type=\"radio\" value=\"{{.}}\">{{.}}</label>{{/data.values}}",
			"width"=> "auto",
			"height"=>  "auto",
			"properties"=> [
				"values"=> [
					"type"=> "input",
					"default"=> [
						"Radio 1",
						"Radio 2"
					]
				]
			]
		],
		"box"=> [
			"name"=> "Flexbox",
			"html"=> "",
			"width"=> "auto",
			"height"=> "auto"
		],
		"form_group"=> [
			"name"=> "Form group",
			"html"=> "",
			"width"=> "auto",
			"height"=> "auto"
		],
		"carousel_box"=> [
			"name"=> "Carousel content",
			"html"=> "",
			"width"=> "auto",
			"height"=> "auto"
		],
		"row"=> [
			"name"=> "Row",
			"html"=> "",
			"width"=> "auto",
			"height"=> "auto",
			"children"=>[
				//"column"=> "> .column"
			]
		],
		"column"=> [
			"name"=> "Column",
			"html"=> "",
			"width"=> "auto",
			"height"=> "auto"
		]
	],
	"form_fields"=> [
		"form_group"=> [
			"name"=> "Form Group",
			"data"=>[
			]
		],
		"label"=> [
			"name"=> "Label",
			"data"=>[
				"text"=>"Label"
			]
		],
		"input"=> [
			"name"=> "Text",
			"data"=>[
				"type"=>"text",
				"name"=>"name"
			]
		],
		"email"=> [
			"name"=> "Email",
			"data"=>[
				"name"=>"email"
			]
		],
		"phone"=> [
			"name"=> "Phone",
			"data"=>[
				"text"=>"000000"
			]
		],
		"password"=> [
			"name"=> "Password",
			"data"=>[
				"name"=>"name"
			]
		],
		"number"=> [
			"name"=> "Number",
			"data"=>[
				"name"=>"number"
			]
		],
		"email"=> [
			"name"=> "Email",
			"data"=>[
				"name"=>"email"
			]
		],
		"text_area"=> [
			"name"=> "Text area",
			"data"=>[
				"name"=>"name"
			]
		],
		"checkbox"=> [
			"name"=> "Checkbox",
			"data"=>[
				"name"=>"checkbox"
			]
		],
		"radio"=> [
			"name"=> "Radio",
			"data"=>[
				"name"=>"checkbox"
			]
		],
		"dropdown"=> [
			"name"=> "Dropdown",
			"data"=>[
				"name"=>"name"
			]
		],
		"multi_dropdown"=> [
			"name"=> "Multi select",
			"data"=>[
				"name"=>"name"
			]
		],
		"submit_button"=> [
			"name"=> "Submit button",
			"data"=>[
			]
		],
		"hidden"=> [
			"name"=> "Hidden field",
			"data"=>[
				"name"=>"name"
			]
		]
	],
	"categories"=>[
		"Basic"=> [
			"text"=> [
				"name"=> "Text"
			],
			"heading"=> [
				"name"=> "Heading"
			],
			"image"=> [
				"name"=> "Image"
			],
			"form"=> [
				"name"=> "Form"
			],
			"embed"=> [
				"name"=> "Embed"
			],
			"html"=> [
				"name"=> "Html"
			],
		
			"countdown"=> [
				"name"=> "Countdown"
			]
		],
		"Container"=> [
			"box"=> [
				"name"=> "Box"
			],
			"row"=> [
				"name"=> "Row"
			],
			"column"=> [
				"name"=> "Column"
			]
		],
		"Button"=>[
			"button"=> [
				"name"=> "Button"
			],
			"link_block"=> [
				"name"=> "Link Block"
			]
		],
		"Slider"=> [
			"carousel"=> [
				"name"=> "Carousel"
			],
			"carousel_box"=> [
				"name"=> "Carousel content"
			]
			
		],
		"Lines and Shapes"=> [
			"line"=> [
				"name"=> "Line"
			],
			"svg"=> [
				"name"=> "SVG Shape"
			]
		]
	
		
	]
];