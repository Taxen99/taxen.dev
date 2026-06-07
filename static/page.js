document.querySelectorAll('code:not(.language-none)').forEach(el => {
	hljs.highlightElement(el);
});

document.querySelectorAll('.demo').forEach(el => {
	html = el.querySelector('.demo-html')?.textContent.trim();
	css = el.querySelector('.demo-css')?.textContent.trim();
	js = el.querySelector('.demo-js')?.textContent.trim();
	el.querySelectorAll('pre').forEach(x => x.remove());
	let demo = {
		html, css, js
	};
	//
	let layout = `
		<div class="demo-main">
			<div class="demo-code-panel">
				<div class="demo-topbar">
					
				</div>
				<div class="demo-code">
					
				</div>
			</div>
			<div class="demo-output-panel">
			<div class="demo-output-panel-fucking-container"></div>
			</div>
		</div>
	`;
	el.innerHTML = layout;

	let topbar_el = el.querySelector('.demo-topbar');
	let demo_code_el = el.querySelector('.demo-code');
	let panels = {html, css, js};
	let timeout_to_update = null;
	for (const lang in panels) {
		let code = panels[lang];
		if (code == null)
			continue;
		let outer_code_el = document.createElement('div');
		{
			let pre_code_el = document.createElement('div');
			pre_code_el.classList.add("demo-highlight");
			pre_code_el.classList.add(`language-${lang}`);
			// let inner_code_el = document.createElement('code');

			let input_code_el = document.createElement('textarea');
			input_code_el.value = code;

			// inner_code_el.textContent = code;
			// pre_code_el.appendChild(inner_code_el);
			outer_code_el.appendChild(pre_code_el);
			outer_code_el.appendChild(input_code_el);
			demo_code_el.appendChild(outer_code_el);
			// hljs.highlightBlock(pre_code_el);
			const on_input = () => {
				// code_el.dataset.highlighted = null;
				pre_code_el.textContent = input_code_el.value + "\n\n\n\n\n\n";
				delete pre_code_el.dataset.highlighted;
				hljs.highlightBlock(pre_code_el);
				demo[lang] = input_code_el.value;

				clearTimeout(timeout_to_update);
				timeout_to_update = setTimeout(() => {
					demo_update();
				}, 1000);
			}
			on_input();
			clearTimeout(timeout_to_update);

			input_code_el.oninput = on_input;
			// input_code_el.contentEditable = true;
			input_code_el.spellcheck = false;
			input_code_el.autocapitalize = false;
			input_code_el.autocomplete = false;

			input_code_el.onscroll = () => {
				pre_code_el.scrollTop = input_code_el.scrollTop;
				pre_code_el.scrollLeft = input_code_el.scrollLeft;
			};
		}

		let selector_button = document.createElement('button');
		// selector_button.classList.add(`demo-${lang}-selector`);
		selector_button.onclick = () => {
			demo_code_el.querySelectorAll('div').forEach(x => x.classList.remove('selected'));
			outer_code_el.classList.add('selected');
			topbar_el.querySelectorAll('button').forEach(x => x.classList.remove('selected'));
			selector_button.classList.add('selected');
		};
		selector_button.textContent = lang;
		topbar_el.appendChild(selector_button);

		if (lang === 'html') {
			outer_code_el.classList.add('selected');
			selector_button.classList.add('selected');
		}
	}


	let output_el = el.querySelector('.demo-output-panel-fucking-container');
	let shadow = output_el.attachShadow({ mode: 'open' });
	let body = document.createElement('body');
	const oursheet = ":where(body) {width: 100%; height: 100%; background: #10061a; margin: 0px; overflow: scroll;}\n";
	const sheet = new CSSStyleSheet();
	function demo_update() {
		body.innerHTML = demo["html"];
		sheet.replaceSync(oursheet + (demo["css"] ?? ""));
	}
	shadow.adoptedStyleSheets = [sheet];
	shadow.appendChild(body);
	demo_update();
})

