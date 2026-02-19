import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useStateContext } from "../context";
import { money } from "../assets";
import { CustomButton, FormField, Loader } from "../components";
import { checkIfImage } from "../utils";

const SectionLabel = ({ number, label }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-7 h-7 rounded-lg bg-[#f97316]/20 border border-[#f97316]/40 flex items-center justify-center flex-shrink-0">
      <span className="font-jakarta font-bold text-xs text-[#fdba74]">{number}</span>
    </div>
    <span className="section-label text-white/50">{label}</span>
    <div className="flex-1 h-px bg-white/[0.06]" />
  </div>
);

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: "",
    title: "",
    category: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18),
        });
        setIsLoading(false);
        navigate("/");
      } else {
        alert("Provide a valid image URL");
        setForm({ ...form, image: "" });
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {isLoading && <Loader />}

      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-jakarta font-bold text-3xl gradient-text mb-2">
          Launch a Campaign
        </h1>
        <p className="font-epilogue text-sm text-white/35">
          Share your story and start raising funds from the global community.
        </p>
      </div>

      {/* Main card */}
      <div className="glass rounded-3xl p-8 border border-white/[0.07]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">

          {/* Section 1: Identity */}
          <div>
            <SectionLabel number="1" label="About you" />
            <div className="flex flex-wrap gap-6">
              <FormField
                labelName="Your Name *"
                placeholder="e.g. Jane Smith"
                inputType="text"
                value={form.name}
                handleChange={(e) => handleFormFieldChange("name", e)}
              />
              <FormField
                labelName="Campaign Title *"
                placeholder="e.g. Clean Water for Villages"
                inputType="text"
                value={form.title}
                handleChange={(e) => handleFormFieldChange("title", e)}
              />
            </div>
          </div>

          {/* Section 2: Category */}
          <div>
            <SectionLabel number="2" label="Category" />
            <FormField
              labelName="Select Category *"
              isCategory
              value={form.category}
              handleChange={(e) => handleFormFieldChange("category", e)}
            />
          </div>

          {/* Section 3: Story */}
          <div>
            <SectionLabel number="3" label="Your story" />
            <FormField
              labelName="Story *"
              placeholder="Tell potential donors what this campaign is about, why it matters, and how funds will be used..."
              isTextArea
              value={form.description}
              handleChange={(e) => handleFormFieldChange("description", e)}
            />
          </div>

          {/* 100% banner */}
          <div className="relative overflow-hidden rounded-2xl p-5 border border-[#f97316]/25">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f97316]/15 via-[#fb923c]/10 to-[#03dac5]/10" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f97316]/20 border border-[#f97316]/40 flex items-center justify-center flex-shrink-0">
                <img src={money} alt="money" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <h4 className="font-jakarta font-bold text-white text-base">
                  You receive 100% of what's raised
                </h4>
                <p className="font-epilogue text-xs text-white/40 mt-0.5">
                  No platform fees. Smart contract sends funds directly to you.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Goal & Deadline */}
          <div>
            <SectionLabel number="4" label="Funding goal" />
            <div className="flex flex-wrap gap-6">
              <FormField
                labelName="Goal (ETH) *"
                placeholder="e.g. 0.0000001"
                inputType="number"
                value={form.target}
                handleChange={(e) => handleFormFieldChange("target", e)}
              />
              <FormField
                labelName="End Date *"
                inputType="date"
                value={form.deadline}
                handleChange={(e) => handleFormFieldChange("deadline", e)}
              />
            </div>
          </div>

          {/* Section 5: Image */}
          <div>
            <SectionLabel number="5" label="Campaign image" />
            <FormField
              labelName="Image URL *"
              placeholder="https://example.com/campaign-image.jpg"
              inputType="url"
              value={form.image}
              handleChange={(e) => handleFormFieldChange("image", e)}
            />
            {form.image && (
              <div className="mt-4 rounded-xl overflow-hidden border border-white/10 h-[200px]">
                <img
                  src={form.image}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <CustomButton
              btnType="submit"
              title="Launch Campaign →"
              styles="bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:shadow-[0_0_24px_rgba(249,115,22,0.5)] px-8"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
