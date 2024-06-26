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
      const [showModal, setShowModal] = useState(false);
      const [modalType, setModalType] = useState("");
      const [buttonText, setButtonText] = useState(
        initialData.buttonText || "Join our Team"
      );
      const [buttonUrl, setButtonUrl] = useState(initialData.buttonUrl || "#");

      const handleTitleClick = () => {
        setModalType("title");
        setShowModal(true);
      };

      const handleDescriptionClick = () => {
        setModalType("description");
        setShowModal(true);
      };

      const handleButtonClick = () => {
        setModalType("button");
        setShowModal(true);
      };

      const handleUploadSuccess = (src) => {
        this.data.image = src;
        setImage(src);
        console.log(src);
      };

      const handleModalSave = () => {
        setShowModal(false);
        if (modalType === "title") {
          setTitle(tempValue);
        } else if (modalType === "description") {
          setDescription(tempValue);
        } else if (modalType === "button") {
          setButtonText(tempValue);
        }
      };

      const handleUrlChange = (e) => {
        setButtonUrl(e.target.value);
      };

      return (
        <div className="overflow-hidden bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <h2
                  className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl cursor-pointer"
                  onClick={handleTitleClick}
                >
                  {title}
                </h2>
                <p
                  className="mt-6 text-base leading-7 text-gray-600 cursor-pointer"
                  onClick={handleDescriptionClick}
                >
                  {description}
                </p>
                <div className="mt-10 flex">
                  <button
                    className="btn btn-outline btn-ghost"
                    onClick={handleButtonClick}
                  >
                    {buttonText}
                  </button>
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
                        />
                      );
                    }}
                  </CldUploadWidget>
                </div>
              </div>
            </div>
          </div>

          {showModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Edit {modalType === "button" ? "Button" : modalType}
                        </h3>
                        <div className="mt-2">
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder={`Enter ${modalType}`}
                          />
                          {modalType === "button" && (
                            <input
                              type="text"
                              className="input input-bordered w-full mt-2"
                              value={buttonUrl}
                              onChange={handleUrlChange}
                              placeholder="Button URL"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleModalSave}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost mx-2"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
