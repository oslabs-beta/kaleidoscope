import {
  storeTraces,
  decompressRequest,
  decodeTraceData,
} from "../controllers/tracesController";
import { generateProtobufData } from "./testHelpers"; 
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import zlib from "zlib";
import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";
import { EventEmitter } from "events";

describe("tracesController", () => {
  // New test case for decompressRequest function
  describe("decompressRequest", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
      req = {} as Request;
      res = {} as Response;
      next = jest.fn();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should proceed without decompression if content-encoding is not gzip", () => {
      req.headers = {
        "content-encoding": "deflate",
      };

      decompressRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it("should decompress data successfully", (done) => {
      const originalData = "original data";
      const compressedData = zlib.gzipSync(originalData);

      const req = new EventEmitter() as unknown as Request;
      req.headers = { "content-encoding": "gzip" };

      const res = {} as Response;
      const next = jest.fn().mockImplementation(() => {
        expect(req.body.toString()).toBe(originalData);
        expect(next).toHaveBeenCalled();
        done();
      });

      decompressRequest(req, res, next);

      req.emit("data", compressedData);
      req.emit("end");
    });
  });
});

it("should decode trace data successfully", async () => {
  const protobufData = await generateProtobufData(); // generate the protobuf data

  const req = {
    body: protobufData, // use the protobuf data
  } as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  await decodeTraceData(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(req.body.decodedData).toBeDefined();
});

it("should handle error when decoding trace data", async () => {
  const req = {} as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  req.body = Buffer.from("invalid data");

  await decodeTraceData(req, res, next);

  expect(console.error).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith("Error decoding trace data");
});
