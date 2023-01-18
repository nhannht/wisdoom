#!/usr/bin/env bash
mkdir  -p build/settings/
# mv settings.html to build/settings/
cp src/settings/settings.html build/settings/
# use tailwind to produce css
tailwindcss -i src/settings/settings.css  -o build/settings/settings.css
# use esbuild to produce js
esbuild src/settings/Settings.js --bundle --outfile=build/settings/Settings.js --loader:.js=jsx --minify
