// @ts-nocheck
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";

const generateRandomNumber = (n) => {
  let number;
  const rand = Math.floor(Math.random() * 100);
  if (rand < 30) number = Math.floor(Math.random() * Math.pow(2, n >> 2 || 1));
  else if (rand < 60)
    number = Math.floor(Math.random() * Math.pow(2, n >> 1 || 1));
  else number = Math.floor(Math.random() * Math.pow(2, n));

  if (number <= 60) number = generateRandomNumber(n);

  return number;
};
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

          const types = {
            dec: "text",
            bin: "text",
            hex: "text",
          };

          const lengths = {
            dec: "5",
            bin: "16",
            hex: "4",
          };

          const attributes = {
            type: types[e],
            disabled: show,
            name: e,
            value: show ? convertedNumbers[e] : inputs[e],
            onKeyDown: handleKeyDown,
            required: true,
            maxlength: lengths[e],
          };

          return (
            <label key={e}>
              <span>{names[e]}</span>
              <input {...attributes} onChange={handleChange} />
            </label>
          );
        })}
        <label className="mobile">
          <input type="submit" value="Verificar" />
        </label>
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
      <span className="exp">
        (Enter en cualquier campo para verificar resultado)
      </span>
    </div>
  );
}

export default App;

// <p>Decimal: {number}</p>
// <p>Binary: {number.toString(2)}</p>
// <p>Hexadecimal: {number.toString(16)}</p>
