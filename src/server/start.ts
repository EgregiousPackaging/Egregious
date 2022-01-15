import express, { Request, Response } from "express"
import asyncHandler from "express-async-handler"

import { manufacturerMappings, Database, getManufacturer } from "./lessBadDb"
import routeHealthcheck from "./routes/healthcheck"

const app = express()

const database = new Database()

app.use(express.urlencoded({ extended: true }))

app.post(
  "/api/report",
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.barcode === undefined) {
      res.status(400).send("missing barcode")
    }

    if (typeof req.body.barcode === "string") {
      const barcode = req.body.barcode
      const result = await database.insert(barcode)
      res.json(result).status(200)
    } else {
      res.status(400)
    }
  })
)

app.get(
  "/api/barcodes/:barcode",
  asyncHandler(async (req: Request, res: Response) => {
    const count = await database.getBarcodeCount(req.params.barcode)
    const manufacturer = getManufacturer(req.params.barcode)
    if (manufacturer === undefined) {
      res
        .json({
          count,
          barcode: req.params.barcode,
        })
        .status(200)
    } else {
      const manufacturerCount = await database.getManufacturerCount(
        manufacturer.code
      )
      res
        .json({
          count,
          barcode: req.params.barcode,
          manufacturer: {
            ...manufacturer,
            count: manufacturerCount,
          },
        })
        .status(200)
    }
  })
)

app.get(
  "/api/manufacturers/:code",
  asyncHandler(async (req: Request, res: Response) => {
    const manufacturer = manufacturerMappings.get(req.params.code)
    const count = await database.getManufacturerCount(req.params.code)
    if (manufacturer) {
      res.json({ ...manufacturer, count }).status(200)
    } else {
      res.status(404)
    }
  })
)

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

const port = process.env.PORT || 5000
app.listen(port, () => console.log("App is listening on port " + port))
