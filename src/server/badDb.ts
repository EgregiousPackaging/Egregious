class Manufacturer {
  count: number
  code: string
  name: string

  constructor(code: string, name: string) {
    this.count = 0
    this.code = code
    this.name = name
  }
}

export const barcodes = new Map()

// todo: include email addresses and twitter accounts
export const manufacturers = [
  new Manufacturer("5000169", "waitrose"),
  new Manufacturer("5010044", "warburtons"),
  new Manufacturer("5449000", "coca-cola"),
  new Manufacturer("5410316", "dageo scotland"),
  new Manufacturer("5031021", "tesco"),
  new Manufacturer("9002490", "red bull"),
]

export let unknownManufacturer = 0

export const manufacturerMappings = new Map(
  manufacturers.map((m) => [m.code, m])
)

export function insert(barcode: string) {
  const manufacturer = getManufacturer(barcode)
  if (manufacturer) {
    manufacturer.count += 1
  } else {
    unknownManufacturer += 1
  }

  let count = barcodes.get(barcode) ?? 0
  count += 1
  barcodes.set(barcode, count)

  return {
    count,
    manufacturer,
  }
}

export function getManufacturer(barcode: string) {
  for (
    let manufacturerCodeLength = 1;
    manufacturerCodeLength < barcode.length;
    manufacturerCodeLength += 1
  ) {
    const manufacturer = manufacturerMappings.get(
      barcode.substr(0, manufacturerCodeLength)
    )
    if (manufacturer !== undefined) {
      return manufacturer
    }
  }
  return undefined
}

function fakeEan13Barcode(manufacturerCode: string): string {
  let completeCode = manufacturerCode
  const numbersToGenerate = 13 - manufacturerCode.length
  for (let n = 0; n < numbersToGenerate; n++) {
    completeCode += Math.floor(Math.random() * 10).toString()
  }
  return completeCode
}

export function fakeData() {
  for (let i = 0; i < 100; i++) {
    const index = Math.floor(Math.random() * manufacturers.length)
    const manufacturer = manufacturers[index]

    const barcode = fakeEan13Barcode(manufacturer.code)
    const count = Math.random() * 10
    for (let currentCount = 0; currentCount < count; currentCount++) {
      insert(barcode)
    }
  }

  for (let i = 0; i < 100; i++) {
    const unknownManufacturerCode = "5009999"
    const barcode = fakeEan13Barcode(unknownManufacturerCode)
    insert(barcode)
  }
}
