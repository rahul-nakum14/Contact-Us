"use client";
import { useFormStore } from "../store/formStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";

const fieldTypes = ["text", "email", "checkbox", "radio", "url", "textarea", "dropdown"];

export default function FormBuilder() {
  const { fields, addField, removeField } = useFormStore();
  const { register, handleSubmit } = useForm();
  const [formBg, setFormBg] = useState("#ffffff");

  const onSubmit = (data: any) => console.log("Submitted Data:", data);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Create Your Form</h2>

      <div className="flex gap-4">
        {/* Field Selection */}
        <div className="w-1/3 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Add Fields</h3>
          {fieldTypes.map((type) => (
            <button
              key={type}
              onClick={() => addField({ id: nanoid(), label: type, type })}
              className="block bg-blue-500 text-white px-4 py-2 mt-2 rounded"
            >
              Add {type}
            </button>
          ))}
        </div>

        {/* Form Preview */}
        <div className="w-2/3 p-4 rounded" style={{ backgroundColor: formBg }}>
          <h3 className="text-lg font-semibold">Live Preview</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block">{field.label}</label>
                <input {...register(field.label)} className="border p-2 w-full" type={field.type} />
                <button onClick={() => removeField(field.id)} className="text-red-500">Remove</button>
              </div>
            ))}
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
          </form>
        </div>
      </div>

      {/* Background Color Picker */}
      <label className="block mt-4">Change Form Background:</label>
      <input type="color" value={formBg} onChange={(e) => setFormBg(e.target.value)} />
    </div>
  );
}
