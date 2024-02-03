// @ts-nocheck
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";

const generateRandomNumber = (n) => Math.floor(Math.random() * Math.pow(2, n));
const generateRandomIndex = (n) => Math.floor(Math.random() * n);
const initialInputs = { dec: "", bin: "", hex: "" };

const names = {
  dec: "Decimal",
  bin: "Binario",
  hex: "Hexadecimal",
};

function App() {
  const [inputs, setInputs] = useState(initialInputs);
  const [points, setPoints] = useState([0, 0]);

  const [number, setNumber] = useState(generateRandomNumber(16));

  const fields = useRef(["dec", "bin", "hex"]);
  const [shownNumber, setShownNumber] = useState(generateRandomIndex(3));

  useEffect(() => {
    setInputs((prev) => {
      const n = [number, number.toString(2), number.toString(16)];

      return {
        ...prev,
        [fields.current[shownNumber]]: n[shownNumber],
      };
    });
  }, [number]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleKeyDown = (e) => {
    const keyCode = e.keyCode || e.which;
    const name = e.target.name;

    const allowedInAll = {
      13: 1,
      16: 1,
      17: 1,
      37: 1,
      // 38: 1,
      39: 1,
      // 40: 1,
      48: 1,
      49: 1,
      8: 1,
      9: 1,
    };

    const dec = {
      ...allowedInAll,
      50: 1,
      51: 1,
      52: 1,
      53: 1,
      54: 1,
      55: 1,
      56: 1,
      57: 1,
    };

    const hex = {
      ...dec,
      65: 1,
      66: 1,
      67: 1,
      68: 1,
      69: 1,
      70: 1,
      71: 1,
      72: 1,
      73: 1,
      74: 1,
      75: 1,
      76: 1,
      77: 1,
      78: 1,
      79: 1,
      80: 1,
      81: 1,
      82: 1,
      83: 1,
      84: 1,
      85: 1,
      86: 1,
      87: 1,
      88: 1,
      89: 1,
      90: 1,
    };

    const allowed = {
      dec: { ...dec },
      hex: { ...hex },
      bin: { ...allowedInAll },
    };

    // key code 48 = 0
    // key code 49 = 1
    if (!allowed[name][keyCode]) {
      // If not 0 or 1, prevent to continue
      e.preventDefault();
    }
  };

  const resetInputs = () => setInputs(initialInputs);

  const handleSubmit = (e) => {
    e.preventDefault();
    let { dec, bin, hex } = inputs;
    bin = parseInt(bin, 2);
    hex = parseInt(hex, 16);
    const a = new Set();
    a.add(+dec).add(bin).add(hex);
    if (a.size === 1) {
      resetInputs();
      setNumber(generateRandomNumber(16));
      setShownNumber(generateRandomIndex(3));
      setPoints((prev) => [prev[0] + 1, prev[1]]);
      document.activeElement.blur();
      document.querySelector("input").focus();
      toast.success("👍️");
    } else {
      setPoints((prev) => [prev[0], prev[1] + 1]);
      toast.error("👎️");
    }
  };

  return (
    <div>
      <Toaster />
      <form onSubmit={handleSubmit}>
        {fields.current.map((e, i) => {
          const show = i === shownNumber ? true : false;
          const convertedNumbers = {
            dec: number,
            bin: number.toString(2),
            hex: number.toString(16),
          };

          const attributes = {
            type: e === "hex" ? "text" : "number",
            disabled: show,
            name: e,
            value: show ? convertedNumbers[e] : inputs[e],
            onKeyDown: handleKeyDown,
          };

          return (
            <label key={e}>
              <span>{names[e]}</span>
              <input {...attributes} onChange={handleChange} />
            </label>
          );
        })}
        <input type="submit" value="go" />
      </form>
      <div className="points">
        <p>
          ✅ {points[0]} ❌ {points[1]}
        </p>
        <p>( {~~((points[0] / (points[0] + points[1])) * 100)}% )</p>
      </div>
      <a
        href="https://github.com/LeFede/coc-taller-conversiones"
        target="_blank"
        rel="noreferrer"
      >
        <img
          className="gh"
          src="https://cdn-icons-png.flaticon.com/128/270/270798.png"
        />
      </a>
    </div>
  );
}

export default App;

// <p>Decimal: {number}</p>
// <p>Binary: {number.toString(2)}</p>
// <p>Hexadecimal: {number.toString(16)}</p>
