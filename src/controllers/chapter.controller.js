const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const chapterService = require('../services/chapter.service');

const createChapter = asyncHandler(async (req, res) => {
  const chapter = await chapterService.createChapter(req.body);
  return res.status(201).json(new ApiResponse(201, 'Chapter created', chapter));
});

const listChapters = asyncHandler(async (req, res) => {
  const chapters = await chapterService.listChapters(req.params.courseId);
  return res.status(200).json(new ApiResponse(200, 'Chapters fetched', chapters));
});

const updateChapter = asyncHandler(async (req, res) => {
  const chapter = await chapterService.updateChapter(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, 'Chapter updated', chapter));
});

const deleteChapter = asyncHandler(async (req, res) => {
  await chapterService.deleteChapter(req.params.id);
  return res.status(204).send();
});

module.exports = {
  createChapter,
  listChapters,
  updateChapter,
  deleteChapter,
};

