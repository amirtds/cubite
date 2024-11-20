"use client";

import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAlert } from "@/app/utils/useAlert";
function SiteDeletionTab() {
    const {
        message: deleteSiteMessage,
        status: deleteSiteStatus,
        setMessage: setDeleteSiteMessage,
        setStatus: setDeleteSiteStatus,
      } = useAlert();

    const handleDeleteSite = async () => {
        try {
          const response = await fetch(`/api/site/${domainName}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ domainName: site?.domainName }),
          });
    
          const result = await response.json();
          setDeleteSiteMessage(result.message);
          setDeleteSiteStatus(result.status);
    
          if (result.status === 200) {
            router.push("/admin/sites");
          } else {
            console.error("Failed to delete site:", result.message);
          }
        } catch (error) {
          console.error("Error deleting site:", error);
          setDeleteSiteMessage("An error occurred while deleting the site.");
          setDeleteSiteStatus(500);
        }
      };
  return (
    <>
      <input
        type="radio"
        name="sites_tabs"
        role="tab"
        className="tab"
        aria-label="Danger"
      />
      <div role="tabpanel" className="tab-content py-10">
        <p>
          Deleting a site will remove all the site related data and users. You
          can also deactivate a site instead of delete it.
        </p>
        <div className="mt-6 gap-x-6">
          <button
            className="btn btn-outline btn-error mt-4"
            onClick={() =>
              document.getElementById("delete_site_modal").showModal()
            }
          >
            <TrashIcon className="h-5 w-6" aria-hidden="true" />
            Delete {site.name}
          </button>
          <dialog id="delete_site_modal" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">Are you sure ?</h3>
              <p className="py-4">
                Click on Delete to remove site completely. If you don&apos;t
                want to delete the site press ESC key or click on ✕ button.
              </p>
              <button
                className="btn btn-outline btn-primary"
                onClick={handleDeleteSite}
              >
                Delete
              </button>
            </div>
          </dialog>
        </div>
      </div>
    </>
  );
}

export default SiteDeletionTab;
