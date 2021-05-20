SHELL := /bin/bash
PATH  := ./node_modules/.bin:$(PATH)

SRC_FILES := $(shell find src -name '*.ts')

all: lib

lib: $(SRC_FILES) node_modules tsconfig.json
	@tsc -p tsconfig.json --outDir dist
	@VERSION="$$(node -p 'require("./package.json").version')"; \
	BUILD="$$(git rev-parse --short HEAD)-$$(date +%s)"; \
	echo -e "Object.defineProperty(exports, \"__esModule\", { value: true });\nexports.default = '$${VERSION}-$${BUILD}';" > dist/utils/version.js
	@touch dist

dockerimage:
	@read -p "ENTER IMAGE NAME:TAG (example: hello:0.0.1) : " imagetag; docker build --rm -f Dockerfile -t $$imagetag .

dockerrun:
	@read -p "ENTER IMAGE NAME:TAG (example: hello:0.0.1) : " imagetag; docker run -d -p 8080:8080/tcp $$imagetag
	
reports:
	mkdir reports

.PHONY: coverage
coverage: node_modules reports
	NODE_ENV=test nyc -r html -r text -e .ts -i ts-node/register \
		--report-dir reports/coverage \
		mocha --reporter nyan --require ts-node/register test/*.ts

.PHONY: devserver
devserver: node_modules
	@onchange -i -k 'src/**/*.ts' 'config/*' -- ts-node src/app.ts | bunyan -o short

.PHONY: test
test: node_modules
	@NODE_ENV=test mocha --require ts-node/register test/*.ts --grep '$(grep)'

.PHONY: ci-test
ci-test: node_modules reports
	yarn audit
	tslint -p tsconfig.json -c tslint.json
	nyc -r lcov -e .ts -i ts-node/register \
		--report-dir reports/coverage \
		mocha --require ts-node/register \
		--reporter mocha-junit-reporter \
		--reporter-options mochaFile=./reports/unit-tests/junit.xml \
		test/*.ts

.PHONY: lint
lint: node_modules
	tslint -p tsconfig.json -c tslint.json -t stylish --fix

node_modules: package.json
	yarn install --non-interactive --frozen-lockfile

.PHONY: clean
clean:
	rm -rf .nyc_output/
	rm -rf lib/
	rm -rf reports/

.PHONY: distclean
distclean: clean
	rm -rf node_modules/