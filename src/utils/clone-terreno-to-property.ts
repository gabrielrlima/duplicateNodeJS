// Utility functions for cloning terreno data to property data

// ----------------------------------------------------------------------

/**
 * Clona os detalhes de um terreno e os adapta para criar um novo imóvel
 * @param terreno - Dados do terreno a ser clonado
 * @param propertyType - Tipo do imóvel a ser criado (opcional, padrão: 'Apartamento')
 * @returns Dados do imóvel baseados no terreno
 */
export function cloneTerrenoToProperty(terreno: any, propertyType: string = 'Apartamento'): any {
  // Gerar código único para o imóvel baseado no terreno
  const propertyCode = terreno.codigo.replace('TER-', 'PROP-');

  // Adaptar título do terreno para imóvel
  const propertyTitle = terreno.titulo
    .replace(/terreno/gi, propertyType)
    .replace(/lote/gi, propertyType)
    .replace(/área/gi, propertyType);

  // Calcular valores estimados para o imóvel baseado no terreno
  const estimatedPropertyPrice = Math.round(terreno.preco * 1.5); // Imóvel vale ~50% mais que o terreno
  const estimatedRentPrice = Math.round(estimatedPropertyPrice * 0.006); // ~0.6% do valor para aluguel

  // Definir características padrão baseadas no tipo de imóvel
  const getDefaultCharacteristics = (type: string) => {
    const defaults = {
      Apartamento: {
        bedrooms: 2,
        bathrooms: 1,
        suites: 1,
        parkingSpaces: 1,
        floor: '5º andar',
        elevator: true,
        furnished: false,
      },
      Casa: {
        bedrooms: 3,
        bathrooms: 2,
        suites: 1,
        parkingSpaces: 2,
        floor: 'Térreo',
        elevator: false,
        furnished: false,
      },
      Sobrado: {
        bedrooms: 3,
        bathrooms: 3,
        suites: 2,
        parkingSpaces: 2,
        floor: '2 pavimentos',
        elevator: false,
        furnished: false,
      },
      Studio: {
        bedrooms: 1,
        bathrooms: 1,
        suites: 0,
        parkingSpaces: 1,
        floor: '3º andar',
        elevator: true,
        furnished: true,
      },
    };

    return defaults[type as keyof typeof defaults] || defaults['Apartamento'];
  };

  const characteristics = getDefaultCharacteristics(propertyType);

  // Adaptar amenidades baseadas no tipo de terreno
  const getAmenitiesFromTerrenoType = (tipo: string) => {
    const amenitiesMap = {
      residencial: {
        varanda: true,
        jardim: true,
        churrasqueira: true,
        arCondicionado: true,
        lavanderia: true,
      },
      comercial: {
        recepcao24h: true,
        rampasAcesso: true,
        vagaDeficiente: true,
        arCondicionado: true,
      },
      industrial: {
        rampasAcesso: true,
        vagaDeficiente: true,
        areaVerde: false,
      },
      rural: {
        jardim: true,
        areaVerde: true,
        churrasqueira: true,
        espacoGourmet: true,
      },
    };

    return amenitiesMap[tipo as keyof typeof amenitiesMap] || amenitiesMap['residencial'];
  };

  const amenities = getAmenitiesFromTerrenoType(terreno.tipo);

  // Calcular área construída baseada na área do terreno
  const constructedArea = Math.round(terreno.area * 0.6); // ~60% da área do terreno

  return {
    id: `prop-${Date.now()}`, // ID único
    codigo: propertyCode,
    title: propertyTitle,
    description: `${propertyType} construído em ${terreno.descricao.toLowerCase()}. Excelente oportunidade de investimento com localização privilegiada.`,

    // Tipo e condição
    type: propertyType,
    condition: 'Novo',

    // Áreas
    area: constructedArea,
    totalArea: terreno.area, // Área total do terreno

    // Características físicas
    ...characteristics,

    // Valores financeiros
    salePrice: estimatedPropertyPrice,
    rentPrice: estimatedRentPrice,
    condominiumFee: Math.round(Math.random() * 500) + 200,
    itu: Math.round(terreno.preco * 0.01), // ~1% do valor do terreno
    totalCost: estimatedRentPrice + Math.round(Math.random() * 500) + 200,

    // Localização (clonar do terreno)
    address: terreno.localizacao.endereco,
    neighborhood: terreno.localizacao.bairro,
    city: terreno.localizacao.cidade,
    state: terreno.localizacao.estado,
    zipCode: terreno.localizacao.cep,
    coordinates: terreno.localizacao.coordenadas,

    // Proprietário (clonar do terreno)
    owner: {
      name: terreno.proprietario.nome,
      email: terreno.proprietario.email,
      phone: terreno.proprietario.telefone,
      avatarUrl: terreno.proprietario.avatarUrl,
      document: terreno.proprietario.documento,
    },

    // Amenidades
    amenities,

    // Status e configurações
    status: 'available',
    featured: terreno.destaque,
    negotiable: terreno.negociavel,

    // Imagens (usar as mesmas do terreno como base)
    images: terreno.imagens,

    // Datas
    createdAt: new Date(),
    updatedAt: new Date(),

    // Observações adaptadas
    observations: terreno.observacoes
      ? terreno.observacoes.replace(/terreno/gi, propertyType.toLowerCase())
      : `${propertyType} com excelente localização e potencial de valorização.`,
  };
}

/**
 * Preenche um formulário de imóvel com dados clonados de um terreno
 * @param terreno - Dados do terreno
 * @param propertyType - Tipo do imóvel
 * @returns Dados formatados para o formulário
 */
export function fillPropertyFormFromTerreno(terreno: any, propertyType: string = 'Apartamento') {
  const propertyData = cloneTerrenoToProperty(terreno, propertyType);

  // Formato específico para o formulário PropertyInfoForm
  return {
    // Informações básicas obrigatórias
    condition: propertyData.condition || 'Novo',
    type: propertyData.type || propertyType,
    size: propertyData.area || 50,
    rooms: propertyData.bedrooms || 2,
    bathrooms: propertyData.bathrooms || 1,

    // Informações opcionais
    suites: propertyData.suites || 0,
    parkingSpaces: propertyData.parkingSpaces || 1,
    floor: propertyData.floor || '',
    description: propertyData.description || '',

    // Principais comodidades
    balcony: propertyData.amenities?.varanda || false,
    barbecue: propertyData.amenities?.churrasqueira || false,
    privatePool: propertyData.amenities?.piscina || false,
    airConditioner: propertyData.amenities?.arCondicionado || false,
    americanKitchen: propertyData.amenities?.cozinhaAmericana || false,
    garden: propertyData.amenities?.jardim || false,
  };
}

/**
 * Lista de terrenos disponíveis para clonagem
 * @param terrenos - Array de terrenos
 * @returns Lista formatada para seleção
 */
export function getTerrenosForCloning(terrenos: any[]) {
  return terrenos
    .filter((terreno) => terreno.status === 'available') // Apenas terrenos disponíveis
    .map((terreno) => ({
      id: terreno.id,
      codigo: terreno.codigo,
      titulo: terreno.titulo,
      area: terreno.area,
      preco: terreno.preco,
      localizacao: `${terreno.localizacao.bairro}, ${terreno.localizacao.cidade}`,
      proprietario: terreno.proprietario.nome,
    }));
}
