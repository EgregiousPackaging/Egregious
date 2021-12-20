import express, { Request, Response } from "express"
import {
  barcodes,
  fakeData,
  insert,
  manufacturerMappings,
  manufacturers,
  unknownManufacturer,
} from "./badDb"

import routeHealthcheck from "./routes/healthcheck"

const app = express()

app.use(express.urlencoded({ extended: true }))

app.post("/api/report", (req: Request, res: Response) => {
  if (req.body.barcode === undefined) {
    res.status(400)
  }

  if (typeof req.body.barcode === "string") {
    const barcode = req.body.barcode

    const result = insert(barcode)
    res.json(result).status(200)
  } else {
    res.status(400)
  }
})

app.get("/api/barcodes", (req: Request, res: Response) => {
  return res.json(Object.fromEntries(barcodes)).status(200)
})

app.get("/api/barcodes/:barcode", (req: Request, res: Response) => {
  const count = barcodes.get(req.params.barcode)
  if (count) {
    return res.json({ barcode: req.params.barcode, count }).status(200)
  } else {
    res.status(400)
  }
})

app.get("/api/manufacturers", (req: Request, res: Response) => {
  return res
    .json({
      manufacturers,
      unknownManufacturer,
    })
    .status(200)
})

app.get("/api/manufacturers/:id", (req: Request, res: Response) => {
  const manufacturer = manufacturerMappings.get(req.params.id)

  if (manufacturer) {
    return res.json(manufacturer).status(200)
  } else {
    res.status(400)
  }
})

// @TODO: There's funky things we can do to gracefully drain connections, but that's way out of
// scope for now.
process.on("SIGINT", () => {
  console.log("Received SIGINT, terminating semi-gracefully.")
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, terminating semi-gracefully.")
  process.exit(0)
})

app.use("/", express.static("dist/public"))
app.use("/healthcheck", routeHealthcheck)

fakeData()
const port = process.env.PORT || 5000
app.listen(port, () => console.log("App is listening on port " + port))
