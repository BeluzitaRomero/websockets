const fs = require("fs").promises;

class Container {
  constructor(file) {
    this.file = file;
  }

  async getAll() {
    try {
      const allProducts = await fs.readFile(this.file, "utf-8");
      return JSON.parse(allProducts);
    } catch (err) {
      console.log("No hay productos");
      return null;
    }
  }

  async save(product) {
    const arrayProducts = await this.getAll();

    if (!arrayProducts) {
      await fs.writeFile(this.file, "[]");
      return "asignando espacio para almacenamiento";
    }
    if (arrayProducts.length === 0) {
      product.id = 1;
      arrayProducts.push(product);
      await fs.writeFile(this.file, JSON.stringify(arrayProducts));
      return product;
    }
    let id = arrayProducts.map((p) => p.id);
    let maxId = Math.max(...id);
    const saveProduct = { ...product, id: maxId + 1 };
    await arrayProducts.push(saveProduct);
    await fs.writeFile(this.file, JSON.stringify(arrayProducts));
    return saveProduct;
  }

  async getById(number) {
    let showId = await this.getAll();
    if (!showId) return { error: "Producto no encontrado" };
    let objectSelected = showId.find((obj) => obj.id === Number(number));
    return objectSelected
      ? objectSelected
      : { error: "Producto no encontrado" };
  }

  async deleteById(id) {
    const arrayProducts = await this.getAll();
    if (!arrayProducts) return;
    const isIn = arrayProducts.find((prod) => prod.id === Number(id));
    if (isIn) {
      const updateArray = arrayProducts.filter((obj) => obj.id != id);
      await fs.writeFile(this.file, JSON.stringify(updateArray));
      return { data: "Producto eliminado" };
    } else {
      return { data: "No existe el producto que desea eliminar" };
    }
  }

  async deleteAll() {
    await fs.writeFile(this.file, "[]");
  }

  async updateProduct(product, id) {
    const arr = await this.getAll();
    const index = arr.findIndex((p) => {
      return p.id == id;
    });

    if (index >= 0) {
      arr[index].title = product.title;
      arr[index].price = product.price;
      arr[index].thumbnail = product.thumbnail;

      await fs.writeFile(this.file, JSON.stringify(arr));
      return { data: "Producto actualizado" };
    } else {
      return { data: "No se pudo actualizar" };
    }
  }

  async addProduct(product) {
    const arr = await this.getAll();
    arr.push(product);
    await fs.writeFile(this.file, JSON.stringify(arr));
    return { data: "Producto agregado" };
  }
}

module.exports = Container;
