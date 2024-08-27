import { Layout } from "../Layout.js";
import { Tooltip } from "./Tooltip.js";

export function SizeInputGlobal(initialVnode) {
	let isFocused = false;
	let editValue = "";

	function onfocus(e) {
		isFocused = true;
		editValue = e.target.value;
	}

	function oninput(e) {
		if (isFocused) {
			editValue = e.target.value;
		}	
	}

	function onblur(e) {
		isFocused = false;
	}

	return {
		view: function(vnode) {
			return m('div.size-input.size-input-global',
				m('div.size-input-wrapper', {class: !Layout.sizeLocked.val ? "disabled" : ""},
					m('button', { 
						onclick: () => { Layout.size.decrement() },
						disabled: !Layout.sizeLocked.val
					}, '－'),
					m('input', {
						type: 'text', 
						value: isFocused ? editValue : Layout.size.get(),
						onchange: (e) => {Layout.size.set(e.currentTarget.value)},
						disabled: !Layout.sizeLocked.val,
						oninput,
						onfocus,
						onblur
					}),
					m('button', {
						onclick: () => { Layout.size.increment() },
						disabled: !Layout.sizeLocked.val
					}, '＋')
				),
				m('div.size-input-lock',
					m('button', {
						onclick: () => {Layout.sizeLocked.val = !Layout.sizeLocked.val}
					}, `${Layout.sizeLocked.val ? '🔒' : '🔓'}`),
					m(Tooltip, {label: 'Apply to all lines'})
				)
			)
		}
	}
}