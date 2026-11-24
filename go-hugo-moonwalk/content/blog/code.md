+++
date = 2023-01-01T08:30:00-07:00
draft = false
type = 'posts'
author = 'ArkhamCookie'
title = 'Code'
+++

## Python

```python
import microrequests

mr = microrequests.init()
# mr is requests' session object and you can use it in similar manner
res = mr.get("http://httpbin.org/get")
print(res.text)
```

## Ruby

```ruby
require 'gmail'
require 'time'
require 'yaml'
require 'erb'

if ARGV.length != 2
  puts "Syntax: #{__FILE__} gmail-username gmail-password"
  exit
end

config = YAML.load_file("#{File.dirname(__FILE__)}/config.yaml")
body = ERB.new(config['body'])

gmail = Gmail.connect(ARGV[0], ARGV[1])

# variable 'name' is important given it is used in body as well
for name, email_id in config['to'] do
  puts "sending to #{email_id}"
