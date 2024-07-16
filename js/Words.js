export const Words = (function() {
	const languages = [
		{
			name: 'arabic',
			label: 'Arabic',
			code: 'ar',
			selected: false
		}, {
			name: 'bengali',
			label: 'Bengali',
			code: 'bn',
			selected: false
		}, {
			name: 'english',
			label: 'English',
			code: 'en',
			selected: true
		}, {
			name: 'german',
			label: 'German',
			code: 'de',
			selected: false
		}, {
			name: 'farsi',
			label: 'Farsi',
			code: 'fa',
			selected: false
		}, {
			name: 'hebrew',
			label: 'Hebrew',
			code: 'he',
			selected: false
		}, {
			name: 'hindi',
			label: 'Hindi',
			code: 'hi',
			selected: false
		}, {
			name: 'korean',
			label: 'Korean',
			code: 'ko',
			selected: false
		}, {
			name: 'turkish',
			label: 'Turkish',
			code: 'tr',
			selected: false
		}, {
			name: 'vietnamese',
			label: 'Vietnamese',
			code: 'vi',
			selected: false
		}, {
			name: 'videogames',
			label: 'Video Games',
			code: 'vg',
			selected: false
		}
	];

	const sources = [
		{
			name: 'dictionary',
			label: 'Dictionary',
			selected: true,
			words: (function() {
				const obj = {};
				languages.forEach(language => {
					obj[language.name] = {
						url: `words/dictionaries/${language.name}.json`,
						list: null
					}
				});
				return obj;
			})()
		}, {
			name: 'wikipedia',
			label: 'Wikipedia article titles',
			selected: false,
			words: (function() {
				const obj = {};
				languages.forEach(language => {
					obj[language.name] = {
						url: `words/wikipedia/${language.code}_wikipedia.json`,
						list: null
					}
				});
				return obj;
			})()
		}
	]

	function loadFile(url) {
		return fetch(url)
			.then(response => response.json())
			.then(data => data.words)
			.catch(error => console.error('Error loading JSON file:', error));
	}

	async function get() {
		let words = [];
		for (const source of sources.filter(source => source.selected)) {
			for (const language of languages.filter(lang => lang.selected)) {
				const listObject = source.words[language.name];
				if (listObject.list === null) {
					listObject.list = await loadFile(listObject.url);
				}
				words = words.concat(listObject.list);
			}
		}
		return words;
	}


	return {
		get,
		data: {
			languages,
			sources
		}
	};

})();