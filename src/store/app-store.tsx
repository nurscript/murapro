import { create } from "zustand"

type DarkState = {
    darkMode : boolean
}
type Actions = {
    toggle : () => void
}

const useDarkMode = create<DarkState & Actions>((set)=> ({
    darkMode : false,
    toggle: ()=> set((state)=>({ darkMode: !state.darkMode})),
}))

export default useDarkMode;