const ProductModel = require("../models/product.model.js");
const CustomError = require("../services/errors/custom-error.js");
const EErrors = require("../services/errors/enums.js");
const { generarInfoError } = require("../services/errors/info.js");
const constants = require("../utils/constants.js");
const validations = require("../utils/validations.js");

class ProductRepository {
    async agregarProducto(product) {
        //TO DO > AGREGAR OWNER
        const prod= {...product, stock: Number(product.stock), price: Number(product.price)}
        try {
            if (!validations.validatePropsOfProduct(prod, constants.PRODUCT_REQUIRED_FIELDS)) {
                throw new CustomError({
                    name: "Crear producto",
                    message: "Error al intentar crear un producto",
                    cause: generarInfoError(constants.PRODUCT_REQUIRED_FIELDS, prod),
                    code: EErrors.TIPO_INVALIDO
                })
            }
            const productWithCode = await ProductModel.findOne({ code: prod.code });
            if (productWithCode) {
                throw new CustomError({
                    name: "Crear producto",
                    message: "Error al intentar crear un producto",
                    cause: `El código ${prod.code} ya existe en otro producto`,
                    code: EErrors.PRODUCTO_CODIGO_REPETIDO
                })
            }
            const newProduct = new ProductModel({...prod, status:true});
            return await newProduct.save();
        } catch (e) {
            if (e instanceof Error) throw e
            else console.log(e)
        }
    }

    async obtenerProductos(limit = 10, page = 1, sort, query) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);
            
            const totalPages = Math.ceil(totalProducts / limit);
            
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            throw new Error("Error");
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const producto = await ProductModel.findById(id);

            if (!producto) {
                return null;
            }

            return producto;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async actualizarProducto(id, productoActualizado) {
        try {
            const actualizado = await ProductModel.findByIdAndUpdate(id, productoActualizado);
            if (!actualizado) {
                return null;
            }

            return actualizado;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async eliminarProducto(id) {
        try {
            const deleteado = await ProductModel.findByIdAndDelete(id);

            if (!deleteado) {
                return null;
            }

            return deleteado;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async crearMuchosProductos(productos){
        try {
            const result = await ProductModel.insertMany(productos);
            return result
        } catch (error) {
            console.log("error crearMuchosProductos", error)
            throw new Error("Error");
        }
    }
}

module.exports = ProductRepository;