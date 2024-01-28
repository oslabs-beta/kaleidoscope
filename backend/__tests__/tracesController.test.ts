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
      body: null,
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
      ((zlib.gunzip as unknown) as jest.Mock).mockImplementation((data, callback) => {
        callback(null, Buffer.from("decompressed data"));
      });

      decompressRequest(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(zlib.gunzip).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
