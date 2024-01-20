const MARKER = "\u2062"; // INVISIBLE TIMES
const SEPARATOR = "\u2060"; // WORD JOINER
const DICTIONARY = ["\u200b", "\u200c", "\u200d", "\uFEFF"];
export const ENCODED_FORMAT = /\u2062([^\u2062]*)\u2062/g;
export const DECODED_FORMAT = /!\[([^\]\u2062\u2060\u200b\u200c]*)\]/g;

export default {
	encode(message, dict = DICTIONARY) {
		return message.replace(
			DECODED_FORMAT,
			(__, secret) => `${MARKER}${this._toInvisible(secret, dict)}${MARKER}`
		);
	},

	decode(message, dict = DICTIONARY) {
		return message.replace(
			ENCODED_FORMAT,
			(__, secret) => `![${this._toVisible(secret, dict)}]`
		);
	},

	_toInvisible(string, dict) {
		return [...string]
			.flatMap((character) => {
				const codePoint = character.codePointAt(0);
				const bits = codePoint.toString(dict.length).split("");

				return [...bits.map((it) => dict[parseInt(it)]), SEPARATOR];
			})
			.join("");
	},

	_toVisible(string, dict) {
		return string
			.split(SEPARATOR)
			.map((character) => {
				const bits = [...character].map((it) =>
					dict.indexOf(it) > -1 ? dict.indexOf(it).toString() : ""
				);
				const codePoint = parseInt(bits.join(""), dict.length);
				if (isNaN(codePoint)) return "";

				return String.fromCodePoint(codePoint);
			})
			.join("");
	}
};
