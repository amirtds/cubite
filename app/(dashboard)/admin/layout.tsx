import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import {
  LinkIcon,
  WindowIcon,
  ChartPieIcon,
  UsersIcon,
  PaintBrushIcon,
  BookOpenIcon,
  MapIcon,
  PencilSquareIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  return (
    <div className="max-w-screen-2xl items-center mx-auto">
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
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                href="/admin/sites"
              >
                <WindowIcon className="h-6 w-6" />
                <span>Sites</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                href="/admin/interface-design"
              >
                <PaintBrushIcon className="h-6 w-6" />
                <span>Interface Design</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                href="/admin/courses"
              >
                <BookOpenIcon className="h-6 w-6" />
                <span>Courses</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                href="/admin/posts"
              >
                <DocumentTextIcon className="h-6 w-6" />
                <span>Posts</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                href="/admin/content-authoring"
              >
                <PencilSquareIcon className="h-6 w-6" />
                <span>Content Authoring</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                href="/admin/courses"
              >
                <MapIcon className="h-6 w-6" />
                <span>Learning Path</span>
              </Link>

              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                href="/admin/users"
              >
                <UsersIcon className="h-6 w-6" />
                <span>Users</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                href="/admin/reports"
              >
                <ChartPieIcon className="h-6 w-6" />
                <span>Reports</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                href="/admin/reports"
              >
                <LinkIcon className="h-6 w-6" />
                <span>APIs</span>
              </Link>
            </div>
          </nav>
        </div>
        <div className="flex-1 p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
