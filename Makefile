<<<<<<< HEAD


default: build start
=======
default: build-dev start
>>>>>>> 5c920be96a975e4c2ac8a2dd6391373b032ae2e7

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

.PHONY: build test
