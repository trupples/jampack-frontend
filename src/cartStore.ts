import { map } from 'nanostores';

type Item = {
	id: number,
	name: string,
	cost: number,
};

export type CartItem = {item: Item, quantity: number};

export const cartItems = map<number, CartItem>();

export let disableCartFlag = false;

export function addToCart(item : Item) {
	if(disableCartFlag) return;

	const existingEntry = cartItems.get()[item.id];
	if(existingEntry) {
		cartItems.setKey(item.id, {
			...existingEntry,
			quantity: existingEntry.quantity + 1
		});
	} else {
		cartItems.setKey(item.id, {
			item: item,
			quantity: 1
		});
	}
}

export function removeFromCart(item : Item) {
	if(disableCartFlag) return;
	
	const existingEntry = cartItems.get()[item.id];
	if(!existingEntry) return;

	if(existingEntry.quantity > 1) {
		cartItems.setKey(item.id, {
			...existingEntry,
			quantity: existingEntry.quantity - 1
		});
	} else {
		cartItems.setKey(item.id, undefined);
	}
}

export function disableCart() {
	disableCartFlag = true;
}
