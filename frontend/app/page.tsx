"use client";
import Button from "@/components/Button/Button";

import Upload from "@/components/Upload/Upload";
import Image from "next/image";
import { useState } from "react";
export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
  const [file, setFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"remove-bg" | "make-grey">("remove-bg");

  const handleFileChange = (e: { target: { files: FileList | null } }) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResultImage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    try {
      const response = await fetch(`${API_URL}/api/remove-bg`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const img = new window.Image();
        img.src = url;
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          setResultImage(url);
        };
      } else {
        alert("Error");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to Python");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-5">
      <div className="container1 text-[#fcfcfc] flex flex-col gap-8 items-center">
        <h1 className="font-medium text-3xl leading-14 text-center">
          Delete background
        </h1>
        <Upload onChange={handleFileChange}></Upload>
        <div className="flex gap-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="remove-bg"
              checked={mode === "remove-bg"}
              onChange={() => setMode("remove-bg")}
              className="w-4 h-4"
            />
            <span className="font-medium text-xl leading-2">
              Delete background
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="make-grey"
              checked={mode === "make-grey"}
              onChange={() => setMode("make-grey")}
              className="w-4 h-4"
            />
            <span className="font-medium text-xl leading-2">Make grey</span>
          </label>
        </div>
        <Button onclick={handleUpload} disabled={!file}></Button>
        {resultImage && imageDimensions && !loading && (
          <div className="flex flex-col items-center">
            <h3 className="font-medium text-2xl leading-14 text-center">
              Result:
            </h3>
            <div className="border-2 border-[#ccc] mb-8">
              <Image
                src={resultImage}
                alt="No Background"
                width={500}
                height={500}
              />
            </div>
            <a
              href={resultImage}
              download="edited.png"
              className="w-66.75 h-15 rounded-xl px-22 py-4 bg-black text-[#fcfcfc] font-bold text-center text-[17px] leading-7 hover:bg-gray-900 transition-all ease-out"
            >
              Download
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
