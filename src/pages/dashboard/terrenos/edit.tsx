import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useAuthContext } from 'src/auth/hooks';
import axiosInstance, { endpoints } from 'src/lib/axios';

import { TerrenoEditView } from 'src/sections/terreno/view';

import type { ITerrenoItem } from 'src/types/terreno';

// ----------------------------------------------------------------------

const metadata = { title: `Terreno edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const { user } = useAuthContext();
  const [terreno, setTerreno] = useState<ITerrenoItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerreno = async () => {
      if (!id || !user) return;
      
      try {
        console.log('Fetching terreno data for edit, ID:', id);
        
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
        console.log('Terrenos API Response for edit:', data);
        
        if (data.success && data.data?.terrenos) {
          const terrenos = data.data.terrenos;
          console.log('Terrenos found for edit:', terrenos.length);
          
          // Find terreno by ID
          const foundTerreno = terrenos.find((t: any) => t.id === id);
          
          console.log('Final Terreno for edit:', foundTerreno);

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
              tipo: foundTerreno.type || 'residencial',
              negociavel: foundTerreno.negociavel || false,
              destaque: foundTerreno.destaque || false,
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
                acesso: foundTerreno.accessType || '',
                documentacao: foundTerreno.hasDocumentation ? 'sim' : 'não'
              },
              imagens: foundTerreno.images || []
            };
            setTerreno(transformedTerreno);
          }
        }
      } catch (error) {
        console.error('Error fetching terreno for edit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerreno();
  }, [id, user]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TerrenoEditView terreno={terreno} loading={loading} />
    </>
  );
}
