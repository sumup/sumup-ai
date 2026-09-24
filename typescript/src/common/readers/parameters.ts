import {
  getReaderResult as apiReader,
  listReadersResult as apiReaders,
  getReaderStatusResult as apiStatus,
} from "../generated/readers";

export * from "../generated/readers";

export const getReaderResult = apiReader
  .pick({
    id: true,
    name: true,
    status: true,
    device: true,
    created_at: true,
    updated_at: true,
  })
  .strip();
export const listReadersResult = apiReaders
  .pick({ items: true })
  .strip()
  .extend({
    items: getReaderResult.array(),
  });
export const getReaderStatusResult = apiStatus.strip();
