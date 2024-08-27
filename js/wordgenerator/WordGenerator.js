import { WorkerPool } from './WorkerPool.js';

export const WordGenerator = function(fontName, fontData) {
	let sortedWords = null;
	const fontBuffer = new Uint8Array(fontData);

	async function sort(words, fontFeaturesSettings) {
		const result = await WorkerPool.postMessage({type: 'sort', words, fontBuffer, fontFeaturesSettings});
		sortedWords = result.data;
	}

	function getWords(size, width, filter, minWords=16) {
		let tolerance = 5;
		let words = [];
		let scaledWidth = Math.round(width * (100 / size));

		if (sortedWords === null || scaledWidth < sortedWords.minWidth) {
			return words;
		};

		let scaledSpaceWidth = Math.round(sortedWords.spaceWidth * (size / 100));

		// Find words within the given tolerance
		for (let i = scaledWidth - tolerance; i <= scaledWidth; i++) {
			if (sortedWords[filter.name][i] !== undefined) {
				words.push(...sortedWords[filter.name][i]);	
			}
		}

		if (words.length <= minWords) {
			// If the width is too long, concatenate multiple words
			const randomWidth = Math.floor(random(width*0.15, width*0.667));
			const remainingWidth = width - randomWidth - scaledSpaceWidth;
			const firstWords = shuffle(getWords(size, randomWidth, filter));
			const secondWords = shuffle(getWords(size, remainingWidth, filter));

			const minLength = firstWords.length < secondWords.length ? firstWords.length : secondWords.length;
			for (let i = 0; i < minLength; i++) {	
				words.push(firstWords[i] + " " + secondWords[i]);
			}
		}

		return shuffle(words);
	}

	return {
		getWords,
		sort
	}
};

export function random(min, max) {
	return Math.random() * (max - min) + min;
}

export function shuffle(array) {
	let currentIndex = array.length,  randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}

	return array;
}