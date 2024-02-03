import {
  decompressRequest,
  decodeTraceData,
  printTraces,
  storeTraces,
} from "../controllers/tracesController";
import fs from "fs";
import zlib from "zlib";
import * as protobuf from "protobufjs";
import { Request, Response, NextFunction } from "express";

jest.mock("fs");
jest.mock("zlib");
jest.mock("protobufjs");

describe("tracesController", () => {
  let mockReq: any, mockRes: any, mockNext: any;

  beforeEach(() => {
    mockReq = {
      headers: {},
      on: jest.fn((event, callback) => {
        if (event === "data") {
          callback(Buffer.from("compressed data"));
        } else if (event === "end") {
          callback();
        }
      }),
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });
  describe("decompressRequest", () => {
    it("should handle non-gzip encoding", () => {
      (mockReq as Request).headers["content-encoding"] = "deflate";
      decompressRequest(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );
      expect(mockNext).toHaveBeenCalled();
    });
    it("should decompress gzip encoded data", () => {
      mockReq.headers["content-encoding"] = "gzip";
      (zlib.gunzip as unknown as jest.Mock).mockImplementation(
        (data, callback) => {
          callback(null, Buffer.from("decompressed data"));
        }
      );

      decompressRequest(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(zlib.gunzip).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
    // Add more tests for error handling, etc.
    it("should handle decompression errors", () => {
      mockReq.headers["content-encoding"] = "gzip";
      (zlib.gunzip as unknown as jest.Mock).mockImplementationOnce((data, callback) => {
        callback(new Error("Decompression failed"));
      });

      decompressRequest(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith("Error decompressing data");
    });
  });

  describe("decodeTraceData", () => {
    // Mock protobufjs and test decodeTraceData functionality
    // Add your tests here
    it("should decode trace data", async () => {
      const mockRoot = {
        lookupType: jest.fn().mockReturnValue({
          decode: jest.fn().mockReturnValue({}),
          toObject: jest.fn().mockReturnValue({}),
        }),
      };
      (protobuf.load as jest.Mock).mockResolvedValueOnce(mockRoot);

      await decodeTraceData(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockRoot.lookupType).toHaveBeenCalledWith(
        "opentelemetry.proto.trace.v1.TracesData"
      );
      expect(mockNext).toHaveBeenCalled();
    })

    it("should handle decoding errors", async () => {
      (protobuf.load as jest.Mock).mockRejectedValueOnce(new Error("Decoding failed"));

      await decodeTraceData(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith("Error decoding trace data");
    });


  });

  describe("printTraces", () => {
    // Test printTraces functionality
    // Add your tests here
    it("should print traces", async () => { 
      mockReq.body = { decodedData: { resourceSpans: [] } };
      await printTraces(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("storeTraces", () => {
    it("should store traces successfully", () => {
      fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify([]));
      fs.writeFileSync = jest.fn();

      mockReq.body = { decodedData: { resourceSpans: [] } };
      storeTraces(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    // Add more tests for error handling, different data cases, etc.
  });
});
