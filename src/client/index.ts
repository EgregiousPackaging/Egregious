import Quagga, { QuaggaJSResultObject } from "@ericblade/quagga2"

function processBarCode(result: QuaggaJSResultObject): void {
  const barcode = result.codeResult.code
  console.log(barcode)
}

function quaggaSetup(): void {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.getElementById("scanner")!,
      },
      decoder: {
        readers: ["ean_reader"],
      },
    },
    function (err) {
      if (err) {
        console.log(err)
        return
      }
      console.log("Initialization finished. Ready to start")
      Quagga.onDetected(processBarCode)
      Quagga.start()
    }
  )
}

window.onload = function () {
  quaggaSetup()
}
