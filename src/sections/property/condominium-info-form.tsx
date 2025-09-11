import { z } from 'zod';
import React, { useState, useEffect } from 'react';

import Grid2 from '@mui/material/Grid2';
import {
  Box,
  Card,
  MenuItem,
  Checkbox,
  TextField,
  Typography,
  CardContent,
  FormControlLabel,
} from '@mui/material';

interface CondominiumInfoFormProps {
  onComplete: () => void;
}

// Schema de validação com Zod
const condominiumSchema = z.object({
  buildingName: z.string().optional(),
  buildYear: z.string().min(1, 'Ano de construção é obrigatório'),
});

// Tipo para os dados do formulário
type CondominiumFormData = z.infer<typeof condominiumSchema>;

const CondominiumInfoForm: React.FC<CondominiumInfoFormProps> = ({ onComplete }) => {
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<CondominiumFormData>({
    buildingName: '',
    buildYear: '2022',
  });

  // Estado para os checkboxes das comodidades do condomínio
  const [amenities, setAmenities] = useState<Record<string, boolean>>({
    playground: false,
    pool: false,
    barbecue: false,
    gym: false,
    partyRoom: false,
    laundry: false,
    gourmetSpace: false,
    elevator: false,
    reception24h: false,
    accessRamps: false,
    gameRoom: false,
    sportsCourt: false,
    sauna: false,
    playroom: false,
    handrail: false,
    accessibleParkingSpace: false,
    greenArea: false,
  });

  // Estado para os erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função para atualizar o estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para atualizar o estado dos checkboxes
  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAmenities((prev) => ({ ...prev, [name]: checked }));
  };

  // Validação em tempo real
  useEffect(() => {
    const result = condominiumSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          formattedErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(formattedErrors);
    } else {
      setErrors({});
    }
  }, [formData]);

  // Verificar se todos os campos obrigatórios são válidos
  const isFormValid = Object.keys(errors).length === 0 && formData.buildYear.trim() !== '';

  // Salvar dados no localStorage para persistência entre steps
  useEffect((): void => {
    const savedData = localStorage.getItem('condominiumFormData');
    const savedAmenities = localStorage.getItem('condominiumAmenities');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    if (savedAmenities) {
      setAmenities(JSON.parse(savedAmenities));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('condominiumFormData', JSON.stringify(formData));
    localStorage.setItem('condominiumAmenities', JSON.stringify(amenities));
  }, [formData, amenities]);

  // Permitir avançar apenas se o formulário for válido
  useEffect(() => {
    if (isFormValid) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && isFormValid) {
          onComplete();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFormValid, onComplete]);

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Sobre o condomínio
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Adicione informações sobre a infraestrutura do condomínio, como ano de construção, valor
            da taxa condominial e facilidades disponíveis.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              name="buildingName"
              label="Nome do prédio"
              placeholder="Ex: Edifício Solar"
              value={formData.buildingName}
              onChange={handleChange}
              error={!!errors.buildingName}
              helperText={errors.buildingName}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1 },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              select
              fullWidth
              name="buildYear"
              label="Em que ano o imóvel foi construído?"
              value={formData.buildYear}
              onChange={handleChange}
              error={!!errors.buildYear}
              helperText={errors.buildYear}
              SelectProps={{
                displayEmpty: true,
                IconComponent: () => (
                  <Box component="span" sx={{ position: 'absolute', right: 14 }}>
                    ▼
                  </Box>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1 },
              }}
            >
              <MenuItem value="2025">2025</MenuItem>
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2021">2021</MenuItem>
              <MenuItem value="2020">2020</MenuItem>
              <MenuItem value="2019">2019</MenuItem>
              <MenuItem value="2018">2018</MenuItem>
              <MenuItem value="2017">2017</MenuItem>
              <MenuItem value="2016">2016</MenuItem>
              <MenuItem value="2015">2015</MenuItem>
              <MenuItem value="2010-2014">2010-2014</MenuItem>
              <MenuItem value="2000-2009">2000-2009</MenuItem>
              <MenuItem value="1990-1999">1990-1999</MenuItem>
              <MenuItem value="Antes de 1990">Antes de 1990</MenuItem>
            </TextField>
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 2, mt: 2 }}>
            Sinalize as opções que o condomínio possui
          </Typography>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.playground}
                    onChange={handleAmenityChange}
                    name="playground"
                  />
                }
                label="Playground"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox checked={amenities.pool} onChange={handleAmenityChange} name="pool" />
                }
                label="Piscina"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.barbecue}
                    onChange={handleAmenityChange}
                    name="barbecue"
                  />
                }
                label="Churrasqueira"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox checked={amenities.gym} onChange={handleAmenityChange} name="gym" />
                }
                label="Academia"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.partyRoom}
                    onChange={handleAmenityChange}
                    name="partyRoom"
                  />
                }
                label="Salão de festas"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.laundry}
                    onChange={handleAmenityChange}
                    name="laundry"
                  />
                }
                label="Lavanderia no prédio"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.gourmetSpace}
                    onChange={handleAmenityChange}
                    name="gourmetSpace"
                  />
                }
                label="Espaço gourmet na área comum"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.elevator}
                    onChange={handleAmenityChange}
                    name="elevator"
                  />
                }
                label="Elevador"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.reception24h}
                    onChange={handleAmenityChange}
                    name="reception24h"
                  />
                }
                label="Portaria 24h"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.accessRamps}
                    onChange={handleAmenityChange}
                    name="accessRamps"
                  />
                }
                label="Rampas de acesso"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.gameRoom}
                    onChange={handleAmenityChange}
                    name="gameRoom"
                  />
                }
                label="Salão de jogos"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.sportsCourt}
                    onChange={handleAmenityChange}
                    name="sportsCourt"
                  />
                }
                label="Quadra esportiva"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox checked={amenities.sauna} onChange={handleAmenityChange} name="sauna" />
                }
                label="Sauna"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.playroom}
                    onChange={handleAmenityChange}
                    name="playroom"
                  />
                }
                label="Brinquedoteca"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.handrail}
                    onChange={handleAmenityChange}
                    name="handrail"
                  />
                }
                label="Corrimão"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.accessibleParkingSpace}
                    onChange={handleAmenityChange}
                    name="accessibleParkingSpace"
                  />
                }
                label="Vaga de garagem acessível"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.greenArea}
                    onChange={handleAmenityChange}
                    name="greenArea"
                  />
                }
                label="Área verde"
              />
            </Grid2>
          </Grid2>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CondominiumInfoForm;
