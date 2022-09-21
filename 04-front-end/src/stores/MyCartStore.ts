import { configureStore } from '@reduxjs/toolkit'
import IItem from '../models/IItemModel'

interface CartAction {
    type: 'add_to_cart' | 'remove_from_cart' | 'empty_cart'
    value?: IItem
}

interface CartState {
    items: IItem[]
}

const emptyCartState: CartState = {
    items: [],
}

let initialCartState: CartState = {
    items: [],
}

    ; (() => {
        if (!localStorage.getItem('cart-store-data')) {
            return
        }
        const storedData = JSON.parse(localStorage.getItem('cart-store-data') ?? '{}')

        if (typeof storedData !== 'object') {
            return
        }

        initialCartState = { ...initialCartState, ...storedData }
    })()

function cartReducer(
    state: CartState = initialCartState,
    action: CartAction,
): CartState {
    const tempState = JSON.parse(JSON.stringify(state))

    const index = tempState.items.findIndex(
        (item: IItem) => item.itemId === action.value?.itemId,
    )
    if (action.type === 'add_to_cart' && action.value) {
        if (index === -1) {
            tempState.items.push(action.value)
        }
    } else if (action.type === 'remove_from_cart' && action.value) {
        tempState.items.splice(index, 1)
    } else if (action.type === 'empty_cart') {

        return { ...emptyCartState } as CartState
    }

    return { ...tempState } as CartState
}

const MyCartStore = configureStore({ reducer: cartReducer })
MyCartStore.subscribe(() => {
    localStorage.setItem(
        'cart-store-data',
        JSON.stringify(MyCartStore.getState()),
    )
})

export type MyCartStoreDispatch = typeof MyCartStore.dispatch
export default MyCartStore