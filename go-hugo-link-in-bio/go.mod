module github.com/wasmerio/examples/go-hugo-link-in-bio

go 1.25.5
require (
	github.com/HugoBlox/kit/modules/blox v0.12.0 // indirect
	github.com/HugoBlox/kit/modules/integrations/netlify v1.3.0 // indirect
)

require my_website v0.0.0

replace my_website => github.com/HugoBlox/hugo-theme-link-in-bio v0.0.0-20260527025441-fb176920db83

