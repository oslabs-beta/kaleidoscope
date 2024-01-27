import { Request, Response } from "express";
import annotationModel from "../models/annotationModel";
import {
  getAnnotationById,
  getAnnotations,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
} from "../controllers/annotationController";

jest.mock("../models/annotationModel");

describe("getAnnotationById", () => {
  it("should return 404 if annotation not found", async () => {
    const req = {
      params: {
        id: "1",
      },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      sendStatus: jest.fn(),
      json: jest.fn()
    } as any;

    (annotationModel.getAnnotationById as jest.Mock).mockResolvedValueOnce(
      null
    );

    await getAnnotationById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 500 on error", async () => {
    const req = {
      params: {
        id: "1",
      },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    (annotationModel.getAnnotationById as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to get annotation")
    );

    await getAnnotationById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to fetch annotation",
    });
  });

  it("should return 200 and annotation data on success", async () => {
    const req = {
      params: {
        id: "1",
      },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const expectedAnnotation = {
      id: 1,
      text: "Test annotation",
    };

    (annotationModel.getAnnotationById as jest.Mock).mockResolvedValueOnce(
      expectedAnnotation
    );

    await getAnnotationById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedAnnotation);
  });
});

describe("getAnnotations", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response<any, Record<string, any>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch annotations and return 200 status code", async () => {
    const mockAnnotations = [
      { id: 1, text: "Annotation 1" },
      { id: 2, text: "Annotation 2" },
    ];
    (annotationModel.getAllAnnotations as jest.Mock).mockResolvedValueOnce(
      mockAnnotations
    );

    await getAnnotations(req, res);

    expect(annotationModel.getAllAnnotations).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAnnotations);
  });

  it("should return 500 status code if fetching annotations fails", async () => {
    const errorMessage = "Failed to fetch annotations.";
    (annotationModel.getAllAnnotations as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await getAnnotations(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});

describe("updateAnnotation", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: { id: "1" },
      body: {
        /* provide the necessary request body here */
      },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as Response<any, Record<string, any>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update the annotation and return 204 status code", async () => {
    (annotationModel.updateAnnotation as jest.Mock).mockResolvedValueOnce(undefined);
    await updateAnnotation(req, res);

    expect(annotationModel.updateAnnotation).toHaveBeenCalledWith(1, req.body);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it("should return 400 status code if ID is not a number", async () => {
    req.params.id = "invalid";

    await updateAnnotation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Invalid ID format");
  });

  it("should return 500 status code if updating the annotation fails", async () => {
    const errorMessage = "Failed to update annotation.";
    (annotationModel.updateAnnotation as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await updateAnnotation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});

describe("createAnnotation", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        /* provide the necessary request body here */
      },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response<any, Record<string, any>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new annotation and return 201 status code", async () => {
    const mockNewAnnotationId = 1;
    (annotationModel.addAnnotation as jest.Mock).mockResolvedValueOnce(
      mockNewAnnotationId
    );

    await createAnnotation(req, res);

    expect(annotationModel.addAnnotation).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: mockNewAnnotationId });
  });

  it("should return 500 status code if creating the annotation fails", async () => {
    const errorMessage = "Failed to create annotation.";
    (annotationModel.addAnnotation as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await createAnnotation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});

describe("deleteAnnotation", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: { id: "1" },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as Response<any, Record<string, any>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete the annotation and return 204 status code", async () => {
    (annotationModel.deleteAnnotation as jest.Mock).mockResolvedValueOnce(undefined);
    await deleteAnnotation(req, res);

    expect(annotationModel.deleteAnnotation).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it("should return 400 status code if ID is not a number", async () => {
    req.params.id = "invalid";

    await deleteAnnotation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Invalid ID format");
  });

  it("should return 500 status code if deleting the annotation fails", async () => {
    const errorMessage = "Failed to delete annotation.";
    (annotationModel.deleteAnnotation as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await deleteAnnotation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});