import express, { Request, Response } from "express"

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

app.use("/", express.static("dist/public"))

const port = process.env.PORT || 5000
app.listen(port, () => console.log("App is listening on port " + port))
