module github.com/wasmerio/examples/go-hugo-jackiectl-github-io

go 1.25.5
require (
	github.com/HugoBlox/kit/modules/blox v0.12.0 // indirect
	github.com/HugoBlox/kit/modules/integrations/netlify v1.3.0 // indirect
	github.com/HugoBlox/kit/modules/slides v1.3.0 // indirect
)

require github.com/HugoBlox/kit/templates/academic-cv v0.0.0

replace github.com/HugoBlox/kit/templates/academic-cv => github.com/jackiectl/jackiectl.github.io v0.0.0-20260722212304-500b62f2e378

