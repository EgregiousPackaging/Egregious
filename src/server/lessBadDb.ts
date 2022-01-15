import sqlite3 from "sqlite3"

export class Database {
  db: Promise<sqlite3.Database>

  constructor() {
    this.db = new Promise((resolve, reject) => {
      const db = new sqlite3.Database("/mnt/egregiousdb/db.sqlite")
      // todo: if we make a manufacturer table, make manufacturer a foreign key
      // manufacturer is nullable to allow reporting of barcodes we don't know the manufacturer of
      db.exec(
        "CREATE TABLE IF NOT EXISTS barcodes(code TEXT PRIMARY KEY, manufacturer TEXT, count INTEGER DEFAULT 1)",
        (err) => {
          if (err !== null) {
            reject(err)
          } else {
            resolve(db)
          }
        }
      )
    })
  }

  async getBarcodeCount(barcode: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.then((db) =>
        db.get(
          "SELECT count FROM barcodes WHERE code = ?",
          barcode,
          (err?, row?: { count: number }) => {
            if (err !== null) {
              reject(err)
            } else if (row == undefined) {
              resolve(0)
            } else {
              resolve(row.count)
            }
          }
        )
      )
    })
  }

  async getManufacturerCount(manufacturerCode: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.then((db) =>
        db.get(
          "SELECT SUM(count) AS sum FROM barcodes WHERE manufacturer = ?",
          manufacturerCode,
          (err, row) => {
            if (err !== null) {
              reject(err)
            } else if (row.sum === null) {
              resolve(0)
            } else {
              resolve(row.sum)
            }
          }
        )
      )
    })
  }

  async run(query: string, ...args: any[]) {
    return new Promise((resolve, reject) => {
      this.db.then((db) =>
        db.run(query, ...args, (err?: Error, rows?: any[]) => {
          if (err !== null) {
            reject(err)
          } else {
            resolve(rows)
          }
        })
      )
    })
  }

  async insert(barcode: string): Promise<{
    count: number
    manufacturer?: ManufacturerForClient
  }> {
    const count = (await this.getBarcodeCount(barcode)) + 1

    const manufacturer = getManufacturer(barcode)

    if (count === 1) {
      await this.run(
        "INSERT INTO barcodes (code, manufacturer, count) VALUES (?, ?, ?)",
        barcode,
        manufacturer?.code ?? null,
        count
      )
    } else {
      await this.run("UPDATE barcodes SET count=? WHERE code=?", count, barcode)
    }

    if (manufacturer === undefined) {
      return {
        count,
      }
    } else {
      const manufacturerCount = await this.getManufacturerCount(
        manufacturer.code
      )

      return {
        count,
        manufacturer: {
          ...manufacturer,
          count: manufacturerCount,
        },
      }
    }
  }
}

interface ManufacturerForClient {
  count: number
  code: string
  name: string
  twitterHandle?: string
  email?: string
}

class Manufacturer {
  code: string
  name: string
  twitterHandle?: string
  email?: string

  constructor(
    code: string,
    name: string,
    twitterHandle?: string,
    email?: string
  ) {
    this.code = code
    this.name = name
    this.twitterHandle = twitterHandle
    this.email = email
  }
}

export const manufacturers = [
  new Manufacturer("5000169", "waitrose", "waitrose"),
  new Manufacturer("5010044", "warburtons", "Warburtons"),
  new Manufacturer("5449000", "coca-cola", "CocaCola"),
  new Manufacturer("5410316", "dageo scotland", "DiageoGB"),
  // https://www.complaintsdepartment.co.uk/tesco/
  new Manufacturer(
    "5031021",
    "tesco",
    "Tesco",
    "customer.services@tesco.co.uk"
  ),
  new Manufacturer("9002490", "red bull", "redbull"),
  new Manufacturer(
    "9999999",
    "test",
    // https://twitter.com/EgregiousTest
    "egregiousTest",
    // https://www.mailinator.com/v4/public/inboxes.jsp?to=testrandomdog385
    "testrandomdog385@mailinator.com"
  ),
]

export const manufacturerMappings = new Map(
  manufacturers.map((m) => [m.code, m])
)

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

export function fakeData(db: Database) {
  for (let i = 0; i < 100; i++) {
    const index = Math.floor(Math.random() * manufacturers.length)
    const manufacturer = manufacturers[index]

    const barcode = fakeEan13Barcode(manufacturer.code)
    const count = Math.random() * 10
    for (let currentCount = 0; currentCount < count; currentCount++) {
      db.insert(barcode)
    }
  }

  for (let i = 0; i < 100; i++) {
    const unknownManufacturerCode = "5009999"
    const barcode = fakeEan13Barcode(unknownManufacturerCode)
    db.insert(barcode)
  }
}
