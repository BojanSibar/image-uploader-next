import fs from "fs";

// users in JSON file for simplicity, store in a db for production applications
import imagesJson from "../../data/images.json";

export type ImageDB = {
  id: number;
  name: string;
  path: string;
  dateCreated: string;
};

export type CreateImageDB = {
  name: string;
  path: string;
};

let images = imagesJson as ImageDB[];

export const usersRepo = {
  getAll: () => images,
  getByPath: (id: string) => images.find((image) => image.path === id),
  search: (term: string) =>
    images.filter((x) => x.name.toLowerCase().includes(term.toLowerCase())),
  create,
  delete: _delete,
};

function create(image: CreateImageDB) {
  // generate new user id
  const imageToCreate = { ...image } as ImageDB;
  imageToCreate.id = images.length
    ? Math.max(...images.map((x) => x.id)) + 1
    : 1;

  // set date created
  imageToCreate.dateCreated = new Date().toISOString();

  // add and save user
  images.push(imageToCreate);
  saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(path: string) {
  // filter out deleted user and save
  images = images.filter((x) => x.path !== path);
  saveData();
}

// maintain JSON
function saveData() {
  fs.writeFileSync(
    process.cwd() + "/data" + "/images.json",
    JSON.stringify(images, null, 4)
  );
}
