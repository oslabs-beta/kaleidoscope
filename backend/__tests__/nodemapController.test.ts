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

  it('should handle file read errors', () => {
    const error = new Error('File read error');
    (fs.readFileSync as jest.Mock).mockImplementation(() => { throw error; });

    const req = {} as Request;
    const res = { locals: {} } as Response;
    const next = jest.fn();

    getSpans(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should handle JSON parse errors', () => {
    (fs.readFileSync as jest.Mock).mockReturnValue("invalid json");

    const req = {} as Request;
    const res = { locals: {} } as Response;
    const next = jest.fn();

    getSpans(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});

describe('makeNodes', () => {
  it('should handle invalid input gracefully', () => {
    const req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>> = {
      params: {
        width: ':invalid',
        height: ':invalid'
      }
    } as unknown as Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
    const res: unknown = { locals: { spans: [{ id: '1' }, { id: '2' }] } };
    const next = jest.fn();

    makeNodes(req, res as Response<any, Record<string, any>>, next);

    expect((res as Response<any, Record<string, any>>).locals.nodes).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should handle large datasets', () => {
    const largeDataset = Array(10000).fill(null).map((_, i) => ({ id: i.toString() }));
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(largeDataset));

    const req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>> = {} as Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
    const res: Response<any, Record<string, any>> = { locals: {} } as Response<any, Record<string, any>>;
    const next = jest.fn();

    getSpans(req, res, next);

    expect(res.locals.spans).toEqual(largeDataset);
    expect(next).toHaveBeenCalled();
  });

  it('should handle unusual node relationships', () => {
    const unusualNodes = [{ id: '1', links: ['2'] }, { id: '2', links: ['1', '3'] }, { id: '3', links: ['2'] }];
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(unusualNodes));

    const req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>> = {} as Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
    const res: Response<any, Record<string, any>> = { locals: {} } as Response<any, Record<string, any>>;
    const next = jest.fn();

    getSpans(req, res, next);

    expect(res.locals.spans).toEqual(unusualNodes);
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
