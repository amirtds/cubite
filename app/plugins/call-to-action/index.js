import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { CldImage } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";

class CTA {
  static get toolbox() {
    return {
      title: "Call to Action",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>',
    };
  }

  constructor({ data }) {
    this.data = data || {};
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const CtaComponent = ({ initialData }) => {
      const [title, setTitle] = useState(initialData.title || "Our people");
      const [description, setDescription] = useState(
        initialData.description ||
          "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat. Quasi aperiam sit non sit neque reprehenderit."
      );
      const [image, setImage] = useState(
        initialData.image || "photo-1715967635831-f5a1f9658880_mhlqwu"
      );
      const [buttonText, setButtonText] = useState(
        initialData.buttonText || "Join our Team"
      );
      const [buttonUrl, setButtonUrl] = useState(initialData.buttonUrl || "#");

      const handleTitle = (e) => {
        setTitle(e.target.value);
        this.data.title = e.target.value;
      };

      const handleDescription = (e) => {
        setDescription(e.target.value);
        this.data.description = e.target.value;
      };

      const handleButtonText = (e) => {
        setButtonText(e.target.value);
        this.data.buttonText = e.target.value;
      };

      const handleButtonUrl = (e) => {
        setButtonUrl(e.target.value);
        this.data.buttonUrl = e.target.value;
      };

      const handleUploadSuccess = (src) => {
        this.data.image = src;
        setImage(src);
      };

      const handleUrlChange = (e) => {
        setButtonUrl(e.target.value);
      };

      return (
        <div className="overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <h2
                  className="text-3xl font-bold tracking-tight sm:text-4xl !mt-3 !mb-0"
                  onClick={() =>
                    document.getElementById("title_modal").showModal()
                  }
                >
                  {title}
                </h2>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <dialog id="title_modal" className="modal">
                  <div className="modal-box">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text font-semibold text-md">
                          Title
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs"
                        onChange={handleTitle}
                        defaultValue={title}
                      />
                    </label>
                    <div className="modal-action">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                      </form>
                    </div>
                  </div>
                </dialog>
                <p
                  className="mt-6 text-base leading-7"
                  onClick={() =>
                    document.getElementById("description_modal").showModal()
                  }
                >
                  {description}
                </p>
                <dialog id="description_modal" className="modal">
                  <div className="modal-box">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text font-semibold text-md">
                          Description
                        </span>
                      </div>
                      <textarea
                        className="textarea textarea-bordered h-24"
                        onChange={handleDescription}
                        defaultValue={description}
                      ></textarea>
                    </label>
                    <div className="modal-action">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                      </form>
                    </div>
                  </div>
                </dialog>
                <div className="mt-4 flex">
                  <button
                    className="btn btn-outline btn-ghost"
                    onClick={() =>
                      document.getElementById("button_modal").showModal()
                    }
                  >
                    {buttonText}
                  </button>
                  <dialog id="button_modal" className="modal">
                    <div className="modal-box">
                      <label className="form-control w-full max-w-xs">
                        <div className="label">
                          <span className="label-text font-semibold text-md">
                            Text
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered w-full max-w-xs"
                          onChange={handleButtonText}
                          defaultValue={buttonText}
                        />
                      </label>
                      <label className="form-control w-full max-w-xs">
                        <div className="label">
                          <span className="label-text font-semibold text-md">
                            URL
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered w-full max-w-xs"
                          onChange={handleButtonUrl}
                          defaultValue={buttonUrl}
                        />
                      </label>
                      <div className="modal-action">
                        <form method="dialog">
                          {/* if there is a button in form, it will close the modal */}
                          <button className="btn">Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </div>
              </div>
              <div className="text-center">
                <div className="mt-4 flex text-sm leading-6">
                  <CldUploadWidget
                    uploadPreset="dtskghsx"
                    options={{
                      multiple: false,
                    }}
                    onSuccess={(results, options) => {
                      handleUploadSuccess(results.info?.public_id);
                    }}
                  >
                    {({ open }) => {
                      return (
                        <CldImage
                          width={500}
                          height={500}
                          src={image}
                          alt="Description of my image"
                          onClick={() => open()}
                          className="rounded-md"
                        />
                      );
                    }}
                  </CldUploadWidget>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    root.render(<CtaComponent initialData={this.data} />);

    return wrapper;
  }

  save(blockContent) {
    return {
      title: this.data.title,
      description: this.data.description,
      image: this.data.image,
      buttonText: this.data.buttonText,
      buttonUrl: this.data.buttonUrl,
    };
  }
}

export default CTA;
