import React, {createContext, useContext, useEffect, useReducer} from "react"
import {User} from "../utils/types"
import axios from "axios";
import api from "../utils/api-endpoints";
import {Callback} from "escalade";


interface State {
    authenticated: boolean
    currentUser: User | null
    loading: boolean

}

interface Action {
    type: string,
    payload: any

}

const StateContext = createContext<State>({
    authenticated: false,
    currentUser: null,
    loading: true
});

const DispatchContext = createContext(null);

const reducer = (state: State, {type, payload}: Action) => {
    switch (type) {
        case 'LOGIN':
            return {
                ...state,
                authenticated: true,
                currentUser: payload
            };

        case 'LOGOUT':
            return {
                ...state,
                authenticated: false,
                currentUser: null
            };

        case 'LOADING':
            return {
                ...state,
                loading: payload
            };

        default:
            throw new Error(`Unknown action type: ${type}`)
    }
}

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [state, defaultDispatch] = useReducer(reducer, {
        currentUser: null,
        authenticated: false,
        loading: true
    });

    const dispatch: any = (type: string, payload?: any) => defaultDispatch({type, payload})

    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const {data} = await axios.get(api.me);
                dispatch('LOGIN', data)
            } catch (err) {
                console.log(err)
            } finally {
                dispatch('LOADING', false)
            }
        }

        loadCurrentUser()
    }, [])

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)