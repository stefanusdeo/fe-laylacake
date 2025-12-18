import { PaymentMethodResponse } from "@/types/paymentTypes";
import { create } from "zustand";

interface PaymentState {
  paymentExternal: PaymentMethodResponse | null;
  paymentInternal: PaymentMethodResponse | null;
  setPaymentExternal: (data: PaymentMethodResponse) => void;
  setPaymentInternal: (data: PaymentMethodResponse) => void;
}

export const usePaymentStore = create<PaymentState>()((set) => ({
  paymentExternal: null,
  paymentInternal: null,
  setPaymentExternal: (data: PaymentMethodResponse) => set({ paymentExternal: data }),
  setPaymentInternal: (data: PaymentMethodResponse) => set({ paymentInternal: data }),
}));
