import type { IComissaoItem } from 'src/types/comissao';
import type { Theme, SxProps } from '@mui/material/styles';

import { useState, useCallback } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useDebounce } from 'minimal-shared/hooks';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link, { linkClasses } from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useSearchComissoes } from 'src/actions/comissao';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
  redirectPath: (id: string) => string;
};

export function ComissoesSearch({ redirectPath, sx }: Props) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<IComissaoItem | null>(null);

  const debouncedQuery = useDebounce(searchQuery);
  const { searchResults: options, searchLoading: loading } = useSearchData(debouncedQuery);

  const handleChange = useCallback(
    (item: IComissaoItem | null) => {
      setSelectedItem(item);
      if (item) {
        router.push(redirectPath(item.id));
      }
    },
    [redirectPath, router]
  );

  const paperStyles: SxProps<Theme> = {
    width: 320,
    [` .${autocompleteClasses.listbox}`]: {
      [` .${autocompleteClasses.option}`]: {
        p: 0,
        [` .${linkClasses.root}`]: {
          px: 1,
          py: 0.75,
          width: 1,
        },
      },
    },
  };

  return (
    <Autocomplete
      autoHighlight
      popupIcon={null}
      loading={loading}
      options={options}
      value={selectedItem}
      onChange={(event, newValue) => handleChange(newValue)}
      onInputChange={(event, newValue) => setSearchQuery(newValue)}
      getOptionLabel={(option) => option?.nome || ''}
      noOptionsText={<SearchNotFound query={debouncedQuery} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{ paper: { sx: paperStyles } }}
      sx={[{ width: { xs: 1, sm: 260 } }, ...(Array.isArray(sx) ? sx : [sx])]}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Pesquisar regras de comissão..."
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {loading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, comissao, { inputValue }) => {
        const matches = match(comissao.nome, inputValue);
        const parts = parse(comissao.nome, matches);

        return (
          <li {...props} key={comissao.id}>
            <Link
              key={inputValue}
              component={RouterLink}
              href={redirectPath(comissao.id)}
              color="inherit"
              underline="none"
            >
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </Link>
          </li>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

function useSearchData(searchQuery: string) {
  const { searchResults, searchLoading } = useSearchComissoes(
    '', // TODO: Obter do contexto da imobiliária
    searchQuery
  );

  return { searchResults, searchLoading };
}
