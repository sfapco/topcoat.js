
build: components index.js
	@rm -rf topcoat.js
	@component build --dev -o . -n topcoat -s topcoat

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
