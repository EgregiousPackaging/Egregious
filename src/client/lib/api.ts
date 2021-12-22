import axios from "axios"

const API_BASE = "/api"

type reportResponse = {
  count: number
  manufacturer: Manufacturer
}

// todo: share with backend
type Manufacturer = {
  code: string
  name: string
  twitterHandle?: string
  email?: string
}

export async function submitBarcode(
  barcode: string
): Promise<reportResponse | undefined> {
  const response = await axios({
    method: "POST",
    url: `${API_BASE}/report`,
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data: `barcode=${barcode}`,
  })
  if (response.status == 200) {
    return response.data as reportResponse
  }
}
