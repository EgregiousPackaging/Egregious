import express, { Request, Response } from "express"

import routeHealthcheck from "./routes/healthcheck"

const badDb = new Map()

const app = express()

app.use(express.urlencoded({ extended: true }))

app.post("/api/report", (req: Request, res: Response) => {
  if (req.body.barcode === undefined) {
    res.status(400)
  }

  if (typeof req.body.barcode === "string") {
    const count = badDb.get(req.body.barcode) ?? 0
    badDb.set(req.body.barcode, count + 1)
  }

  res.json(Object.fromEntries(badDb)).status(200)
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

const port = process.env.PORT || 5000
app.listen(port, () => console.log("App is listening on port " + port))
