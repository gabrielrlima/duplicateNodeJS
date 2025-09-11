import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useAuthContext } from 'src/auth/hooks';
import axiosInstance, { endpoints } from 'src/lib/axios';

import { TerrenoDetailsView } from 'src/sections/terreno/view';

import type { ITerrenoItem } from 'src/types/terreno';

// ----------------------------------------------------------------------

const metadata = { title: `Detalhes do terreno | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const { user } = useAuthContext();
  const [terreno, setTerreno] = useState<ITerrenoItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerreno = async () => {
      if (!user || !id) {
        console.log('Missing requirements:', { hasUser: !!user, hasId: !!id });
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching terreno data for ID:', id);
        
        // First get the current real estate from localStorage
        const currentRealEstateStr = localStorage.getItem('currentRealEstate');
        if (!currentRealEstateStr) {
          console.error('No current real estate found in localStorage');
          return;
        }
        
        const currentRealEstate = JSON.parse(currentRealEstateStr);
        console.log('Current Real Estate:', currentRealEstate);
        
        // Fetch terrenos from the terreno API endpoint
        const response = await axiosInstance.get(`${endpoints.terreno.list}?real_estate_id=${currentRealEstate.id}`);
        const data = response.data;
        console.log('Terrenos API Response:', data);
        
        if (data.success && data.data?.terrenos) {
          const terrenos = data.data.terrenos;
          console.log('Terrenos found:', terrenos.length);
          
          // Find terreno by ID
          const foundTerreno = terrenos.find((t: any) => t.id === id);
          
          console.log('Final Terreno:', foundTerreno);

          if (foundTerreno) {
            // Transform API data to match ITerrenoItem interface
            const transformedTerreno: ITerrenoItem = {
              id: foundTerreno.id || id,
              codigo: foundTerreno.codigo || id.slice(-4).padStart(4, '0'),
              titulo: foundTerreno.name || 'Terreno',
              descricao: foundTerreno.description || '',
              area: foundTerreno.totalArea || foundTerreno.area || 0,
              preco: foundTerreno.value || foundTerreno.price || 0,
              precoM2: foundTerreno.pricePerSquareMeter || (foundTerreno.value && foundTerreno.totalArea ? foundTerreno.value / foundTerreno.totalArea : 0),
              status: foundTerreno.status || 'available',
              tipo: foundTerreno.tipo || 'residencial',
              negociavel: foundTerreno.negociavel || false,
              destaque: foundTerreno.destaque || false,
              observacoes: foundTerreno.observacoes,
              corretor: foundTerreno.corretor,
              createdAt: foundTerreno.createdAt || new Date().toISOString(),
              updatedAt: foundTerreno.updatedAt || new Date().toISOString(),
              localizacao: {
                endereco: foundTerreno.address?.street && foundTerreno.address?.number 
                  ? `${foundTerreno.address.street} ${foundTerreno.address.number}`.trim()
                  : foundTerreno.address?.street || '',
                bairro: foundTerreno.address?.neighborhood || '',
                cidade: foundTerreno.address?.city || '',
                estado: foundTerreno.address?.state || '',
                cep: foundTerreno.address?.zipCode || '',
                coordenadas: foundTerreno.coordinates
              },
              proprietario: {
                id: foundTerreno.owner?.id || foundTerreno.id || '',
                nome: foundTerreno.owner?.name || '',
                email: foundTerreno.owner?.email || '',
                telefone: foundTerreno.owner?.phone || '',
                documento: foundTerreno.owner?.document || '',
                avatarUrl: foundTerreno.owner?.avatarUrl || ''
              },
              caracteristicas: {
                area: foundTerreno.totalArea || foundTerreno.area || 0,
                topografia: foundTerreno.topography || '',
                formato: foundTerreno.dimensions || '',
                acesso: foundTerreno.access || '',
                documentacao: foundTerreno.documentation || ''
              },
              imagens: foundTerreno.images || [],
              dimensoes: foundTerreno.dimensoes,
              preco_negociavel: foundTerreno.preco_negociavel,
              itu_anual: foundTerreno.itu_anual
            };
            setTerreno(transformedTerreno);
          }
        }
      } catch (error) {
        console.error('Error fetching terreno:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerreno();
  }, [id, user?.token]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{metadata.title}</title>
        </Helmet>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Carregando...</h2>
          <p>ID sendo buscado: {id}</p>
          <p>Usuário autenticado: {user ? 'Sim' : 'Não'}</p>
          <p>Token disponível: {user ? 'Sim' : 'Não'}</p>
        </div>
      </>
    );
  }

  if (!terreno) {
    return (
      <>
        <Helmet>
          <title>{metadata.title}</title>
        </Helmet>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Terreno não encontrado</h2>
          <p>ID buscado: {id}</p>
          <p>Usuário: {user?.name || 'Não identificado'}</p>
          <p>Token: {user ? 'Disponível' : 'Não disponível'}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Tentar novamente
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <TerrenoDetailsView terreno={terreno} />
    </>
  );
}
