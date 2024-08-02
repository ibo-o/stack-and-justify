import { Font } from './Font.js';
import { Layout } from './Layout.js';
import { sortFonts } from './Helpers.js';

export const Fonts = (function() {
	let list = [];
	// let features = [];

	function add(fontName, fontData, fontInfo) {
		let font;

		// Check if a font with the same name does not exists already
		if (!list.find(font => font.name === fontName)) {
			font = Font(fontName, fontData, fontInfo);
			list.push(font);
			list = sortFonts(list);
		} else {
			font = list.find(font => font.name === fontName);
		}

		Layout.addLine("default", font.id);
		m.redraw();

		// Dispatch event
		const event = new CustomEvent("font-added", {detail: {fontId: font.id}});
		window.dispatchEvent(event);
	}

	function get(id) {
		return list.find(font => font.id == id) || null;
	}

	function first() {
		return list[0] || null;
	}

	function last() {
		return list[list.length-1] || null;
	}

	function indexOf(id) {
		return list.indexOf(get(id));
	}

	async function update() {
		for (const font of list) {
			await font.update();
		}
	}

	// Output the list of font grouped by family name
	function familyList() {
		const families = {};
		list.forEach(font => {
			const familyName = font.info.familyName;
			if (!families[familyName]) {
				families[familyName] = [];
			}
			families[familyName].push(font);
		});
		return families;
	}

	return {
		add,
		get,
		indexOf,
		first,
		update,
		familyList,
		get list() {
			return list;
		},
	}
})();