import Quagga from "@ericblade/quagga2"; // ES6

// navigator.mediaDevices.getUserMedia({ video: true }).then(start);

const submitButton = document.getElementById("submitButton");
const output = document.querySelector("div");
const input = document.getElementById("trackingNum");
const video = document.querySelector("#video");

window.codes = new Set();

submitButton.addEventListener("click", () => {
  // let appendNum = document.createElement("div");
  // appendNum.className = "numbers";
  // appendNum.innerHTML = input.value;
  // output.appendChild(appendNum);
  window.codes.add(input.value);
  input.value = "";
  updateList();
});

numList.addEventListener("click", function (event) {
  let span = event.target;

  if (span.nodeName === "SPAN") {
    let code = span.previousSibling.wholeText.trim();

    window.codes.delete(code);
    updateList();
  }
});

function updateList() {
  output.innerHTML = "";
  for (let code of window.codes) {
    output.innerHTML += `<div class="numbers">${code} <span class="delete">X</span></div>`;
  }
}

Quagga.init(
  {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: video, // Or '#yourElement' (optional)
    },
    decoder: {
      readers: ["code_128_reader"],
    },
  },
  function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
  }
);

Quagga.onDetected(function (data) {
  let code = data.codeResult.code;
  window.codes.add(code);
  updateList();
});

Quagga.onProcessed(function (result) {
  var drawingCtx = Quagga.canvas.ctx.overlay,
    drawingCanvas = Quagga.canvas.dom.overlay;

  if (result) {
    if (result.boxes) {
      drawingCtx.clearRect(
        0,
        0,
        parseInt(drawingCanvas.getAttribute("width")),
        parseInt(drawingCanvas.getAttribute("height"))
      );
      result.boxes
        .filter(function (box) {
          return box !== result.box;
        })
        .forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
            color: "green",
            lineWidth: 2,
          });
        });
    }

    if (result.box) {
      Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
        color: "#00F",
        lineWidth: 2,
      });
    }

    if (result.codeResult && result.codeResult.code) {
      Quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, drawingCtx, {
        color: "red",
        lineWidth: 3,
      });
    }
  }
});

// readers: [
//   "code_128_reader",
//   // "ean_reader",
//   // "ean_8_reader",
//   // "code_39_reader",
//   // "code_39_vin_reader",
//   // "codabar_reader",
//   "upc_reader",
//   // "upc_e_reader",
//   // "i2of5_reader",
//   // "2of5_reader",
//   // "code_93_reader",
// ],
