import Quagga, { QuaggaJSResultObject } from "@ericblade/quagga2"
import { submitBarcode } from "./lib/api"
import debounce from "./utils/debounce"

const debouncedSubmit = debounce(submitBarcode, 500)

function createMailToLink(address: string, barcode: string) {
  const link = document.getElementById("mail-to-link") as HTMLLinkElement
  const subject = "Packaging complaint"
  const body = `Please use less packaging with product ${barcode}`
  link.href = `mailto:${address}?subject=${subject}&body=${body}`
}

function createTwitterLink(twitterAccount: string, barcode: string) {
  const link = document.getElementById("twitter-link") as HTMLLinkElement
  const text = `@${twitterAccount} please use less packaging with product ${barcode}`
  link.href = `https://twitter.com/intent/tweet?text=${text}`
}

async function processBarCode(result: QuaggaJSResultObject): Promise<void> {
  const barcode = result.codeResult.code
  console.log({ barcode })
  if (barcode) {
    await debouncedSubmit(barcode.toString())
    const result = document.getElementById("result") as HTMLParagraphElement
    result.textContent = `Scanned code: ${barcode.toString()}`
    // todo:  lookup address based on manufactor
    // https://www.mailinator.com/v4/public/inboxes.jsp?to=testrandomdog385
    createMailToLink("testrandomdog385@mailinator.com", barcode)
    // todo: look up account based on manufactor
    createTwitterLink("POTUS", barcode)
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
