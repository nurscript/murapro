import { create } from "zustand"

type Payment = {
    totalPayment : number
    totalWithdraw : number
}
type Actions = {
    setPayment : (n: number) => void
    setWithdraw : (n: number) => void
}

const usePaymentStore = create<Payment & Actions>((set)=> ({
    totalPayment : 0,
    totalWithdraw : 0,
    setPayment: (n)=> set(()=>({ totalPayment: n})),
    setWithdraw: (n)=> set(()=>({ totalWithdraw: n})),
}))

export default usePaymentStore;