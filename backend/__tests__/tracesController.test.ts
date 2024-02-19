import { storeTraces } from '../controllers/tracesController';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

describe('storeTraces', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    next = jest.fn();
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => /* simulate successful read */);
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => /* simulate successful write */);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should store traces successfully', () => {
    const existingData = [{ id: 1, name: 'Trace 1' }];
    const newData = [{ id: 2, name: 'Trace 2' }];

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      Buffer.from(JSON.stringify(existingData))
    );
    jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {});

    req.body = {
      decodedData: {
        resourceSpans: [
          {
            scopeSpans: [
              {
                spans: newData
              }
            ]
          }
        ]
      }
    };

    storeTraces(req, res, next);

    expect(fs.readFileSync).toHaveBeenCalledWith('./../tracestore.json');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      './../tracestore.json',
      JSON.stringify([...existingData, ...newData], null, 2)
    );
    expect(next).toHaveBeenCalled();
  });

  it('should handle errors when reading from file', () => {
    const error = new Error('File read error');
    jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      throw error;
    });

    storeTraces(req, res, next);

    expect(fs.readFileSync).toHaveBeenCalledWith('./../tracestore.json');
    expect(console.error).toHaveBeenCalledWith(
      'Error reading from file:',
      error
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle errors when storing traces', () => {
    const existingData = [{ id: 1, name: 'Trace 1' }];
    const newData = [{ id: 2, name: 'Trace 2' }];
    const error = new Error('File write error');

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      Buffer.from(JSON.stringify(existingData))
    );
    jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {
      throw error;
    });

    req.body = {
      decodedData: {
        resourceSpans: [
          {
            scopeSpans: [
              {
                spans: newData
              }
            ]
          }
        ]
      }
    };

    const sendMock = jest.fn();
    res.status = jest.fn().mockReturnValueOnce({ send: sendMock });

    storeTraces(req, res, next);

    expect(fs.readFileSync).toHaveBeenCalledWith('./../tracestore.json');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      './../tracestore.json',
      JSON.stringify([...existingData, ...newData], null, 2)
    );
    expect(console.error).toHaveBeenCalledWith(
      'Error storing traces:',
      error
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(sendMock).toHaveBeenCalledWith('Error storing traces');
    expect(next).not.toHaveBeenCalled();
  });
});

