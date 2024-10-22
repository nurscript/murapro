import { create } from "zustand"

type Payment = {
    total : number
}
type Actions = {
    setTotal : (n: number) => void
}

const usePaymentStore = create<Payment & Actions>((set)=> ({
    total : 0,
    setTotal: (n)=> set(()=>({ total: n})),
}))

export default usePaymentStore;