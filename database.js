import { createConnection } from "typeorm";

export const makeGlobalDatabase = async () => {
  const connection = await createConnection(process.env.NODE_ENV);
  const insert = async (repoName, params={}) => {
    const repo = connection.getRepository(repoName);
    const entity = await repo.save(params);
    return entity.id;
  }
  const find = async (repoName, findParams={}) => {
    const repo = connection.getRepository(repoName);
    const entities = await repo.find(findParams);
    return entities;
  }
  const deleteFunction = async (repoName, findParams={}) => {
    const repo = connection.getRepository(repoName);
    const deleteResult = await repo.delete(findParams);
    console.log(deleteResult);
    return deleteResult;
  }
  return {
    insert,
    find,
    delete: deleteFunction,
    close: connection.close,
  };
};
