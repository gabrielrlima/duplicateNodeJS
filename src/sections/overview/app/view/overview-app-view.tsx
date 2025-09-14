import Grid from '@mui/material/Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { _mock, _salesFunnelData, _ecommerceBestSalesman } from 'src/_mock';
import { useGetProperties, useGetPropertyStats } from 'src/actions/property';

import { AppTopRelated } from '../app-top-related';
import { LatestSales } from '../../e-commerce/latest-sales';
import { EcommerceYearlySales } from '../../e-commerce/ecommerce-yearly-sales';
import { EcommerceBestSalesman } from '../../e-commerce/ecommerce-best-salesman';
import { EcommerceSaleByGender } from '../../e-commerce/ecommerce-sale-by-gender';
import { EcommerceWidgetSummary } from '../../e-commerce/ecommerce-widget-summary';
import { EcommerceSalesOverview } from '../../e-commerce/ecommerce-sales-overview';
import { BankingBalanceStatistics } from '../../banking/banking-balance-statistics';
import { EcommerceCurrentBalance } from '../../e-commerce/ecommerce-current-balance';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  // const { user } = useMockedUser();

  // const theme = useTheme();

  // Buscar estatísticas reais
  const { propertyStats, propertyStatsLoading, propertyStatsError } = useGetPropertyStats();
  const { properties } = useGetProperties();
  // Calcular total de imóveis cadastrados usando os dados disponíveis
  const totalImoveis = propertyStats?.totalProperties || 0;

  const _ecommerceSalesOverview = ['Total de vendas', 'Total de alugueis'].map((label, index) => ({
    label,
    totalAmount: _mock.number.price(index) * 100,
    value: _mock.number.percent(index),
  }));

  //apenas mock, é pra vir do back
  const mesesEmPortugues = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const nomeDoMesAtual = mesesEmPortugues[mesAtual];

  // Mock data for latest sales
  const _latestSales = [
    {
      id: '1',
      name: 'Lake House 1702',
      date: 'Hoje',
      price: 'R$ 495.000,00',
      agent: 'Jayvion Simon',
      coverUrl: '/placeholder.svg?height=80&width=80',
    },
    {
      id: '2',
      name: 'Lake House 1702',
      date: 'Ontem',
      price: 'R$ 495.000,00',
      agent: 'Jayvion Simon',
      coverUrl: '/placeholder.svg?height=80&width=80',
    },
    {
      id: '3',
      name: 'Lake House 1702',
      date: '09 de Mar',
      price: 'R$ 495.000,00',
      agent: 'Jayvion Simon',
      coverUrl: '/placeholder.svg?height=80&width=80',
    },
    {
      id: '4',
      name: 'Lake House 1702',
      date: '08 de Mar',
      price: 'R$ 495.000,00',
      agent: 'Jayvion Simon',
      coverUrl: '/placeholder.svg?height=80&width=80',
    },
    {
      id: '5',
      name: 'Lake House 1702',
      date: '07 de Mar',
      price: 'R$ 495.000,00',
      agent: 'Jayvion Simon',
      coverUrl: '/placeholder.svg?height=80&width=80',
    },
    {
      id: '6',
      name: 'Lake House 1702',
      date: '06 de Mar',
      price: 'R$ 495.000,00',
      agent: 'Jayvion Simon',
      coverUrl: '/placeholder.svg?height=80&width=80',
    },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        {/* <Grid size={{ xs: 12, md: 12 }}>
          <AppWelcome
            title={`Crie seu primeiro produto agora! `}
            description="Para começar a gerenciar suas vendas, basta adicionar seu primeiro produto."
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Criar meu primeiro produto
              </Button>
            }
          />
        </Grid> */}

        <Grid size={{ xs: 12, md: 3 }}>
          <EcommerceWidgetSummary
            title="Imóveis cadastrados"
            percent={2.6}
            total={totalImoveis}
            time="últimos 7 dias"
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [22, 8, 35, 50, 82, 84, 77, 12],
            // }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <EcommerceWidgetSummary
            title="Alugueis cadastrados"
            percent={-2.6}
            total={0}
            time="últimos 7 dias"
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [22, 8, 35, 50, 82, 84, 77, 12],
            // }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <EcommerceWidgetSummary
            title="Novos imóveis"
            percent={10}
            total={1}
            time="último mês"
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [22, 8, 35, 50, 82, 84, 77, 12],
            // }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <EcommerceWidgetSummary
            title="Novos clientes"
            percent={3}
            total={7}
            time="últimos 7 dias"
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [22, 8, 35, 50, 82, 84, 77, 12],
            // }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <EcommerceSalesOverview
            title={`Visão geral de ${nomeDoMesAtual}`}
            data={_ecommerceSalesOverview}
            sx={{
              height: 1,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EcommerceCurrentBalance
            title={`Total de ganhos em ${nomeDoMesAtual}`}
            earning={25500}
            refunded={1600}
            orderTotal={287650}
            currentBalance={187650}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4, lg: 4 }}>
          <EcommerceSaleByGender
            title="Pipeline de negócios"
            total={2324}
            chart={{
              series: [
                { label: 'Fechados', value: 25 },
                { label: 'Em Aberto', value: 50 },
                { label: 'Perdidos', value: 75 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4, lg: 4 }}>
          <EcommerceYearlySales
            title="Total de vendas"
            subheader="(+43%) no mesmo período"
            chart={{
              categories: [
                'Jan',
                'Fev',
                'Mar',
                'Abr',
                'Mai',
                'Jun',
                'Jul',
                'Ago',
                'Set',
                'Out',
                'Nov',
                'Dez',
              ],
              series: [
                {
                  name: '2022',
                  data: [
                    {
                      name: 'Total de Vendas',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'Total de locações',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  name: '2023',
                  data: [
                    {
                      name: 'Total de Vendas',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'Total de locações',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4, lg: 4 }}>
          <AppTopRelated title="Fúnil de vendas" list={_salesFunnelData} />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <BankingBalanceStatistics
            title="Captação de imóveis"
            subheader="Estatísticas ao longo do tempo"
            chart={{
              series: [
                {
                  name: 'Semanal',
                  categories: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
                  data: [
                    { name: 'Vendas', data: [24, 41, 35, 151, 49] },
                    { name: 'Locação', data: [24, 56, 77, 88, 99] },
                    { name: 'Lançamentos', data: [40, 34, 77, 88, 99] },
                  ],
                },
                {
                  name: 'Mensal',
                  categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
                  data: [
                    { name: 'Vendas', data: [83, 112, 119, 88, 103, 112, 114, 108, 93] },
                    { name: 'Locação', data: [46, 46, 43, 58, 40, 59, 54, 42, 51] },
                    { name: 'Lançamentos', data: [25, 40, 38, 35, 20, 32, 27, 40, 21] },
                  ],
                },
                {
                  name: 'Anual',
                  categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
                  data: [
                    { name: 'Vendas', data: [76, 42, 29, 41, 27, 96] },
                    { name: 'Locação', data: [46, 44, 24, 43, 44, 43] },
                    { name: 'Lançamentos', data: [23, 22, 37, 38, 32, 25] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <EcommerceBestSalesman
            title="Melhores vendedores ( 135 )"
            tableData={_ecommerceBestSalesman}
            headCells={[
              { id: 'name', label: 'Vendedor' },
              { id: 'category', label: 'Qnt. de vendas' },
              { id: 'country', label: 'Equipe', align: 'center' },
              { id: 'totalAmount', label: 'Total', align: 'right' },
              { id: 'rank', label: 'Rank', align: 'right' },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <LatestSales title="Últimas vendas" list={_latestSales} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
