import axios from "axios"

const API_BASE = "/api"

export async function submitBarcode(barcode: string) {
  try {
    const resp = await axios({
      method: "POST",
      url: `${API_BASE}/report`,
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      data: `barcode=${barcode}`,
    })

    console.log(resp)
  } catch (e) {
    console.error(e)
  }
}
