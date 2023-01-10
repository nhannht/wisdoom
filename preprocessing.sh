#copy background.js to build directory
set -x
cp src/background.js build/
manifest=$(cat public/manifest.json)
# Get th name of multi css files  from build/static/css/ to add to manifest.json content_scripts.css
cssFiles=$(ls build/static/css/*.css)
for cssFile in $cssFiles
do
# remove build from cssFile
cssFile=${cssFile#build/}
manifest=$( echo "$manifest" | jq --arg cssFile "$cssFile" '.content_scripts[0].css += [$cssFile]' )
done
echo "$manifest" > build/manifest.json
# copy icons dir to build dir
cp -r src/icons build/



