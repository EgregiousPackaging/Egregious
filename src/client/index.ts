import Quagga, { QuaggaJSResultObject } from "@ericblade/quagga2"
import { submitBarcode } from "./lib/api"
import debounce from "./utils/debounce"

const debouncedSubmit = debounce(submitBarcode, 500)

async function processBarCode(result: QuaggaJSResultObject): Promise<void> {
  const barcode = result.codeResult.code
  console.log({ barcode })
  if (barcode) {
    await debouncedSubmit(barcode.toString())
    const result = document.getElementById("result") as HTMLParagraphElement
    result.textContent = `Scanned code: ${barcode.toString()}`
    document.getElementById("scanner")!.hidden = true
    document.getElementById("scanned")!.hidden = false
    Quagga.offProcessed(processBarCode)
    Quagga.offDetected(processBarCode)
    Quagga.stop()
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
      Quagga.start()
      Quagga.onDetected(processBarCode)
    }
  )
}

function startScanner() {
  document.getElementById("welcome")!.hidden = true
  document.getElementById("scanned")!.hidden = true
  document.getElementById("scanner")!.hidden = false
  // init every time because just calling quagga.stop() and then quagga.start()
  // would cause it to keep triggering on the previous barcode
  // todo: debug that
  quaggaSetup()
}

window.onload = function () {
  document.getElementById("scan")!.onclick = startScanner
  document.getElementById("scan-again")!.onclick = startScanner
}
