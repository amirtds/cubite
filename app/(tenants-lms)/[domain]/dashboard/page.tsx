import React, { Suspense } from "react";
import DashboardCourseCard from "@/app/components/DashboardCourseCard";

interface Props {
  params: {
    domain: string;
  };
}

const Dashboard = ({ params: { domain } }: Props) => {
  return (
    <div className="">
      <div className="text-3xl font-semibold">Dashboard</div>
      <div className="grid grid-cols-3 my-12">
        <div className="col-span-2">
          <DashboardCourseCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
