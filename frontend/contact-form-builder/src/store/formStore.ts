import { create } from "zustand";

type Field = {
  id: string;
  label: string;
  type: string;
  options?: string[]; // for dropdown, radio, checkbox
};

type FormState = {
  fields: Field[];
  addField: (field: Field) => void;
  removeField: (id: string) => void;
};

export const useFormStore = create<FormState>((set) => ({
  fields: [
    { id: "1", label: "First Name", type: "text" },
    { id: "2", label: "Email", type: "email" },
  ],
  addField: (field) => set((state) => ({ fields: [...state.fields, field] })),
  removeField: (id) => set((state) => ({ fields: state.fields.filter((f) => f.id !== id) })),
}));
