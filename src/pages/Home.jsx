import {useEffect, useState} from "react";
import {Header} from "../components/layouts/Header.jsx";
import Footer from "../components/layouts/Footer.jsx";
import {Cookie} from "../components/cards/Cookie.jsx";
import chroma from "chroma-js";
import {SignOut} from "../components/cards/SignOut.jsx";
import {ForgotPassword} from "../components/cards/ForgotPassword.jsx";
import {SwitchNotification} from "../components/cards/SwitchNotification.jsx";
import {Stats} from "../components/cards/Stats.jsx";
import {Pricing} from "../components/cards/Pricing.jsx";
import {FaCopy, FaFileExport} from "react-icons/fa";
import {PopUp} from "../components/modals/PopUp.jsx";

export const Home = () => {
  const [color, setColor] = useState("#2563eb");
  const [inputColor, setInputColor] = useState("#2563eb");
  const [tooltip, setTooltip] = useState({});
  const [showTooltip, setShowTooltip] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 32) {
        event.preventDefault();
        generateNewColor();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleColorClick = (shade) => {
    navigator.clipboard.writeText(palette[shade].toUpperCase()).then(() => {
      setTooltip((prev) => ({ ...prev, [shade]: true }));
      setTimeout(
        () => setTooltip((prev) => ({ ...prev, [shade]: false })),
        2000,
      );
    });
  };

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setInputColor(newColor);
    if (chroma.valid(newColor)) setColor(newColor);
  };

  const handleTextInputChange = (event) => {
    let newColor = event.target.value.trim().toLowerCase();
    if (!newColor.startsWith("#")) newColor = `#${newColor}`;
    if (newColor.length <= 7) {
      setInputColor(newColor);
      if (chroma.valid(newColor)) setColor(newColor);
    }
  };

  const generatePalette = (baseColor) => {
    const values = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const darkerShade = chroma(baseColor).darken(2).hex();
    const lighterShade = chroma(baseColor).brighten(2).hex();
    return chroma
      .scale([darkerShade, baseColor, lighterShade])
      .mode("lab")
      .colors(11)
      .reverse()
      .reduce((acc, color, index) => ({ ...acc, [values[index]]: color }), {});
  };

  const palette = generatePalette(color);

  const generateNewColor = () => {
    const newColor = chroma.random().hex();
    setColor(newColor);
    setInputColor(newColor);
  };

  const generatePaletteCode = () => {
    return `'primary': {
${Object.entries(palette)
  .map(
    ([shade, colorValue]) => `    '${shade}': '${colorValue.toUpperCase()}',`,
  )
  .join("\n")}
},`;
  };

  const copyPaletteCode = () => {
    const code = generatePaletteCode();
    navigator.clipboard.writeText(code).then(() => {
      setShowTooltip(true);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Header />
        <section className="pt-16 px-6 text-center">
          <h1 className="text-4xl font-bold text-black dark:text-white mt-12">
            Tailwind CSS Color Generator
          </h1>
          <h3 className="hidden sm:block text-lg text-gray-500 dark:text-gray-400 mt-2">
            Press space bar to generate a custom color scale
          </h3>
          <button
            type="button"
            onClick={generateNewColor}
            className="relative mt-8 py-3 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-gray-300 text-white dark:text-black sm:hidden"
          >
            Generate Random Color
          </button>
        </section>

        <main className="px-6 xl:px-0">
          <section className="flex items-center justify-center w-full py-10">
            <div className="flex items-center justify-center max-w-xl w-full">
              <div className="relative w-12 h-[2.65rem] mt-[0.05rem] p-1.5 border rounded-bl-lg rounded-tl-lg border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                <input
                  type="color"
                  value={inputColor}
                  onChange={handleColorChange}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  style={{ backgroundColor: inputColor }}
                  className="w-full h-full rounded-full transition-colors duration-300 ease-in-out"
                />
              </div>
              <input
                name="color"
                type="text"
                value={inputColor.toUpperCase()}
                onChange={handleTextInputChange}
                className="block w-full rounded-l-none rtl:rounded-l-lg rtl:rounded-r-none placeholder-neutral-400/70 dark:placeholder-neutral-500 rounded-lg border border-neutral-200 bg-white px-5 py-2 text-neutral-700 focus:border-neutral-400 focus:outline-none dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300"
              />
              <button
                type="button"
                onClick={() => setShowTooltip(true)}
                className="relative ml-3 py-3 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-gray-300 text-white dark:text-black"
              >
                <FaFileExport />
              </button>
            </div>
          </section>

          <section className="flex items-center justify-center w-full pb-10 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-y-2 lg:gap-x-8 w-full">
              {Object.entries(palette).map(([shade, colorValue]) => (
                <div
                  key={shade}
                  className="flex flex-col items-center justify-center"
                >
                  <div
                    className="w-full sm:w-14 lg:w-16 h-16 relative rounded-lg cursor-pointer transition-colors duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: colorValue }}
                    onClick={() => handleColorClick(shade)}
                  >
                    {tooltip[shade] && (
                      <div className="absolute top-0 left-0 bg-black text-white text-xs p-1 rounded-tl-lg rounded-br">
                        Copied
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {shade}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {colorValue.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="max-w-7xl">
            <div className="container pb-6 m-auto">
              <div className="grid grid-cols-4 gap-6 lg:grid-cols-12">
                <div className="col-span-4 lg:col-span-3">
                  <SignOut color={color} />
                </div>
                <div className="col-span-4 lg:col-span-6">
                  <ForgotPassword color={color} />
                </div>
                <div className="col-span-4 lg:col-span-3">
                  <Cookie color={color} />
                </div>
              </div>
            </div>

            <div className="container pb-6 m-auto">
              <div className="grid grid-cols-4 gap-6 lg:grid-cols-12">
                <div className="col-span-4 lg:col-span-7">
                  <Pricing color={color} />
                </div>
                <div className="col-span-4 lg:col-span-5">
                  <SwitchNotification color={color} />
                </div>
              </div>
            </div>

            <div className="container pb-6 m-auto">
              <Stats color={color} />
            </div>
          </section>
        </main>
        <Footer />
      </div>

      {showTooltip && (
        <PopUp setOpen={setShowTooltip}>
          <div className="p-4 sm:p-6 overflow-y-auto">
            <pre className="text-md text-gray-600 dark:text-gray-400">
              <code>{generatePaletteCode()}</code>
            </pre>
            <button
              className="relative mt-8 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-gray-300 text-white dark:text-black"
              onClick={copyPaletteCode}
            >
              {copySuccess ? (
                "Copied"
              ) : (
                <>
                  Copy Code <FaCopy />
                </>
              )}
            </button>
          </div>
        </PopUp>
      )}
    </>
  );
};
