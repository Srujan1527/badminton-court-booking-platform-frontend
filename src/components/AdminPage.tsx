import { useState } from "react";
import { AdminTabButton } from "./AdminTabButton";
import { AdminCourtForm } from "./AdminCourtForm";
import { AdminEquipmentForm } from "./AdminEquipmentForm";
import { AdminCoachForm } from "./AdminCoachForm";
import { AdminPricingRuleForm } from "./AdminPricingRuleForm";
import { AdminCoachAvailabilityForm } from "./AdminCoachAvailabilityForm";

export const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<
    "court" | "equipment" | "coach" | "pricing" | "coachAvailability"
  >("court");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <AdminTabButton
          label="Courts"
          value="court"
          tab={tab}
          setTab={setTab}
        />
        <AdminTabButton
          label="Equipment"
          value="equipment"
          tab={tab}
          setTab={setTab}
        />
        <AdminTabButton
          label="Coaches"
          value="coach"
          tab={tab}
          setTab={setTab}
        />
        <AdminTabButton
          label="Pricing Rules"
          value="pricing"
          tab={tab}
          setTab={setTab}
        />
        <AdminTabButton
          label="Coach Availability"
          value="coachAvailability"
          tab={tab}
          setTab={setTab}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm">
        {tab === "court" && <AdminCourtForm />}
        {tab === "equipment" && <AdminEquipmentForm />}
        {tab === "coach" && <AdminCoachForm />}
        {tab === "pricing" && <AdminPricingRuleForm />}
        {tab === "coachAvailability" && <AdminCoachAvailabilityForm />}
      </div>
    </div>
  );
};
