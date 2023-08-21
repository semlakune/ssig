'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState(1);
  const [isValidValue, setIsValidValue] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [lastTotalSize, setLastTotalSize] = useState(0);

  const generateImageFile = async () => {
    try {
      setDownloadLink("");
      setIsDownloading(true);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const imageSizeBytes = value * 1024 * 1024;
      const targetSizeBytes = imageSizeBytes * 4.68; // Adjusted factor based on compression 11.572

      const imageWidth = Math.floor(Math.sqrt(targetSizeBytes / 4)); // Each pixel requires 4 bytes (RGBA)
      const imageHeight = Math.ceil(targetSizeBytes / (4 * imageWidth));

      canvas.width = imageWidth;
      canvas.height = imageHeight;

      const imageData = ctx.createImageData(imageWidth, imageHeight);

      // Fill image data with random values
      for (let i = 0; i < imageData.data.length; i++) {
        imageData.data[i] = Math.floor(Math.random() * 256);
      }

      ctx.putImageData(imageData, 0, 0);

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/jpeg");
      a.download = `generated_image_${value}MB.jpg`;
      setLastTotalSize(value);
      setDownloadLink(a.href);

      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        setIsDownloading(false);
      }, 100);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setIsValidValue(value >= 1 && value <= 100);
  }, [value]);

  return (
      <div className="w-screen h-screen flex justify-start items-center flex-col gap-5 sm:mt-0 lg:mt-20">
        <Image src={"/doraemon.gif"} alt={"doraemon"} width={80} height={80} priority={true}/>
        <h1 className="text-xl font-bold">Size Specific Image Generator</h1>
        <p className="lg:w-1/4 text-center mb-[50px] px-8">
          The Size Specific Image Generator is a tool designed for generates images that meet specific size requirements, ensuring accurate testing without the hassle of manual adjustments.
        </p>
        <div className="lg:w-1/4 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-5 w-[100%]">
            <input
                className="border px-3 py-2 rounded-md w-[90%]"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                min={1}
            />
            <p className="text-sm text-end font-bold w-[10%]">MB</p>
          </div>
          <button
              className={`w-[100%] rounded-md px-3 py-2 text-white transition-all ${
                  isValidValue ? "bg-blue-600 hover:scale-105" : "bg-slate-600 cursor-not-allowed"
              }`}
              onClick={async () => {
                if (isValidValue) {
                  await generateImageFile();
                }
              }}
          >
            {isDownloading ? "Generating..." : "Generate Image"}
          </button>
          {isDownloading ? <p>Generating image...</p> : null}
          {downloadLink && !isDownloading ? (
              <a
                  href={downloadLink}
                  download
                  onClick={() => setDownloadLink(null)}
                  className="w-[100%] rounded-md px-3 py-2 text-white bg-emerald-600 text-center"
              >
                Download {lastTotalSize}MB
              </a>
          ) : null}
        </div>
        <div className="absolute bottom-10 flex items-center justify-center gap-2">
          <h1 className="text-sm font-light">
            Made with ☕️ by{" "}
            <span
                onClick={() => router.push("https://ajipurnomo.dev")}
                className="cursor-pointer hover:text-sky-800 hover:font-bold transition-all"
            >
            Aji
          </span>
          </h1> | <h1 className="text-sm font-light">Thanks to chatGPT</h1>
        </div>
      </div>
  );
}
