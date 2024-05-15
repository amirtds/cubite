import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/authOptions";
import { WindowIcon } from "@heroicons/react/24/outline";
import { ChartPieIcon } from "@heroicons/react/24/outline";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex h-screen w-full my-4">
      <div className="flex h-full w-[280px] flex-col border-r">
        <div className="flex h-[60px] items-center justify-between border-b px-6">
          <div className="flex items-center gap-2 font-semibold">
            <Link href="/admin" className="text-lg">
              Administration
            </Link>
          </div>
          <button className="h-8 w-8">
            <span className="sr-only">Toggle notifications</span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid gap-2">
            <Link
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
              href="/admin/sites"
            >
              <WindowIcon className="h-6 w-6" />
              <span>Sites</span>
            </Link>
            <Link
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
              href="/admin/reports"
            >
              <ChartPieIcon className="h-6 w-6" />
              <span>Reports</span>
            </Link>
          </div>
        </nav>
      </div>
      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  );
};

export default AdminLayout;
