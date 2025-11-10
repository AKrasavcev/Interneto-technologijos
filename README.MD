To test *xsd* on Ubuntu:
* sudo apt install libxml2
* sudo apt install libxml2-utils
* xmllint --noout --schema restaurant.xsd restaurant.xml

To test *json* in Console:
* Install *Node*>18
* npm install ajv ajv-formats
* node ./validate.js