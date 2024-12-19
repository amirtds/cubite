import React, { useState} from "react";
import { createRoot } from "react-dom/client";
import Link from "next/link";

class CallToActionNoImage {
  static get toolbox() {
    return {
      title: "CTA (No Image)",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-milestone"><path d="M12 13v8"/><path d="M12 3v3"/><path d="M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z"/></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = data || {
        title: "A better way to ship your projects",
        description: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt.",
        buttonText: "Get Started",
        buttonUrl: "/",
        backgroundImage: null,
    };
    this.siteThemeName = config.siteThemeName;
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const CallToActionNoImageComponent = ({ initialData }) => {
        console.log(initialData);
        const [title, setTitle] = useState(initialData.title || "A better way to ship your projects");
        const [description, setDescription] = useState(initialData.description || "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt.");
        const [buttonText, setButtonText] = useState(initialData.buttonText || "Get Started");
        const [buttonUrl, setButtonUrl] = useState(initialData.buttonUrl || "/");
        const [hasBackgroundColour, setHasBackgroundColour] = useState(initialData.hasBackgroundColour || false);

        const handleTitleChange = (e) => {
            setTitle(e.target.value);
            this.data.title = e.target.value;
        };

        const handleDescriptionChange = (e) => {
            setDescription(e.target.value);
            this.data.description = e.target.value;
        };

        const handleButtonTextChange = (e) => {
            setButtonText(e.target.value);
            this.data.buttonText = e.target.value;
        };

        const handleButtonUrlChange = (e) => {
            setButtonUrl(e.target.value);
            this.data.buttonUrl = e.target.value;
        };

        const handleHasBackgroundColourChange = (e) => {
            setHasBackgroundColour(e.target.checked);
            this.data.hasBackgroundColour = e.target.checked;
        };

        return (
            <div role="tablist" className="tabs tabs-lifted my-4" data-theme={this.siteThemeName}>
                <input type="radio" name="cta" role="tab" className="tab" aria-label="Preview" defaultChecked />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                    <div className={`grid grid-cols-3 gap-4 p-8 relative ${hasBackgroundColour ? 'bg-base-200/80' : ''}`}>
                        <div className="relative z-10 col-span-full">
                            <p className="text-5xl font-bold mb-4">{title}</p>
                            <p className="mb-6 antialiased tracking-wide">{description}</p>
                            <Link href={buttonUrl} className="btn btn-primary !no-underline w-1/4 mt-4">{buttonText}</Link>
                        </div>
                    </div>
                </div>
                <input
                    type="radio"
                    name="cta"
                    role="tab"
                    className="tab"
                    aria-label="Settings"
                />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                    <div className="grid grid-cols-3 gap-4">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Title</span>
                            </div>
                            <input type="text" placeholder={this.data.title} className="input input-bordered w-full max-w-xs" value={title} onChange={handleTitleChange} />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Button Text</span>
                            </div>
                            <input type="text" placeholder={this.data.buttonText} className="input input-bordered w-full max-w-xs" value={buttonText} onChange={handleButtonTextChange} />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Button URL</span>
                            </div>
                            <input type="text" placeholder={this.data.buttonUrl} className="input input-bordered w-full max-w-xs" value={buttonUrl} onChange={handleButtonUrlChange} />
                        </label>
                        
                        <label className="form-control col-span-full">
                            <div className="label">
                                <span className="label-text">Description</span>
                            </div>
                            <textarea className="textarea textarea-bordered textarea-md w-full h-24" placeholder={this.data.description} value={description} onChange={handleDescriptionChange}></textarea>
                        </label>
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Has Background Color</span>
                                <input type="checkbox" defaultChecked={hasBackgroundColour} className="checkbox" onChange={handleHasBackgroundColourChange} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    root.render(<CallToActionNoImageComponent initialData={this.data} />);
    return wrapper;
  }

  save(blockContent) {
    return {
      title: this.data.title,
      description: this.data.description,
      buttonText: this.data.buttonText,
      buttonUrl: this.data.buttonUrl,
      hasBackgroundColour: this.data.hasBackgroundColour,
      siteThemeName: this.data.siteThemeName,
    };
  }
}

export default CallToActionNoImage;