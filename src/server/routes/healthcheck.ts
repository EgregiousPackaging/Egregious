import express from "express"

const router = express.Router()

router.get("/", (req, res) => {
  // @TODO: Healthcheck could do more
  res.status(200).send({ message: "OK!" })
})

export default router
