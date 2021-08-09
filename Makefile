default: build-dev start

build:
	npm run build

build-dev:
	npm run build:dev

start:
	npm start

watch:
	npm run watch

test:
	npm test

clean:
	rm -rf node_modules dist

deploy: $(eval SHELL:=/bin/bash)
	gcloud builds submit \
		--config cloudbuild.deploy.json \
		--substitutions=COMMIT_SHA="$$(git rev-parse HEAD)"

.PHONY: build test
