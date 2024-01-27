import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { getSpans, makeNodes, randomPositionWithinBounds } from "../controllers/nodemapController";
import * as nodemapController from "../controllers/nodemapController";
import fs from 'fs';

jest.mock('fs');

describe('getSpans', () => {
  it('should load spans from file', () => {
    const mockJson = [{ id: '1' }, { id: '2' }];
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockJson));

    const req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>> = {} as Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
    const res: Response<any, Record<string, any>> = { locals: {} } as Response<any, Record<string, any>>;
    const next = jest.fn();

    getSpans(req, res, next);

    expect(res.locals.spans).toEqual(mockJson);
    expect(next).toHaveBeenCalled();
  });
});

describe("nodemapController", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {
        width: ":1000",
        height: ":1000",
      },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
    } as unknown as Request<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >;

    res = {
      locals: {
        spans: [
          {
            attributes: {
              "service.name": "my.service",
            },
            name: "span1",
            spanId: "1",
            startTimeUnixNano: 1000,
            endTimeUnixNano: 2000,
          },
          {
            attributes: {
              "service.name": "my.service",
            },
            name: "span2",
            spanId: "2",
            parentSpanId: "1",
            startTimeUnixNano: 2000,
            endTimeUnixNano: 3000,
          },
        ],
      },
    } as unknown as Response<any, Record<string, any>>;

    next = jest.fn();
  });

  it("should create nodes for each unique span name", async () => {
    await makeNodes(req, res, next);

    expect(res.locals.data.nodes).toBeDefined();
    expect(res.locals.data.nodes.length).toBe(2);
    expect(res.locals.data.nodes[0].name).toBe("span1");
    expect(res.locals.data.nodes[1].name).toBe("span2");
  });

  it("should handle error from controller", async () => {
    const error = new Error("test error");
    const spy = jest.spyOn(nodemapController, "randomPositionWithinBounds");
    spy.mockImplementationOnce(() => {
      throw error;
    });
    try {
      makeNodes(req, res, next);
    } catch (er) {
      expect(er).toEqual(error);
    }

    expect(next).toHaveBeenCalledWith(error);
  });
});
