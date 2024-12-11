"use client";

import React, { useState } from 'react'

interface SiteIsOpenedxSiteProps {
  isOpenedxSite: boolean;
  openedxSiteUrl: string;
  siteId: string;
  siteDomainName: string;
}

function SiteIsOpenedxSite({ isOpenedxSite, openedxSiteUrl, siteId, siteDomainName }: SiteIsOpenedxSiteProps) {
  const [isOpenedx, setIsOpenedx] = useState(isOpenedxSite);
  const [openedxUrl, setOpenedxUrl] = useState(openedxSiteUrl);
  const [isOpenedxStatus, setIsOpenedxStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [openedxUrlStatus, setOpenedxUrlStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleIsOpenedx = async () => {
    setIsOpenedx(!isOpenedx);
    try {
        const siteObject = {
          siteId,
          updateData: {
            isOpenedxSite: !isOpenedx,
          },
        };
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${siteDomainName}`,
          {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(siteObject),
          }
        );
  
        if (response.ok) {
          setIsOpenedxStatus({ type: 'success', message: 'Successfully updated the Open edX site status!' });
        } else {
          const errorData = await response.json();
          setIsOpenedxStatus({ type: 'error', message: errorData.message || 'Failed to update the Open edX site status' });
        }
      } catch (error) {
        setIsOpenedxStatus({ type: 'error', message: 'An error occurred while updating the Open edX site status' });
      }

      // Clear status message after 3 seconds
      setTimeout(() => {
        setIsOpenedxStatus({ type: null, message: '' });
      }, 3000);

  }

  const handleOpenedxUrl = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpenedxUrl(e.target.value);
    try {
        const siteObject = {
          siteId,
          updateData: {
            openedxSiteUrl: e.target.value,
          },
        };
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${siteDomainName}`,
          {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(siteObject),
          }
        );
  
        if (response.ok) {
          setOpenedxUrlStatus({ type: 'success', message: 'Open edX site URL updated successfully!' });
        } else {
          const errorData = await response.json();
          setOpenedxUrlStatus({ type: 'error', message: errorData.message || 'Failed to update Open edX site URL' });
        }
      } catch (error) {
        setOpenedxUrlStatus({ type: 'error', message: 'An error occurred while updating the Open edX site URL' });
      }

      // Clear status message after 3 seconds
      setTimeout(() => {
        setOpenedxUrlStatus({ type: null, message: '' });
      }, 3000);

  }

  return (
    <>
    <div className="form-control sm:col-span-2 justify-center">
    <label className="label cursor-pointer">
        <span className="label-text">Is this an Open edX site?</span>
        <input type="checkbox" defaultChecked={isOpenedx} onChange={handleIsOpenedx} className="checkbox" />
    </label>
    {isOpenedxStatus.type && (
        <div className={`label ${isOpenedxStatus.type === 'success' ? 'text-success' : 'text-error'}`}>
            <span className="label-text-alt text-green-600">{isOpenedxStatus.message}</span>
        </div>
    )}
    </div>
    {
        isOpenedx && (
            <label className="form-control sm:col-span-2">
                <div className="label">
                    <span className="label-text">Please enter the Open edX site URL</span>
                </div>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={openedxUrl} onChange={handleOpenedxUrl} />
            {openedxUrlStatus.type && (
                <div className={`label ${openedxUrlStatus.type === 'success' ? 'text-success' : 'text-error'}`}>
                    <span className="label-text-alt text-green-600">{openedxUrlStatus.message}</span>
                </div>
            )}
            </label>
        )
    }
    </>

    
    
  )
}

export default SiteIsOpenedxSite