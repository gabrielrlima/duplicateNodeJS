import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();

/**
 * @route   POST /api/products
 * @desc    Criar um novo produto (imóvel, terreno ou empreendimento)
 * @access  Private
 */
router.post('/', ProductController.createProduct);

/**
 * @route   GET /api/products
 * @desc    Listar produtos com filtros e paginação
 * @access  Public
 * @query   {
 *   page?: number,
 *   limit?: number,
 *   type?: 'imovel' | 'terreno' | 'empreendimento',
 *   status?: 'available' | 'sold' | 'rented' | 'reserved' | 'inactive',
 *   condition?: string,
 *   city?: string,
 *   state?: string,
 *   neighborhood?: string,
 *   minValue?: number,
 *   maxValue?: number,
 *   minArea?: number,
 *   maxArea?: number,
 *   bedrooms?: number,
 *   bathrooms?: number,
 *   parkingSpaces?: number,
 *   furnished?: boolean,
 *   elevator?: boolean,
 *   acceptsFinancing?: boolean,
 *   hasDocumentation?: boolean,
 *   zoning?: 'residential' | 'commercial' | 'industrial' | 'mixed',
 *   waterAccess?: boolean,
 *   electricityAccess?: boolean,
 *   sewerAccess?: boolean,
 *   totalUnits?: number,
 *   constructionProgress?: number
 * }
 */
router.get('/', ProductController.getProducts);

/**
 * @route   GET /api/products/stats
 * @desc    Obter estatísticas de produtos
 * @access  Public
 */
router.get('/stats', ProductController.getProductStats);

/**
 * @route   GET /api/products/:id
 * @desc    Obter produto por ID
 * @access  Public
 */
router.get('/:id', ProductController.getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Atualizar produto
 * @access  Private
 */
router.put('/:id', ProductController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Deletar produto (soft delete)
 * @access  Private
 */
router.delete('/:id', ProductController.deleteProduct);

/**
 * @route   POST /api/products/:id/favorite
 * @desc    Adicionar produto aos favoritos
 * @access  Public
 */
router.post('/:id/favorite', ProductController.addToFavorites);

/**
 * @route   POST /api/products/:id/contact
 * @desc    Registrar contato com o produto
 * @access  Public
 */
router.post('/:id/contact', ProductController.incrementContacts);

// Rotas específicas por tipo para compatibilidade (opcional)
/**
 * @route   GET /api/products/imoveis
 * @desc    Listar apenas imóveis
 * @access  Public
 */
router.get('/imoveis', (req, res, next) => {
  req.query.type = 'imovel';
  ProductController.getProducts(req, res, next);
});

/**
 * @route   GET /api/products/terrenos
 * @desc    Listar apenas terrenos
 * @access  Public
 */
router.get('/terrenos', (req, res, next) => {
  req.query.type = 'terreno';
  ProductController.getProducts(req, res, next);
});

/**
 * @route   GET /api/products/empreendimentos
 * @desc    Listar apenas empreendimentos
 * @access  Public
 */
router.get('/empreendimentos', (req, res, next) => {
  req.query.type = 'empreendimento';
  ProductController.getProducts(req, res, next);
});

export default router;