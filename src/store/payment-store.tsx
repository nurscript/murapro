import { create } from "zustand"

type Payment = {
    total : number
}
type Actions = {
    setTotal : (n: number) => void
    decrement : () => void
}

const usePaymentStore = create<Payment & Actions>((set)=> ({
    total : 0,
    setTotal: (n)=> set(()=>({ total: n})),
    decrement: ()=> set((state)=>({total: state.total - 1 }))
}))

export default usePaymentStore;