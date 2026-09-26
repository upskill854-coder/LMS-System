import { create } from "zustand";
import { PendingOrder, PromoValidationResult } from "@/types";

interface EnrollmentDraft {
  courseId: string | null;
  studentName: string;
  phone: string;
  fatherName: string;
  lastQualification: string;
  promoCode: string;
  promoResult: PromoValidationResult | null;
  pendingOrder: PendingOrder | null;
  setCourse: (courseId: string) => void;
  updateField: (field: keyof Omit<EnrollmentDraft, "courseId" | "promoResult" | "pendingOrder">, value: string) => void;
  setPromoResult: (result: PromoValidationResult | null) => void;
  setPendingOrder: (order: PendingOrder | null) => void;
  reset: () => void;
}

const initialState = {
  courseId: null,
  studentName: "",
  phone: "",
  fatherName: "",
  lastQualification: "",
  promoCode: "",
  promoResult: null,
  pendingOrder: null,
};

// This store only ever holds UI draft state. The authoritative price,
// discount and enrollment status always come from the backend response.
export const useEnrollmentDraftStore = create<EnrollmentDraft>((set) => ({
  ...initialState,
  setCourse: (courseId) => set({ courseId }),
  updateField: (field, value) => set({ [field]: value } as Partial<EnrollmentDraft>),
  setPromoResult: (result) => set({ promoResult: result }),
  setPendingOrder: (order) => set({ pendingOrder: order }),
  reset: () => set({ ...initialState }),
}));
