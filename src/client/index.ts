import Quagga, { QuaggaJSResultObject } from "@ericblade/quagga2"
import { submitBarcode } from "./lib/api"
import debounce from "./utils/debounce"

const debouncedSubmit = debounce(submitBarcode, 500)

async function processBarCode(result: QuaggaJSResultObject): Promise<void> {
  const barcode = result.codeResult.code
  console.log({ barcode })
  if (barcode) {
    return await debouncedSubmit(barcode.toString())
  }
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
