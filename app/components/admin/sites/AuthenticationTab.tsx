"use client";

import React, { useState } from "react";
import RegistrationFields from "@/app/components/RegistrationFields";

function AuthenticationTab() {
  const [extraRegistrationFields, setExtraRegistrationFields] = useState([
    { text: "", type: "text", required: false },
  ]);

  const handleExtraRegistrationFields = (fields) => {
    setExtraRegistrationFields(fields);
  };

  return (
    <>
      <input
        type="radio"
        name="sites_tabs"
        role="tab"
        className="tab"
        aria-label="Authentication"
      />
      <div role="tabpanel" className="tab-content py-10">
        <div className="sm:col-span-6">
          <RegistrationFields
            title={"Extra Registration Fields"}
            onFieldChange={handleExtraRegistrationFields}
            existingFields={extraRegistrationFields}
          />
        </div>
      </div>
    </>
  );
}

export default AuthenticationTab;
