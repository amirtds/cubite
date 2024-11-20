"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";

const RegistrationFields = ({ onFieldChange, title, existingFields }) => {
  const [fields, setFields] = useState(existingFields ? existingFields : []);

  useEffect(() => {
    onFieldChange(fields);
  }, [fields, onFieldChange]);

  const handleAddField = () => {
    setFields([...fields, { text: "", type: "text", required: false }]);
  };

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleFieldChange = (index, fieldKey, value) => {
    const newFields = fields.map((field, i) =>
      i === index ? { ...field, [fieldKey]: value } : field
    );
    setFields(newFields);
  };

  return (
    <div className="w-full">
      <h3 className="font-medium">{title}</h3>
      <ul>
        {fields.map((field, index) => (
          <li key={index} className="flex items-center space-x-2 mb-2">
            <label className="form-control max-w-xs flex-none w-2/6">
              <input
                type="text"
                name="fieldtext"
                required
                value={field.text}
                className="input input-bordered w-full max-w-xs input-md"
                placeholder="Field Text"
                onChange={(e) =>
                  handleFieldChange(index, "text", e.target.value)
                }
              />
            </label>
            <select
              className="select select-bordered flex-none w-1/4"
              value={field.type}
              onChange={(e) => handleFieldChange(index, "type", e.target.value)}
            >
              <option disabled>Type</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
            </select>

            <select
              className="select select-bordered flex-none w-1/4"
              value={field.required.toString()}
              onChange={(e) =>
                handleFieldChange(index, "required", e.target.value === "true")
              }
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
            <button
              onClick={() => handleRemoveField(index)}
              className="m-2 px-4 btn btn-outline btn-error"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleAddField}
        className="my-2 btn btn-outline btn-sm btn-secondary"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default RegistrationFields;
