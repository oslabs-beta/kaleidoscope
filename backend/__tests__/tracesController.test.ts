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
  let mockReq, mockRes, mockNext;

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
    
  });
});
