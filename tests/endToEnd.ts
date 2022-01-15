import { expect } from "chai"
import request from "supertest"
import { describe, it } from "mocha"
import sqlite3 from "sqlite3"

// requires docker-compose running with dev config
// sudo docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml up
// so that it can access the sqlite db to clean it between tests

beforeEach(async () => {
  await new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./egregiousdb/db.sqlite")
    db.exec("DELETE FROM barcodes", (err) => {
      if (err !== null) {
        reject(err)
      } else {
        resolve(db)
      }
    })
  })
})

describe("/api", function () {
  describe("/report", function () {
    it("should accept a barcode report", async function () {
      for (const count of [1, 2]) {
        const response = await request("http://localhost:5000")
          .post("/api/report")
          .send({ barcode: "9999999111112" })
          .set("Content-type", "application/x-www-form-urlencoded")
        expect(response.statusCode).to.eq(200)
        expect(response.body).deep.equal({
          count: count,
          manufacturer: {
            code: "9999999",
            count: count,
            email: "testrandomdog385@mailinator.com",
            name: "test",
            twitterHandle: "egregiousTest",
          },
        })
      }
    })
  })
  describe("/barcodes", function () {
    it("should fetch a barcode count", async function () {
      const response = await request("http://localhost:5000").get(
        "/api/barcodes/9999999111112"
      )
      expect(response.statusCode).to.eq(200)
      expect(response.body).deep.equal({
        barcode: "9999999111112",
        count: 0,
        manufacturer: {
          code: "9999999",
          count: 0,
          email: "testrandomdog385@mailinator.com",
          name: "test",
          twitterHandle: "egregiousTest",
        },
      })
    })
  })
  describe("/manufacturers", function () {
    it("should fetch a barcode count", async function () {
      const response = await request("http://localhost:5000").get(
        "/api/manufacturers/9999999"
      )
      expect(response.statusCode).to.eq(200)
      expect(response.body).deep.equal({
        code: "9999999",
        count: 0,
        email: "testrandomdog385@mailinator.com",
        name: "test",
        twitterHandle: "egregiousTest",
      })
    })
  })
})
